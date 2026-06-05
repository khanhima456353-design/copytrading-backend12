const mongoose = require('mongoose');
const Order = require('./models/Order');
const Wallet = require('./models/Wallet');

async function fixWallet() {
  await mongoose.connect('mongodb://127.0.0.1:27017/trading?retryWrites=false');

  const wallets = await Wallet.find();
  for (const wallet of wallets) {
    const openOrders = await Order.find({ userId: wallet.userId, status: 'open' });
    const totalLocked = openOrders.reduce((sum, o) => sum + (o.lockedAmount || 0), 0);

    // New approach: calculate correct balances
    const totalBalance = (wallet.availableBalance || 0) + (wallet.lockedBalance || 0);
    const correctLocked = totalLocked;
    const correctAvailable = totalBalance - correctLocked;

    if (Math.abs(correctAvailable - wallet.availableBalance) > 0.001 ||
        Math.abs(correctLocked - wallet.lockedBalance) > 0.001) {
      console.log(`Fixing wallet for userId=${wallet.userId}:`);
      console.log(`  availableBalance: ${wallet.availableBalance} -> ${correctAvailable}`);
      console.log(`  lockedBalance: ${wallet.lockedBalance} -> ${correctLocked}`);
      console.log(`  totalBalance: ${totalBalance} (unchanged)`);
      console.log(`  Open orders: ${openOrders.length}, sum lockedAmount: ${totalLocked}`);

      await Wallet.findOneAndUpdate(
        { _id: wallet._id },
        { $set: { availableBalance: correctAvailable, lockedBalance: correctLocked } }
      );

      // Verify
      const updated = await Wallet.findById(wallet._id);
      console.log(`  VERIFIED: avail=${updated.availableBalance}, locked=${updated.lockedBalance}, total=${updated.totalBalance}\n`);
    } else {
      console.log(`Wallet for userId=${wallet.userId} is already correct (avail=${wallet.availableBalance}, locked=${wallet.lockedBalance})\n`);
    }
  }

  await mongoose.disconnect();
  console.log('Done!');
}

fixWallet().catch(err => { console.error('Error:', err); process.exit(1); });
