const fs = require('fs');
const path = require('path');

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules', 'build', 'dist']);
const changed = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (skipDirs.has(name)) continue;
      walk(p);
      continue;
    }
    let s;
    try { s = fs.readFileSync(p, 'utf8'); } catch (e) { continue; }
    if (!s.includes(' marker (incoming change)
    const re = /<<<<<<<[^\n]*\n[\s\S]*?=======\n([\s\S]*?)    const ns = s.replace(re, (_, lower) => lower);
    if (ns !== s) {
      fs.writeFileSync(p, ns, 'utf8');
      changed.push(p);
      console.log('Cleaned', p);
    }
  }
}

walk(root);
console.log('\nSummary: cleaned', changed.length, 'files');
if (changed.length) process.exit(0);
else process.exit(0);
