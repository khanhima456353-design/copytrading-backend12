require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Wallet = require('./models/Wallet');
const Balance = require('./models/Balance');
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find().lean();
    console.log('users', users.map(u => ({ email: u.email, id: u._id.toString(), balance: u.balance, frozenBalance: u.frozenBalance })));
    const wallets = await Wallet.find().lean();
    console.log('wallets', wallets.map(w => ({ userId: w.userId.toString(), type: w.type, available: w.availableBalance, locked: w.lockedBalance, equity: w.equity })));
    const balances = await Balance.find().lean();
    console.log('balances', balances.map(b => ({ userId: b.userId.toString(), currency: b.currency, available: b.available, locked: b.locked, total: b.total })));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();