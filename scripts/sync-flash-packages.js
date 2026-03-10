/**
 * Sync main app (index.html, app.js, styles.css, data/, media/) into
 * USB_PACKAGE and MASJID_TV so the "flash" / offline builds have the latest
 * code and data (including hijri.json).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = ['index.html', 'app.js', 'styles.css', 'manifest.json', 'sw.js'];
const dirs = ['data', 'media'];

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(f => {
    const s = path.join(src, f);
    const d = path.join(dest, f);
    if (fs.statSync(s).isDirectory()) {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      fs.readdirSync(s).forEach(g => copyDir(path.join(s, g), path.join(d, g)));
    } else {
      fs.copyFileSync(s, d);
    }
  });
}

['USB_PACKAGE', 'MASJID_TV'].forEach(pkg => {
  const destRoot = path.join(root, pkg);
  if (!fs.existsSync(destRoot)) {
    console.log('Skip', pkg, '(folder not found)');
    return;
  }
  files.forEach(f => {
    const src = path.join(root, f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(destRoot, f));
  });
  dirs.forEach(dir => {
    copyDir(path.join(root, dir), path.join(destRoot, dir));
  });
  console.log('Synced', pkg);
});

console.log('Flash packages (USB_PACKAGE, MASJID_TV) updated from main app.');
