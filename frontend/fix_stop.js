const fs = require('fs');
const p = 'src/components/AdminSimPanel.jsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(
  "handleStop = () => {\n    simulationEngine.stopDrift();\n    setDriftActive(false);\n    setDriftState({ active: false, progress: 0 });\n    showToast('Stopped simulated drift');\n  };",
  "handleStop = async () => {\n    simulationEngine.stopDrift();\n    setDriftActive(false);\n    setDriftState({ active: false, progress: 0 });\n    showToast('Stopped simulated drift');\n    try {\n      const api = (await import('../services/api')).default || (await import('../services/api')).getAxios;\n      const client = typeof api === 'function' ? await api() : api;\n      await client.delete('/api/admin/price-override', { data: { userId: selectedUserId, pair: selectedTrade?.pair } });\n    } catch(e) { console.warn('price-override delete failed', e); }\n  };"
);
fs.writeFileSync(p, c);
console.log('Done');
