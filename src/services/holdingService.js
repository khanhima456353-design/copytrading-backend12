const Holding = require("../../models/Holding");

const getHolding = async (userId, asset) => {
  let holding = await Holding.findOne({ userId, asset });
  if (!holding) {
    holding = await Holding.create({ userId, asset, quantity: 0, lockedQuantity: 0, averagePrice: 0 });
  }
  return holding;
};

const addHolding = async ({ userId, asset, quantity, price }) => {
  const holding = await getHolding(userId, asset);
  const totalCost = holding.averagePrice * holding.quantity + price * quantity;
  holding.quantity += quantity;
  holding.averagePrice = holding.quantity ? totalCost / holding.quantity : 0;
  await holding.save();
  return holding;
};

const removeHolding = async ({ userId, asset, quantity }) => {
  const holding = await getHolding(userId, asset);
  if (holding.quantity < quantity) {
    throw new Error("Insufficient holding quantity");
  }
  holding.quantity -= quantity;
  if (holding.quantity === 0) {
    holding.averagePrice = 0;
  }
  await holding.save();
  return holding;
};

const lockHolding = async ({ userId, asset, quantity }) => {
  const holding = await getHolding(userId, asset);
  if (holding.quantity - holding.lockedQuantity < quantity) {
    throw new Error("Insufficient available asset to lock");
  }
  holding.lockedQuantity += quantity;
  await holding.save();
  return holding;
};

const unlockHolding = async ({ userId, asset, quantity }) => {
  const holding = await getHolding(userId, asset);
  if (holding.lockedQuantity < quantity) {
    throw new Error("Insufficient locked asset to unlock");
  }
  holding.lockedQuantity -= quantity;
  await holding.save();
  return holding;
};

module.exports = {
  getHolding,
  addHolding,
  removeHolding,
  lockHolding,
  unlockHolding
};
