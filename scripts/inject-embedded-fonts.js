const fs = require('fs');
const path = require('path');

const fontCssPath = path.join(__dirname, 'font-css.txt');
const embeddedCss = fs.readFileSync(fontCssPath, 'utf8').trim();
const newBlock = '/* Tajawal font - embedded base64, works offline from file:// and USB */\n' + embeddedCss;

const oldPattern = /\/\* Tajawal font[\s\S]*?\*\/\n(@font-face\{[^\n]+\}\n){4}/;

const files = [
  path.join(__dirname, '..', 'MASJID_TV', 'index.html'),
  path.join(__dirname, '..', 'USB_PACKAGE', 'index.html'),
];

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (oldPattern.test(html)) {
    html = html.replace(oldPattern, newBlock);
    fs.writeFileSync(file, html);
    console.log('Updated:', path.basename(path.dirname(file)) + '/index.html');
  } else {
    console.log('Pattern not found in', file);
  }
}
