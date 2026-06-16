const Earn = require("../models/Earn");
const Earning = require("../models/Earning");
const walletService = require("./walletService");

const DURATION_DAYS = 45;

const TIERS = [
  { min: 1000,   max: 4999,   label: "$1,000",    rate: 5  },
  { min: 5000,   max: 9999,   label: "$5,000",    rate: 10 },
  { min: 10000,  max: 14999,  label: "$10,000",   rate: 15 },
  { min: 15000,  max: 19999,  label: "$15,000",   rate: 20 },
  { min: 20000,  max: 24999,  label: "$20,000",   rate: 25 },
  { min: 25000,  max: Infinity, label: "$25,000+", rate: 30 },
];

function getTier(amount) {
  return TIERS.find((t) => amount >= t.min && amount <= t.max) || TIERS[0];
}

async function createStake(userId, amount) {
  const tier = getTier(amount);
  if (!tier) throw new Error("Invalid amount for staking");

  const totalEarn = (amount * tier.rate) / 100;
  const dailyEarn = totalEarn / DURATION_DAYS;

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + DURATION_DAYS);

  const stake = await Earn.create({
    userId,
    amount,
    rate: tier.rate,
    totalEarn,
    dailyEarn: Number(dailyEarn.toFixed(4)),
    startDate: now,
    endDate,
    status: "active",
  });

  const dailyRecords = [];
  for (let day = 1; day <= DURATION_DAYS; day++) {
    dailyRecords.push({
      userId,
      stakeId: stake._id,
      day,
      amount: Number(dailyEarn.toFixed(4)),
      paid: false,
    });
  }
  await Earning.insertMany(dailyRecords);

  return stake;
}

async function getStakes(userId) {
  return Earn.find({ userId }).sort({ createdAt: -1 });
}

async function getEarnings(stakeId, userId) {
  return Earning.find({ stakeId, userId }).sort({ day: 1 });
}

async function getSummary(userId) {
  const stakes = await Earn.find({ userId });
  const activeStakes = stakes.filter((s) => s.status === "active");
  const totalStaked = stakes.reduce((sum, s) => sum + s.amount, 0);
  const activeStaked = activeStakes.reduce((sum, s) => sum + s.amount, 0);
  const totalEarned = stakes.reduce((sum, s) => sum + (s.claimedAmount || 0), 0);
  const pendingToday = activeStakes.reduce((sum, s) => {
    const day = Math.min(Math.floor((Date.now() - new Date(s.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1, 45);
    if (day > s.lastPayoutDay && day <= 45) return sum + s.dailyEarn;
    return sum;
  }, 0);

  return {
    totalStaked,
    activeStaked,
    totalEarned,
    pendingToday,
    activeCount: activeStakes.length,
  };
}

async function processDailyPayouts() {
  const now = new Date();
  const activeStakes = await Earn.find({ status: "active" });

  let totalPaid = 0;
  let paidCount = 0;

  for (const stake of activeStakes) {
    const start = new Date(stake.startDate);
    const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const day = Math.min(daysSinceStart + 1, 45);

    if (day > stake.lastPayoutDay && day <= 45) {
      const amount = Number(stake.dailyEarn.toFixed(2));
      if (amount <= 0) continue;

      try {
        await walletService.creditBalance(
          stake.userId,
          amount,
          `Earn day ${day}/${DURATION_DAYS}: $${amount.toFixed(2)}`,
          "manual_credit"
        );

        await Earning.updateOne(
          { stakeId: stake._id, userId: stake.userId, day },
          { $set: { paid: true, paidAt: now } }
        );

        await Earn.updateOne(
          { _id: stake._id },
          {
            $set: { lastPayoutDay: day },
            $inc: { claimedAmount: amount },
          }
        );

        totalPaid += amount;
        paidCount++;
      } catch (err) {
        console.error(`[Earn] Payout failed for stake ${stake._id} day ${day}:`, err.message);
      }
    }

    if (day >= 45) {
      await Earn.updateOne({ _id: stake._id }, { $set: { status: "completed" } });
    }
  }

  return { paidCount, totalPaid };
}

module.exports = {
  createStake,
  getStakes,
  getEarnings,
  getSummary,
  processDailyPayouts,
  TIERS,
  DURATION_DAYS,
};
