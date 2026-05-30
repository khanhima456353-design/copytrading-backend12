const fs = require('fs');
const p = 'src/components/AdminSimPanel.jsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(
  "setDriftActive(true);\r\n      setDriftState((prev) => ({ ...prev, active: true }));\r\n      showToast(Started simulated drift for );\r\n    } catch (error) {",
  "setDriftActive(true);\r\n      setDriftState((prev) => ({ ...prev, active: true }));\r\n      showToast(Started simulated drift for );\r\n      try { if (selectedUserId && trade.pair) await setAdminPriceOverride(selectedUserId, trade.pair, targetPrice); } catch(e) { console.warn('price-override set failed', e); }\r\n    } catch (error) {"
);
fs.writeFileSync(p, c);
console.log('Done');
