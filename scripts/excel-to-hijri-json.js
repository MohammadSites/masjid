const fs = require('fs');
const path = require('path');

const downloads = process.env.USERPROFILE || '';
const inputPath = process.argv[2] || '';
const csvPath = inputPath || path.join(downloads, 'التقويم_الهجري.csv');
const xlsxPath = inputPath || path.join(downloads, 'التقويم_الهجري_1447 (1).xlsx');

const mapping = {};

function mergeExisting() {
  const outPath = path.join(__dirname, '..', 'data', 'hijri.json');
  if (!fs.existsSync(outPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(outPath, 'utf8'));
  } catch {
    return {};
  }
}

if (fs.existsSync(csvPath) && csvPath.toLowerCase().endsWith('.csv')) {
  // Columns: التاريخ_الميلادي, اليوم, اليوم_الهجري, الشهر_الهجري, اسم_الشهر_الهجري, السنة_الهجرية, التاريخ_الهجري
  const text = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.trim().split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < 6) continue;
    const gStr = String(cols[0]).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(gStr)) continue;
    const day = Number(cols[2]);
    const month = String(cols[4]).trim();
    const year = Number(cols[5]);
    if (!day || !month || !year) continue;
    mapping[gStr] = `${day} ${month} ${year}`;
  }
  console.log('Parsed CSV', csvPath, '→', Object.keys(mapping).length, 'entries');
} else {
  const XLSX = require('xlsx');
  const filePath = fs.existsSync(xlsxPath) ? xlsxPath : csvPath;
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // Columns: اليوم الهجري(0), الشهر الهجري(1), السنة الهجرية(2), التاريخ الميلادي(3), اليوم(4)
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
  console.log('Parsed XLSX', filePath, '→', Object.keys(mapping).length, 'entries');
}

const merged = { ...mergeExisting(), ...mapping };
const outPath = path.join(__dirname, '..', 'data', 'hijri.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(merged), 'utf8');
console.log('Wrote', Object.keys(merged).length, 'entries to', outPath);
