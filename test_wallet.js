const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/trading?retryWrites=false').then(async () => {
  const Wallet = require('./models/Wallet');
  const userId = new mongoose.Types.ObjectId('6a1c0ea1072084a1c8494e36');
  
  // Test lockBalance
  const before = await Wallet.findOneAndUpdate(
    { userId, availableBalance: { $gte: 10 } },
    { $inc: { availableBalance: -10, lockedBalance: 10 } },
    { new: false }
  );
  console.log('before:', before ? before.availableBalance + ' avail, ' + before.lockedBalance + ' locked' : 'null');
  
  const after = await Wallet.findOne({ userId });
  console.log('after available:', after.availableBalance, 'locked:', after.lockedBalance);
  
  // UNDO
  await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { availableBalance: 10, lockedBalance: -10 } }
  );
  const check = await Wallet.findOne({ userId });
  console.log('restored:', check.availableBalance, 'locked:', check.lockedBalance);
  
  await mongoose.connection.close();
  process.exit(0);
}).catch(err => { console.error('Error:', err); process.exit(1); });
