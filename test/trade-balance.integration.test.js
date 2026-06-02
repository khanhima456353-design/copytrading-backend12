const { expect } = require("chai");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Balance = require("../models/Balance");
const balanceService = require("../src/services/balanceService");

let app;
let mongoServer;
let authToken;
let testUser;

const { generateUniqueUserId } = require("../utils/userIdGenerator");

async function createTestUser(email = "test@example.com", initialBalance = 100) {
  const password = "Password123!";
  const hashed = await bcrypt.hash(password, 10);
  const userId = await generateUniqueUserId();
  const user = await User.create({
    userId,
    email,
    password: hashed,
    name: "Integration Test User",
    role: "user",
    isVerified: true,
    balance: initialBalance,
    frozenBalance: 0,
    isBanned: false,
    kycVerified: true,
    kycStatus: "approved",
  });
  return { user, password };
}

async function loginUser(email, password) {
  const res = await request(app).post("/api/auth/login").send({ identifier: email, password });
  expect(res.status).to.equal(200);
  // API returns `token` field
  expect(res.body).to.have.property("token");
  return res.body.token;
}

describe("Trade balance locking integration", function () {
  this.timeout(20000);

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "test-jwt-secret";

    const serverModule = require("../server");
    app = serverModule.app;

    await mongoose.connection.asPromise();
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    const created = await createTestUser("test@example.com", 100);
    testUser = created.user;
    authToken = await loginUser(testUser.email, created.password);
  });

  it("should place a limit buy order when funds are sufficient", async () => {
    const payload = {
      pair: "BTC/USDT",
      side: "buy",
      amount: 0.5,
      price: 10,
      type: "limit",
    };

    const res = await request(app)
      .post("/api/trade/place")
      .set("Authorization", `Bearer ${authToken}`)
      .send(payload);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body.order).to.include({ side: "buy", type: "limit" });

    const balance = await Balance.findOne({ userId: testUser._id, currency: "USDT" }).lean();
    expect(balance).to.exist;
    expect(balance.available).to.equal(95);
    expect(balance.locked).to.equal(5);
    expect(balance.total).to.equal(100);
  });

  it("should reject a buy order when funds are insufficient", async () => {
    const payload = {
      pair: "BTC/USDT",
      side: "buy",
      amount: 1000,
      price: 10,
      type: "limit",
    };

    const res = await request(app)
      .post("/api/trade/place")
      .set("Authorization", `Bearer ${authToken}`)
      .send(payload);

    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/Insufficient USDT balance/i);

    const balance = await Balance.findOne({ userId: testUser._id, currency: "USDT" }).lean();
    expect(balance.available).to.equal(100);
    expect(balance.locked).to.equal(0);
  });

  it("should unlock reserved USDT when a limit buy order is cancelled", async () => {
    const placeRes = await request(app)
      .post("/api/trade/place")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ pair: "BTC/USDT", side: "buy", amount: 1, price: 10, type: "limit" });

    expect(placeRes.status).to.equal(200);
    expect(placeRes.body).to.have.property("order");
    const orderId = placeRes.body.order.orderId;

    const cancelRes = await request(app)
      .post("/api/trade/cancel")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ orderId });

    expect(cancelRes.status).to.equal(200);
    expect(cancelRes.body).to.have.property("success", true);

    const balance = await Balance.findOne({ userId: testUser._id, currency: "USDT" }).lean();
    expect(balance.available).to.equal(100);
    expect(balance.locked).to.equal(0);
  });

  it("should lock funds when wallet is missing by restoring from user.balance", async () => {
    await Wallet.deleteMany({ userId: testUser._id });
    await balanceService.lockBalance(testUser._id, "USDT", 50);

    const wallet = await Wallet.findOne({ userId: testUser._id, type: "spot" }).lean();
    expect(wallet).to.exist;
    expect(wallet.availableBalance).to.equal(50);
    expect(wallet.lockedBalance).to.equal(50);

    const balance = await Balance.findOne({ userId: testUser._id, currency: "USDT" }).lean();
    expect(balance.available).to.equal(50);
    expect(balance.locked).to.equal(50);
  });

  it("should correctly credit USDT and preserve totals when adding profit", async () => {
    await balanceService.initializeBalances(testUser._id, 100);
    const credited = await balanceService.creditBalance(testUser._id, "USDT", 25);

    expect(credited.available).to.equal(125);
    expect(credited.total).to.equal(125);
  });
});
