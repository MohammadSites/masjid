const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');

if (!fs.existsSync(www)) fs.mkdirSync(www, { recursive: true });

const files = ['index.html', 'app.js', 'styles.css', 'manifest.json', 'sw.js'];
files.forEach(f => {
  const src = path.join(root, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(www, f));
});

['data', 'media'].forEach(dir => {
  const src = path.join(root, dir);
  const dest = path.join(www, dir);
  if (fs.existsSync(src)) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(f => {
      const s = path.join(src, f);
      const d = path.join(dest, f);
      if (fs.statSync(s).isDirectory()) {
        if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
        fs.readdirSync(s).forEach(g => fs.copyFileSync(path.join(s, g), path.join(d, g)));
      } else fs.copyFileSync(s, d);
    });
  }
});

console.log('Copied web app to www/');
