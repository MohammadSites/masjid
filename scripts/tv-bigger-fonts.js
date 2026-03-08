const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const files = [
  path.join(rootDir, 'MASJID_TV', 'index.html'),
  path.join(rootDir, 'USB_PACKAGE', 'index.html'),
];

const replacements = [
  // Title (top) - bigger
  ['.mosque-name{font-size:min(4vw,2.2rem);', '.mosque-name{font-size:min(8vw,4.4rem);'],
  // Adhkar box - title and text bigger
  ['.adhkar-title{font-size:min(2.5vw,1.4rem);', '.adhkar-title{font-size:min(5vw,2.8rem);'],
  ['.adhkar-quote{font-size:min(3.5vw,2rem);', '.adhkar-quote{font-size:min(7vw,4rem);'],
  ['.adhkar-source{font-size:min(2vw,1.1rem);', '.adhkar-source{font-size:min(4vw,2.2rem);'],
  // Prayer cards container - 2x spacing
  ['.prayer-cards{display:flex;justify-content:center;align-items:center;gap:18px;padding:12px 20px 24px;', '.prayer-cards{display:flex;justify-content:center;align-items:center;gap:36px;padding:24px 40px 48px;'],
  // Prayer card - 2x size (min-width, padding)
  ['.prayer-card{background:linear-gradient(160deg,rgba(40,25,60,.9),rgba(30,18,50,.92));border-radius:21px;padding:23px 31px;min-width:208px;', '.prayer-card{background:linear-gradient(160deg,rgba(40,25,60,.9),rgba(30,18,50,.92));border-radius:28px;padding:46px 62px;min-width:416px;'],
  // Card fonts 2x
  ['.prayer-card .name{font-size:1.5rem;', '.prayer-card .name{font-size:3rem;'],
  ['.prayer-card .time{font-size:2.47rem;', '.prayer-card .time{font-size:4.94rem;'],
  ['.prayer-card .time-ampm{font-size:1.25rem;', '.prayer-card .time-ampm{font-size:2.5rem;'],
];

for (const filePath of files) {
  let html = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) {
    if (html.includes(from)) {
      html = html.replace(from, to);
    }
  }
  fs.writeFileSync(filePath, html);
  console.log('Updated:', path.relative(rootDir, filePath));
}
console.log('Done. Title, adhkar, and prayer cards are now 2x larger.');
