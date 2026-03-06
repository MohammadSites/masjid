const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');

if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true });
}
fs.mkdirSync(publicDir, { recursive: true });

const files = ['index.html', 'app.js', 'styles.css', 'manifest.json', 'sw.js'];
files.forEach(f => {
  const src = path.join(root, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(publicDir, f));
});

['data', 'media'].forEach(dir => {
  const src = path.join(root, dir);
  const dest = path.join(publicDir, dir);
  if (fs.existsSync(src)) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(f => {
      const s = path.join(src, f);
      const d = path.join(dest, f);
      if (fs.statSync(s).isDirectory()) {
        fs.mkdirSync(d, { recursive: true });
        fs.readdirSync(s).forEach(g => fs.copyFileSync(path.join(s, g), path.join(d, g)));
      } else fs.copyFileSync(s, d);
    });
  }
});

console.log('Copied web app to public/');
