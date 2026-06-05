const mongoose = require('mongoose');
const Order = require('./models/Order');
const Wallet = require('./models/Wallet');

mongoose.connect('mongodb://127.0.0.1:27017/trading?retryWrites=false').then(async () => {
  // Check what happens with session.withTransaction on standalone
  const session = await mongoose.startSession();
  let created;
  try {
    await session.withTransaction(async () => {
      created = await Order.create([{
        userId: new mongoose.Types.ObjectId('6a1c0ea1072084a1c8494e36'),
        pair: 'TEST/BTC',
        side: 'buy',
        type: 'market',
        entryPrice: 0,
        quantity: 0.001,
        lockedAmount: 100,
        status: 'open',
        openedAt: new Date(),
      }], { session });
      console.log('Order created inside transaction:', created[0]._id);
    });
    console.log('Transaction committed successfully');
  } catch (err) {
    console.log('Transaction failed:', err.message);
    console.log('Created order still exists?', created ? 'YES (created variable set)' : 'NO');
  } finally {
    await session.endSession();
  }
  
  // Check if order exists in DB after failed transaction
  if (created) {
    const found = await Order.findById(created[0]._id);
    console.log('Order in DB after transaction:', found ? 'EXISTS' : 'GONE (rolled back)');
    if (found) await Order.findByIdAndDelete(created[0]._id);
  }

  await mongoose.connection.close();
  process.exit(0);
}).catch(e => { console.error('Error:', e); process.exit(1); });
