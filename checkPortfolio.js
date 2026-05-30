/**
 * checkPortfolio.js
 * Run: node checkPortfolio.js
 * Shows exactly what's making Total Portfolio higher than Available USDT
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Position   = require('./models/Position');
const Order      = require('./models/Order');
const Wallet     = require('./models/Wallet');
const User       = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find().select('email balance');

  for (const user of users) {
    console.log('\n=============================');
    console.log('User:', user.email);
    console.log('user.balance:', user.balance);

    const wallet = await Wallet.findOne({ userId: user._id, type: 'spot' });
    console.log('wallet.availableBalance:', wallet?.availableBalance);
    console.log('wallet.lockedBalance:', wallet?.lockedBalance);
    console.log('wallet.equity:', wallet?.equity);

    const positions = await Position.find({ userId: user._id });
    console.log('Open positions:', positions.length);
    positions.forEach(p => console.log('  -', p.pair, 'size:', p.size, 'margin:', p.margin));

    const openOrders = await Order.find({ userId: user._id, status: 'open' });
    console.log('Open orders:', openOrders.length);

    const filledOrders = await Order.find({ userId: user._id, status: 'filled' }).sort({ createdAt: -1 }).limit(3);
    console.log('Last 3 filled orders:');
    filledOrders.forEach(o => console.log('  -', o.side, o.amount, o.pair, '@', o.price));
  }

  console.log('\n=============================');
  console.log('Done!');
  await mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
