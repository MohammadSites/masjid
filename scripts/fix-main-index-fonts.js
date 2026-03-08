const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const fontsDir = path.join(rootDir, 'MASJID_TV', 'fonts');
const mainPath = path.join(rootDir, 'index.html');

const weights = [
  { file: 'Tajawal-ar-400.woff2', weight: 400 },
  { file: 'Tajawal-ar-700.woff2', weight: 700 },
  { file: 'Tajawal-ar-800.woff2', weight: 800 },
  { file: 'Tajawal-ar-900.woff2', weight: 900 },
];

const unicodeRange = 'U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFC';
const lines = [];

for (const { file, weight } of weights) {
  const filePath = path.join(fontsDir, file);
  const buf = fs.readFileSync(filePath);
  const b64 = buf.toString('base64');
  lines.push(
    `@font-face{font-family:'Tajawal';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2');unicode-range:${unicodeRange}}`
  );
}

const fontBlock = '/* Tajawal font - embedded base64, works offline */\n' + lines.join('\n');

let mainHtml = fs.readFileSync(mainPath, 'utf8');

// Remove Google Fonts links (remove only the link line, keep newline so structure is preserved)
mainHtml = mainHtml
  .replace(/\n\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com" \/>/g, '')
  .replace(/\n\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/>/g, '')
  .replace(/\n\s*<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Tajawal[^"]*" rel="stylesheet" \/>/g, '');

// Insert embedded font after <title> (match even if no newline, e.g. after link removal)
const styleBlock = '\n  <style>\n    ' + fontBlock.replace(/\n/g, '\n    ') + '\n  </style>\n';
mainHtml = mainHtml.replace(
  /(<title>شاشة المسجد<\/title>)(\s*)/,
  '$1' + styleBlock + '$2'
);

fs.writeFileSync(mainPath, mainHtml);
console.log('Updated index.html: removed Google Fonts links, added embedded Tajawal (offline-ready).');
