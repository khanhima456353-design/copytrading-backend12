const fs = require('fs');
const p = 'src/components/AdminSimPanel.jsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(
  "import {\n  getAdminUsers,\n  getAdminUserById,\n  getAdminUserOpenPositions,\n  getAdminUserOpenOrders,\n  updateAdminTrade,\n} from '../services/adminService';",
  "import {\n  getAdminUsers,\n  getAdminUserById,\n  getAdminUserOpenPositions,\n  getAdminUserOpenOrders,\n  updateAdminTrade,\n  setAdminPriceOverride,\n  clearAdminPriceOverride,\n} from '../services/adminService';"
);
fs.writeFileSync(p, c);
console.log('Done');
