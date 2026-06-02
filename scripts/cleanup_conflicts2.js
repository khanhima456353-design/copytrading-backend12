const fs = require('fs');
const path = require('path');

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules', 'build', 'dist', '.vscode']);
const changed = [];

function processFile(p) {
  try {
    let s = fs.readFileSync(p, 'utf8');
    if (!s.includes('', iStart);
      if (iEq === -1) break;
      const iEnd = s.indexOf('      if (iEnd === -1) break;
      let afterEq = iEq + '======='.length;
      if (s.slice(afterEq, afterEq + 2) === '\r\n') afterEq += 2;
      else if (s[afterEq] === '\n') afterEq += 1;
      let endAfter = iEnd;
      const nl = s.indexOf('\n', iEnd);
      if (nl !== -1) endAfter = nl + 1;
      const lower = s.slice(iEq + '======='.length, iEnd);
      s = s.slice(0, iStart) + lower + s.slice(endAfter);
      modified = true;
    }
    if (modified) {
      fs.writeFileSync(p, s, 'utf8');
      changed.push(p);
      console.log('Cleaned', p);
    }
    return modified;
  } catch (e) {
    console.error('Error processing', p, e.message);
    return false;
  }
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    try {
      const st = fs.statSync(p);
      if (st.isDirectory()) { if (skipDirs.has(name)) continue; walk(p); continue; }
      processFile(p);
    } catch (e) { }
  }
}

walk(root);
console.log('\nSummary: cleaned', changed.length, 'files');
