const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const xlsxPath = path.join(process.env.USERPROFILE || '', 'Downloads', 'التقويم_الهجري_1447 (1).xlsx');
if (!fs.existsSync(xlsxPath)) {
  console.error('File not found:', xlsxPath);
  process.exit(1);
}

const workbook = XLSX.readFile(xlsxPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// Columns: اليوم الهجري(0), الشهر الهجري(1), السنة الهجرية(2), التاريخ الميلادي(3), اليوم(4)
const mapping = {};
for (let i = 1; i < rows.length; i++) {
  const row = rows[i] || [];
  const hijriDay = row[0];
  const hijriMonth = row[1];
  const hijriYear = row[2];
  const gregorianDate = row[3];
  if (gregorianDate == null || hijriMonth == null || hijriYear == null) continue;
  const gStr = String(gregorianDate).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(gStr)) continue;
  const day = hijriDay != null ? Number(hijriDay) : 1;
  const month = String(hijriMonth).trim();
  const year = Number(hijriYear);
  mapping[gStr] = `${day} ${month} ${year}`;
}

const outPath = path.join(__dirname, '..', 'data', 'hijri.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(mapping, null, 0), 'utf8');
console.log('Wrote', Object.keys(mapping).length, 'entries to', outPath);
