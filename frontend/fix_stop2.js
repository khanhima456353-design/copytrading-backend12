const fs = require('fs');
const p = 'src/components/AdminSimPanel.jsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(
  "try {\n      const api = (await import('../services/api')).default || (await import('../services/api')).getAxios;\n      const client = typeof api === 'function' ? await api() : api;\n      await client.delete('/api/admin/price-override', { data: { userId: selectedUserId, pair: selectedTrade?.pair } });\n    } catch(e) { console.warn('price-override delete failed', e); }",
  "try {\n      if (selectedUserId && selectedTrade?.pair) await clearAdminPriceOverride(selectedUserId, selectedTrade.pair);\n    } catch(e) { console.warn('price-override delete failed', e); }"
);
fs.writeFileSync(p, c);
console.log('Done');
