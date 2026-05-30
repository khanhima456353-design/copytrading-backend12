const fs = require('fs');
const p = 'src/services/adminService.ts';
let c = fs.readFileSync(p, 'utf8');
const addition = "\nexport async function setAdminPriceOverride(userId: string, pair: string, price: number) {\n  return adminClient.post('/api/admin/price-override', { userId, pair, price });\n}\nexport async function clearAdminPriceOverride(userId: string, pair: string) {\n  return adminClient.delete('/api/admin/price-override', { data: { userId, pair } });\n}\n";
c = c + addition;
fs.writeFileSync(p, c);
console.log('Done');
