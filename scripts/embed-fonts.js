const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'MASJID_TV', 'fonts');
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

console.log(lines.join('\n'));
