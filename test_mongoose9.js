const mongoose = require('mongoose');
console.log('version:', mongoose.version);
const s = new mongoose.Schema({ n: Number });
const M = mongoose.model('TestDef', s);
mongoose.connect('mongodb://127.0.0.1:27017/test_def?retryWrites=false').then(async () => {
  await M.deleteMany({});
  await M.create({ n: 1 });
  // Without any return option
  const r = await M.findOneAndUpdate({ n: 1 }, { $inc: { n: 1 } });
  console.log('result (no options):', r ? r.n : 'null');
  // Check current value
  const c = await M.findOne({ n: 2 });
  console.log('current:', c ? c.n : 'null');
  // Now with { new: true }
  await M.deleteMany({});
  await M.create({ n: 1 });
  const r2 = await M.findOneAndUpdate({ n: 1 }, { $inc: { n: 1 } }, { new: true });
  console.log('result { new: true }:', r2 ? r2.n : 'null');
  await M.deleteMany({});
  await mongoose.connection.close();
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
