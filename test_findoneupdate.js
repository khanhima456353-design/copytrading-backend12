const mongoose = require('mongoose');
console.log('Mongoose version:', mongoose.version);
const s = new mongoose.Schema({ n: Number });
const M = mongoose.model('TestFU', s);

mongoose.connect('mongodb://127.0.0.1:27017/test_fu?retryWrites=false').then(async () => {
  await M.deleteMany({});

  // Test { new: false }
  await M.create({ n: 1 });
  const r1 = await M.findOneAndUpdate({ n: 1 }, { $inc: { n: 1 } }, { new: false });
  console.log('{ new: false } returns:', r1 ? r1.n : 'null');
  const c1 = await M.findOne({});
  console.log('  current value:', c1.n);

  // Test { returnDocument: 'before' }
  await M.deleteMany({});
  await M.create({ n: 1 });
  const r2 = await M.findOneAndUpdate({ n: 1 }, { $inc: { n: 1 } }, { returnDocument: 'before' });
  console.log('returnDocument before returns:', r2 ? r2.n : 'null');
  const c2 = await M.findOne({});
  console.log('  current value:', c2.n);

  // Test { returnDocument: 'after' }
  await M.deleteMany({});
  await M.create({ n: 1 });
  const r3 = await M.findOneAndUpdate({ n: 1 }, { $inc: { n: 1 } }, { returnDocument: 'after' });
  console.log('returnDocument after returns:', r3 ? r3.n : 'null');
  const c3 = await M.findOne({});
  console.log('  current value:', c3.n);

  await M.deleteMany({});
  await mongoose.connection.close();
  process.exit(0);
}).catch(e => { console.error('Error:', e); process.exit(1); });
