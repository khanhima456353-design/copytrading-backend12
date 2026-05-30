const fs = require('fs');
const p = 'src/components/AdminSimPanel.jsx';
let c = fs.readFileSync(p, 'utf8');
const old = "simulated drift for );\r\n    } catch (error) {";
const neu = "simulated drift for );\r\n      try { if (selectedUserId && trade.pair) await setAdminPriceOverride(selectedUserId, trade.pair, targetPrice); } catch(e) { console.warn('price-override set failed', e); }\r\n    } catch (error) {";
if (c.includes(old)) { c = c.replace(old, neu); fs.writeFileSync(p, c); console.log('Done'); }
else console.log('NOT FOUND');
