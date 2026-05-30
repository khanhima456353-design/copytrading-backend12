/**
 * cleanGhostOrders.js
 * Run once: node cleanGhostOrders.js
 * Removes filled orders with price=0 that inflate portfolio calculations
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Cleaning ghost orders...\n');

  // Find all filled orders with price 0 or missing price
  const ghost = await Order.find({
    status: 'filled',
    $or: [
      { price: 0 },
      { price: null },
      { price: { $exists: false } }
    ]
  });

  console.log(`Found ${ghost.length} ghost order(s) with price=0`);
  ghost.forEach(o => console.log(` - ${o.side} ${o.amount} ${o.pair} @ ${o.price} [${o.status}]`));

  if (ghost.length > 0) {
    await Order.deleteMany({
      status: 'filled',
      $or: [
        { price: 0 },
        { price: null },
        { price: { $exists: false } }
      ]
    });
    console.log(`\n✅ Deleted ${ghost.length} ghost order(s)`);
  }

  // Also cancel any lingering open orders
  const openOrders = await Order.find({ status: 'open' });
  if (openOrders.length > 0) {
    await Order.updateMany(
      { status: 'open' },
      { $set: { status: 'cancelled' } }
    );
    console.log(`✅ Cancelled ${openOrders.length} lingering open order(s)`);
  }

  console.log('\n✅ Cleanup complete! Restart your server now.');
  await mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
