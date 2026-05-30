/**
 * resetWallets.js
 * Run once: node resetWallets.js
 * Syncs every user's Wallet to match their actual user.balance
 * Also clears any leftover lockedBalance from cancelled/ghost orders
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User   = require('./models/User');
const Wallet = require('./models/Wallet');
const Order  = require('./models/Order');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB...\n');

  const users = await User.find();
  console.log(`Found ${users.length} user(s) to sync\n`);

  for (const user of users) {
    const realBalance = Number(user.balance) || 0;

    // Cancel any ghost open orders (orders stuck as open with no position)
    const ghostOrders = await Order.updateMany(
      { userId: user._id, status: { $in: ['open', 'partially_filled'] } },
      { $set: { status: 'cancelled' } }
    );

    if (ghostOrders.modifiedCount > 0) {
      console.log(`  ⚠️  Cancelled ${ghostOrders.modifiedCount} ghost order(s) for ${user.email}`);
    }

    // Sync wallet to real balance
    await Wallet.findOneAndUpdate(
      { userId: user._id, type: 'spot' },
      {
        $set: {
          availableBalance: realBalance,
          lockedBalance:    0,
          borrowedBalance:  0,
          unrealizedPnl:    0,
          equity:           realBalance
        }
      },
      { upsert: true }
    );

    console.log(`✅ ${user.email} — wallet synced to $${realBalance.toLocaleString()}`);
  }

  console.log('\n✅ All wallets synced successfully!');
  console.log('Restart your server now: node server.js');
  await mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
