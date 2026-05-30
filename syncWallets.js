const mongoose = require('mongoose');
require('dotenv').config();
const User   = require('./models/User');
const Wallet = require('./models/Wallet');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find();
  console.log(`Found ${users.length} user(s) to sync...`);
  for (const user of users) {
    await Wallet.findOneAndUpdate(
      { userId: user._id, type: 'spot' },
      { $set: { availableBalance: user.balance || 0, lockedBalance: 0, borrowedBalance: 0, unrealizedPnl: 0, equity: user.balance || 0 } },
      { upsert: true }
    );
    console.log(`Wallet synced for ${user.email} - balance: $${user.balance || 0}`);
  }
  await mongoose.disconnect();
  console.log('Done!');
}).catch(err => { console.error('Error:', err.message); });
