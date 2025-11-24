#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function prettifyName(name) {
  // turn "gradecalc" or "grade-calc.html" into "Gradecalc" / "Grade Calc"
  const base = name.replace(/\.(html|htm)$/, '').replace(/[-_]/g, ' ');
  return base
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function scanDirForEntries(dirRelative, urlPrefix) {
  const dir = path.join(process.cwd(), dirRelative);
  if (!fs.existsSync(dir)) return [];
  const items = fs.readdirSync(dir);
  const out = [];

  // Create a top-level index entry if a listing page exists
  const indexCandidates = ['index.html', 'index.htm', 'README.md'];
  for (const cand of indexCandidates) {
    if (fs.existsSync(path.join(dir, cand))) {
      out.push({ id: path.basename(dirRelative), name: prettifyName(path.basename(dirRelative)), type: 'html', url: `/${dirRelative.replace(/^\//, '')}` });
      break;
    }
  }

  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      // assume directory has its own page
      const url = `/${dirRelative.replace(/\\\/$/, '')}/${item}/`;
      out.push({ id: item, name: prettifyName(item), type: 'html', url });
    } else if (stat.isFile()) {
      if (item.endsWith('.html') || item.endsWith('.htm')) {
        if (item.toLowerCase().startsWith('index')) continue; // already handled
        const name = item.replace(/\.html?$|\.(htm)$/i, '');
        const url = `/${dirRelative.replace(/\\\/$/, '')}/${item}`;
        out.push({ id: name, name: prettifyName(name), type: 'html', url });
      }
    }
  }
  return out;
}

function writeJson(outPath, arr) {
  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, JSON.stringify(arr, null, 2) + '\n', 'utf8');
  console.log('Wrote', outPath);
}

function main() {
  const apps = scanDirForEntries('pages/apps', 'pages/apps');
  const games = scanDirForEntries('pages/games', 'pages/games');

  // Prepend collection entry
  const appsOut = [{ id: 'apps', name: 'Apps', type: 'html', url: '/pages/apps?upd=' }, ...apps];
  const gamesOut = [{ id: 'games', name: 'Games', type: 'html', url: '/pages/games?upd=' }, ...games];

  writeJson(path.join('public', 'assets', 'json', 'Apps.json'), appsOut);
  writeJson(path.join('public', 'assets', 'json', 'Games.json'), gamesOut);
}

main();
