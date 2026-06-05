const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/trading?retryWrites=false').then(async () => {
  const Transaction = require('./models/Transaction');
  const userId = new mongoose.Types.ObjectId('6a1c0ea1072084a1c8494e36');
  
  const txs = await Transaction.find({ userId, type: 'trade_open' }).sort({ createdAt: 1 }).lean();
  txs.forEach((t, i) => {
    console.log(`Tx ${i+1}: reference=${t.reference}, type=${typeof t.reference}, isObjectId=${t.reference instanceof mongoose.Types.ObjectId}`);
  });
  
  await mongoose.connection.close();
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
