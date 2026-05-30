const fs = require('fs');
const p = 'src/components/AdminSimPanel.jsx';
let c = fs.readFileSync(p, 'utf8');
const marker = 'simulated drift for ';
const i = c.indexOf(marker);
if (i === -1) { console.log('NOT FOUND'); process.exit(1); }
const insertAt = c.indexOf('\r\n    } catch (error) {', i);
const injection = '\r\n      try { if (selectedUserId && trade.pair) await setAdminPriceOverride(selectedUserId, trade.pair, targetPrice); } catch(e) { console.warn(e); }';
c = c.slice(0, insertAt) + injection + c.slice(insertAt);
fs.writeFileSync(p, c);
console.log('Done');
