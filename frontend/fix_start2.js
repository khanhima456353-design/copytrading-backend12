const fs = require('fs');
const p = 'src/components/AdminSimPanel.jsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(
  "setDriftActive(true);\n      setDriftState((prev) => ({ ...prev, active: true }));\n      showToast(Started simulated drift for );",
  "setDriftActive(true);\n      setDriftState((prev) => ({ ...prev, active: true }));\n      showToast(Started simulated drift for );\n      try { if (selectedUserId && trade.pair) await setAdminPriceOverride(selectedUserId, trade.pair, targetPrice); } catch(e) { console.warn('price-override set failed', e); }"
);
fs.writeFileSync(p, c);
console.log('Done');
