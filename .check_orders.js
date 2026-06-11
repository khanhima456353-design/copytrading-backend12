const mongoose = require('mongoose');
(async () => {
  await mongoose.connect('mongodb://localhost:27017/trading');
  const orders = await mongoose.connection.db.collection('orders').find({
    _id: { $in: [
      new mongoose.Types.ObjectId('6a2a175e614609a7342b5fa6'),
      new mongoose.Types.ObjectId('6a29838a2189e0b9d31d1bc8')
    ]}
  }).toArray();
  console.log('Orders:', JSON.stringify(orders.map(o => ({
    _id: o._id, status: o.status, price: o.price, quantity: o.quantity,
    entryPrice: o.entryPrice, openedAt: o.openedAt
  })), null, 2));
  
  const pos = await mongoose.connection.db.collection('positions').findOne({});
  if (pos) {
    console.log('Position:', JSON.stringify({
      size: pos.size, entryPrice: pos.entryPrice, margin: pos.margin
    }, null, 2));
  }
  await mongoose.disconnect();
})().catch(e => console.error(e.message));
