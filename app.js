const DEFAULTS_URL = "data/config.json";
const DEFAULT_TIMETABLE_URL = "data/timetable.csv";
const HADITH_URL = "data/hadith.json";
const QURAN_URL = "data/quran.json";

const LS_CONFIG = "msq_cfg_v1";
const LS_TIMETABLE = "msq_timetable_csv_v1";

let cfg = null;
let timetableRows = [];
let timetableFormat = "iso"; // "iso" = date column YYYY-MM-DD, "jerusalem" = MonthNum + Day
let hadithList = [];
let quranList = [];
let mediaIndex = 0;

const el = (id) => document.getElementById(id);

function pad2(n){ return String(n).padStart(2,"0"); }
function todayISO(d=new Date()){
  const y=d.getFullYear(), m=pad2(d.getMonth()+1), day=pad2(d.getDate());
  return `${y}-${m}-${day}`;
}
function hhmmToDate(hhmm, baseDate=new Date()){
  const [hh,mm]=hhmm.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(hh, mm, 0, 0);
  return d;
}
function addHoursToHhmm(hhmm, hours){
  if(!hhmm || !hhmm.match(/\d/)) return hhmm;
  const [h, m] = hhmm.split(":").map(n=>parseInt(n,10)||0);
  const totalMin = (h * 60 + m) + hours * 60;
  const wrapped = ((totalMin % (24*60)) + (24*60)) % (24*60);
  const nh = Math.floor(wrapped / 60);
  const nm = wrapped % 60;
  return `${pad2(nh)}:${pad2(nm)}`;
}
function formatClock(d=new Date()){
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}
function formatClock12h(d=new Date()){
  const h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
  const h12 = h === 0 ? 12 : (h > 12 ? h - 12 : h);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h12}:${pad2(m)}:${pad2(s)} ${ampm}`;
}
function formatTime12h(hhmm){
  if(!hhmm || !hhmm.match(/\d/)) return { time: "—", ampm: "" };
  const [h, m] = hhmm.split(":").map(n=>parseInt(n,10));
  const hour = isNaN(h) ? 0 : h;
  const min = isNaN(m) ? 0 : m;
  const isPm = hour >= 12;
  const h12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
  return { time: `${h12}:${pad2(min)}`, ampm: isPm ? "PM" : "AM" };
}
function formatDateHuman(d=new Date(), lang="ar"){
  // force Arabic locale if Arabic selected, even if device language is different
  try{
    const locale = (lang === "ar") ? "ar-EG" : lang;
    return new Intl.DateTimeFormat(locale, {weekday:"long", year:"numeric", month:"long", day:"2-digit"}).format(d);
  }catch{
    return d.toDateString();
  }
}

function parseCSV(csvText){
  const lines = csvText.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(s=>s.trim());
  const out = [];
  for(let i=1;i<lines.length;i++){
    const cols = lines[i].split(",").map(s=>s.trim());
    if(cols.length < headers.length) continue;
    const row = {};
    headers.forEach((h,idx)=> row[h]=cols[idx]);
    out.push(row);
  }
  return out;
}

// Jerusalem bilingual CSV: MonthNum, Day, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha (12h format)
function isJerusalemFormat(rows){
  const r = rows[0];
  return r && "MonthNum" in r && "Day" in r && "Fajr" in r;
}

function to24h(hhmm, isAfternoon){
  if(!hhmm || !hhmm.match(/\d/)) return "00:00";
  const parts = hhmm.split(":").map(s=>s.trim());
  let h = parseInt(parts[0], 10);
  const m = parts[1] ? parseInt(parts[1], 10) : 0;
  if(isNaN(h)) h = 0;
  if(isAfternoon && h >= 1 && h <= 7) h += 12;
  return `${pad2(h)}:${pad2(m)}`;
}

function normalizeJerusalemRows(rows){
  return rows.map(r=>{
    const afternoon = ["Dhuhr","Asr","Maghrib","Isha"];
    return {
      MonthNum: r.MonthNum,
      Day: r.Day,
      date: `${pad2(Number(r.MonthNum))}-${pad2(Number(r.Day))}`,
      fajr: to24h(r.Fajr, false),
      sunrise: to24h(r.Sunrise, false),
      dhuhr: to24h(r.Dhuhr, false),
      asr: to24h(r.Asr, true),
      maghrib: to24h(r.Maghrib, true),
      isha: to24h(r.Isha, true)
    };
  });
}

async function loadJSON(url){
  const res = await fetch(url, {cache:"no-store"});
  if(!res.ok) throw new Error(`Failed ${url}`);
  return res.json();
}
async function loadText(url){
  const res = await fetch(url, {cache:"no-store"});
  if(!res.ok) throw new Error(`Failed ${url}`);
  return res.text();
}

function getStoredConfig(){
  try{
    const raw = localStorage.getItem(LS_CONFIG);
    return raw ? JSON.parse(raw) : null;
  }catch{ return null; }
}
function setStoredConfig(obj){
  localStorage.setItem(LS_CONFIG, JSON.stringify(obj));
}
function getStoredTimetableCSV(){
  return localStorage.getItem(LS_TIMETABLE);
}
function setStoredTimetableCSV(csv){
  localStorage.setItem(LS_TIMETABLE, csv);
}

function i18n(lang){
  const dict = {
    en: { nextPrayer:"Next prayer", prayerTimes:"Prayer Times", reminder:"Reminder" },
    ar: { nextPrayer:"الصلاة القادمة", prayerTimes:"مواقيت الصلاة", reminder:"تذكير" },
    he: { nextPrayer:"התפילה הבאה", prayerTimes:"זמני תפילה", reminder:"תזכורת" }
  };
  return dict[lang] || dict.en;
}

function applyLang(){
  document.documentElement.lang = cfg.lang;
  document.documentElement.dir = (cfg.lang==="ar" ? "rtl" : "ltr");
  const nameEl = document.getElementById("mosqueName");
  if(nameEl) nameEl.textContent = cfg.mosqueName || "مسجد";
}

function findTodayRow(){
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  if (timetableFormat === "jerusalem") {
    const r = timetableRows.find(r => Number(r.MonthNum) === month && Number(r.Day) === day);
    if (!r) return null;
    return {
      fajr: r.fajr,
      sunrise: addHoursToHhmm(r.sunrise, 1),
      dhuhr: r.dhuhr,
      asr: r.asr,
      maghrib: r.maghrib,
      isha: r.isha
    };
  }
  const id = todayISO();
  return timetableRows.find(r => r.date === id) || null;
}

const IQAMAH_OFFSET_MINUTES = { fajr: 25, dhuhr: 15, asr: 15, maghrib: 10, isha: 10 };
const ADHKAR_DURATION_MINUTES = 6;
const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
function prayerName(key){
  const names = { fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء" };
  return cfg && cfg.lang === "ar" ? names[key] : key;
}

function getHeroState(todayRow, now){
  const list = PRAYER_KEYS.map(key => ({
    key,
    name: prayerName(key),
    adhanTime: hhmmToDate(todayRow[key], now),
    offsetMin: IQAMAH_OFFSET_MINUTES[key]
  }));
  for (const p of list) {
    const iqamahTime = new Date(p.adhanTime.getTime() + p.offsetMin * 60 * 1000);
    const adhkarEndTime = new Date(iqamahTime.getTime() + ADHKAR_DURATION_MINUTES * 60 * 1000);
    if (now < p.adhanTime)
      return { mode: "next", nextPrayer: p, nextAt: p.adhanTime };
    if (now < iqamahTime)
      return { mode: "iqamah", prayer: p, iqamahAt: iqamahTime };
    if (now < adhkarEndTime)
      return { mode: "adhkar" };
  }
  const next = computeNextPrayer(todayRow);
  return { mode: "next", nextPrayer: { key: next.key, name: next.name, adhanTime: next.dt }, nextAt: next.dt };
}

function computeNextPrayer(todayRow){
  const now = new Date();
  const list = [
    {key:"fajr", name: prayerName("fajr"), time: todayRow.fajr},
    {key:"dhuhr", name: prayerName("dhuhr"), time: todayRow.dhuhr},
    {key:"asr", name: prayerName("asr"), time: todayRow.asr},
    {key:"maghrib", name: prayerName("maghrib"), time: todayRow.maghrib},
    {key:"isha", name: prayerName("isha"), time: todayRow.isha},
  ];

  for(const p of list){
    const dt = hhmmToDate(p.time, now);
    if(dt > now) return { ...p, dt };
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate()+1);
  let tomRow = null;
  if (timetableFormat === "jerusalem") {
    const m = tomorrow.getMonth() + 1, d = tomorrow.getDate();
    const tr = timetableRows.find(r => Number(r.MonthNum) === m && Number(r.Day) === d);
    if (tr) tomRow = { fajr: tr.fajr, sunrise: addHoursToHhmm(tr.sunrise, 1), dhuhr: tr.dhuhr, asr: tr.asr, maghrib: tr.maghrib, isha: tr.isha };
  } else {
    tomRow = timetableRows.find(r => r.date === todayISO(tomorrow));
  }
  if(tomRow){
    const dt = hhmmToDate(tomRow.fajr, tomorrow);
    return { key:"fajr", name: list[0].name, time: tomRow.fajr, dt };
  }
  return { ...list[0], dt: hhmmToDate(list[0].time, now) };
}

function renderTimes(todayRow, nextKey){
  const items = [
    {k:"sunrise", n: cfg.lang==="ar"?"الشروق":(cfg.lang==="he"?"זריחה":"Sunrise"), v: todayRow.sunrise},
    {k:"fajr", n: cfg.lang==="ar"?"الفجر":(cfg.lang==="he"?"פג׳ר":"Fajr"), v: todayRow.fajr},
    {k:"dhuhr", n: cfg.lang==="ar"?"الظهر":(cfg.lang==="he"?"ד׳והר":"Dhuhr"), v: todayRow.dhuhr},
    {k:"asr", n: cfg.lang==="ar"?"العصر":(cfg.lang==="he"?"עסר":"Asr"), v: todayRow.asr},
    {k:"maghrib", n: cfg.lang==="ar"?"المغرب":(cfg.lang==="he"?"מגריב":"Maghrib"), v: todayRow.maghrib},
    {k:"isha", n: cfg.lang==="ar"?"العشاء":(cfg.lang==="he"?"עִשָא":"Isha"), v: todayRow.isha},
  ];
  const container = el("prayerCards");
  if(!container) return;
  container.innerHTML = "";
  items.forEach(it=>{
    const card = document.createElement("div");
    card.className = "prayer-card" + (it.k===nextKey ? " next" : "");
    const { time, ampm } = formatTime12h(it.v);
    card.innerHTML = `<div class="name">${it.n}</div><div class="time">${time}</div><div class="time-ampm">${ampm}</div>`;
    container.appendChild(card);
  });
}

function renderTicker(){
  const msgs = (cfg.tickerMessages || []).filter(Boolean);
  const track = el("tickerTrack");
  const text = msgs.length ? msgs.join("   •   ") : "";
  track.textContent = text + "   •   " + text;
  const sec = Math.max(20, Math.min(60, Math.floor(text.length / 6)));
  track.style.animationDuration = `${sec}s`;
}

function pickQuote(){
  const mode = cfg.quoteMode || "mix";
  let pool = [];
  if(mode==="hadith") pool = hadithList.map(x=>({text:x.text, source:x.source}));
  else if(mode==="quran") pool = quranList.map(x=>({text:x.text, source:x.source}));
  else pool = [
    ...hadithList.map(x=>({text:x.text, source:x.source})),
    ...quranList.map(x=>({text:x.text, source:x.source}))
  ];
  if(!pool.length) return {text:"—", source:"—"};
  const idx = Math.floor(Math.random()*pool.length);
  return pool[idx];
}

function showQuote(){
  const q = pickQuote();
  el("quoteText").textContent = q.text;
  el("quoteSource").textContent = q.source;
}

function setMedia(item){
  const frame = el("mediaFrame");
  frame.innerHTML = "";
  if(!item) return;

  const isVideo = item.toLowerCase().match(/\.(mp4|webm|ogg)$/);
  if(isVideo){
    const v = document.createElement("video");
    v.src = item;
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    frame.appendChild(v);
  }else{
    const img = document.createElement("img");
    img.src = item;
    frame.appendChild(img);
  }
}

function startSlideshow(){
  const list = cfg.media || [];
  if(!list.length) return;

  setMedia(list[0]);
  mediaIndex = 0;

  setInterval(()=>{
    mediaIndex = (mediaIndex + 1) % list.length;
    setMedia(list[mediaIndex]);
  }, Math.max(3, cfg.slideSeconds || 12) * 1000);
}

function tick(){
  const now = new Date();
  const clockEl = el("clock");
  const dateEl = el("todayDate");
  const heroNextEl = el("heroNext");
  const heroBox = el("heroBox");
  const adhkarBox = el("adhkarBox");
  if(clockEl) clockEl.textContent = formatClock12h(now);
  if(dateEl) dateEl.textContent = formatDateHuman(now, cfg.lang);

  const row = findTodayRow();
  if(!row){
    if(heroNextEl) heroNextEl.textContent = "—";
    if(heroBox) heroBox.classList.remove("hidden");
    if(adhkarBox) adhkarBox.classList.remove("visible");
    return;
  }

  const state = getHeroState(row, now);
  if (state.mode === "adhkar") {
    if(heroBox) heroBox.classList.add("hidden");
    if(adhkarBox) adhkarBox.classList.add("visible");
    if(heroNextEl) heroNextEl.textContent = "—";
  } else {
    if(heroBox) heroBox.classList.remove("hidden");
    if(adhkarBox) adhkarBox.classList.remove("visible");
    if (state.mode === "next") {
      const diff = state.nextAt - now;
      const total = Math.max(0, Math.floor(diff/1000));
      const h = Math.floor(total/3600);
      const m = Math.floor((total%3600)/60);
      if(heroNextEl) heroNextEl.textContent = `${state.nextPrayer.name} بعد ${pad2(h)}:${pad2(m)}`;
    } else {
      const diff = state.iqamahAt - now;
      const total = Math.max(0, Math.floor(diff/1000));
      const m = Math.floor(total/60);
      const s = total % 60;
      if(heroNextEl) heroNextEl.textContent = `صلاة ${state.prayer.name} يبدأ بعد ${pad2(m)}:${pad2(s)}`;
    }
  }

  const next = computeNextPrayer(row);
  renderTimes(row, next.key);
}

function openAdmin(){
  const d = el("adminDialog");
  el("adminMosqueName").value = cfg.mosqueName || "";
  el("adminLang").value = cfg.lang || "ar";
  el("adminSlideSec").value = cfg.slideSeconds || 12;
  el("adminTicker").value = (cfg.tickerMessages || []).join("\n");
  d.showModal();
}

function wireAdmin(){
  document.addEventListener("keydown", (e)=>{
    if(e.shiftKey && (e.key==="A" || e.key==="a")){
      openAdmin();
    }
  });

  el("saveBtn").addEventListener("click", ()=>{
    cfg.mosqueName = el("adminMosqueName").value.trim() || cfg.mosqueName;
    cfg.lang = el("adminLang").value;
    cfg.slideSeconds = Number(el("adminSlideSec").value) || 12;
    cfg.tickerMessages = el("adminTicker").value.split("\n").map(s=>s.trim()).filter(Boolean);
    setStoredConfig(cfg);
    applyLang();
  });

  el("importTimetable").addEventListener("change", async (e)=>{
    const f = e.target.files?.[0];
    if(!f) return;
    const txt = await f.text();
    setStoredTimetableCSV(txt);
    const rawRows = parseCSV(txt);
    if (isJerusalemFormat(rawRows)) {
      timetableFormat = "jerusalem";
      timetableRows = normalizeJerusalemRows(rawRows);
    } else {
      timetableFormat = "iso";
      timetableRows = rawRows;
    }
    tick();
    alert("تم استيراد جدول المواقيت وحفظه محليًا.");
  });

  el("importConfig").addEventListener("change", async (e)=>{
    const f = e.target.files?.[0];
    if(!f) return;
    const txt = await f.text();
    try{
      const obj = JSON.parse(txt);
      cfg = obj;
      setStoredConfig(cfg);
      el("mosqueName").textContent = cfg.mosqueName || "مسجد";
      applyLang();
      renderTicker();
      showQuote();
      alert("تم استيراد الإعدادات وحفظها محليًا.");
    }catch{
      alert("ملف config.json غير صالح");
    }
  });

  el("exportBtn").addEventListener("click", ()=>{
    const bundle = {
      exportedAt: new Date().toISOString(),
      config: cfg,
      timetableCSV: getStoredTimetableCSV() || ""
    };
    const blob = new Blob([JSON.stringify(bundle,null,2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mosque-screens-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

async function bootstrap(){
  if("serviceWorker" in navigator){
    try{ await navigator.serviceWorker.register("sw.js"); }catch{}
  }

  cfg = getStoredConfig();
  if(!cfg){
    cfg = await loadJSON(DEFAULTS_URL);
    setStoredConfig(cfg);
  }

  // Always use the bundled Jerusalem timetable (data/timetable.csv) as the single source for every day/month
  const csv = await loadText(DEFAULT_TIMETABLE_URL);
  const rawRows = parseCSV(csv);
  if (isJerusalemFormat(rawRows)) {
    timetableFormat = "jerusalem";
    timetableRows = normalizeJerusalemRows(rawRows);
  } else {
    timetableRows = rawRows;
  }

  try{ hadithList = await loadJSON(HADITH_URL); }catch{ hadithList=[]; }
  try{ quranList = await loadJSON(QURAN_URL); }catch{ quranList=[]; }

  applyLang();
  wireAdmin();

  tick();
  setInterval(tick, 1000);
  setInterval(showQuote, 60 * 60 * 1000);
}

bootstrap();
