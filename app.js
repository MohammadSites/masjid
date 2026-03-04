const DEFAULTS_URL = "data/config.json";
const DEFAULT_TIMETABLE_URL = "data/timetable.csv";
const HADITH_URL = "data/hadith.json";
const QURAN_URL = "data/quran.json";

const LS_CONFIG = "msq_cfg_v1";
const LS_TIMETABLE = "msq_timetable_csv_v1";

let cfg = null;
let timetableRows = [];
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
function formatClock(d=new Date()){
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
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
  const t = i18n(cfg.lang);
  document.documentElement.lang = cfg.lang;
  document.documentElement.dir = (cfg.lang==="ar" ? "rtl" : "ltr");
  el("nextLabel").textContent = t.nextPrayer;
  el("timesTitle").textContent = t.prayerTimes;
  el("islamicTitle").textContent = t.reminder;
}

function findTodayRow(){
  const id = todayISO();
  return timetableRows.find(r => r.date === id) || null;
}

function computeNextPrayer(todayRow){
  const now = new Date();
  const list = [
    {key:"fajr", name: cfg.lang==="ar"?"الفجر":(cfg.lang==="he"?"פג׳ר":"Fajr"), time: todayRow.fajr},
    {key:"dhuhr", name: cfg.lang==="ar"?"الظهر":(cfg.lang==="he"?"ד׳והר":"Dhuhr"), time: todayRow.dhuhr},
    {key:"asr", name: cfg.lang==="ar"?"العصر":(cfg.lang==="he"?"עסר":"Asr"), time: todayRow.asr},
    {key:"maghrib", name: cfg.lang==="ar"?"المغرب":(cfg.lang==="he"?"מגריב":"Maghrib"), time: todayRow.maghrib},
    {key:"isha", name: cfg.lang==="ar"?"العشاء":(cfg.lang==="he"?"עִשָא":"Isha"), time: todayRow.isha},
  ];

  for(const p of list){
    const dt = hhmmToDate(p.time, now);
    if(dt > now) return { ...p, dt };
  }

  // If after Isha, next is tomorrow Fajr (if exists)
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate()+1);
  const tomorrowId = todayISO(tomorrow);
  const tomRow = timetableRows.find(r => r.date === tomorrowId);
  if(tomRow){
    const dt = hhmmToDate(tomRow.fajr, tomorrow);
    return { key:"fajr", name: list[0].name, time: tomRow.fajr, dt };
  }
  // fallback: today fajr
  return { ...list[0], dt: hhmmToDate(list[0].time, now) };
}

function renderTimes(todayRow, nextKey){
  const items = [
    {k:"fajr", n: cfg.lang==="ar"?"الفجر":(cfg.lang==="he"?"פג׳ר":"Fajr"), v: todayRow.fajr},
    {k:"sunrise", n: cfg.lang==="ar"?"شروق الشمس":(cfg.lang==="he"?"זריחה":"Sunrise"), v: todayRow.sunrise},
    {k:"dhuhr", n: cfg.lang==="ar"?"الظهر":(cfg.lang==="he"?"ד׳והר":"Dhuhr"), v: todayRow.dhuhr},
    {k:"asr", n: cfg.lang==="ar"?"العصر":(cfg.lang==="he"?"עסר":"Asr"), v: todayRow.asr},
    {k:"maghrib", n: cfg.lang==="ar"?"المغرب":(cfg.lang==="he"?"מגריב":"Maghrib"), v: todayRow.maghrib},
    {k:"isha", n: cfg.lang==="ar"?"العشاء":(cfg.lang==="he"?"עִשָא":"Isha"), v: todayRow.isha},
  ];
  const grid = el("timesGrid");
  grid.innerHTML = "";
  items.forEach(it=>{
    const div = document.createElement("div");
    div.className = "time-item" + (it.k===nextKey ? " next":"");
    div.innerHTML = `<div class="name">${it.n}</div><div class="val">${it.v || "—"}</div>`;
    grid.appendChild(div);
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
  el("clock").textContent = formatClock(now);
  el("todayDate").textContent = formatDateHuman(now, cfg.lang);

  const row = findTodayRow();
  if(!row){
    el("nextPrayerName").textContent = "—";
    el("nextPrayerTime").textContent = "—";
    el("countdown").textContent = "--:--:--";
    return;
  }

  const next = computeNextPrayer(row);
  el("nextPrayerName").textContent = next.name;
  el("nextPrayerTime").textContent = next.time;

  const diff = next.dt - now;
  const total = Math.max(0, Math.floor(diff/1000));
  const h = Math.floor(total/3600);
  const m = Math.floor((total%3600)/60);
  const s = total%60;
  el("countdown").textContent = `${pad2(h)}:${pad2(m)}:${pad2(s)}`;

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

    el("mosqueName").textContent = cfg.mosqueName || "مسجد";
    applyLang();
    renderTicker();
    showQuote();
  });

  el("importTimetable").addEventListener("change", async (e)=>{
    const f = e.target.files?.[0];
    if(!f) return;
    const txt = await f.text();
    setStoredTimetableCSV(txt);
    timetableRows = parseCSV(txt);
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

  const storedCSV = getStoredTimetableCSV();
  if(storedCSV){
    timetableRows = parseCSV(storedCSV);
  }else{
    const csv = await loadText(DEFAULT_TIMETABLE_URL);
    timetableRows = parseCSV(csv);
    setStoredTimetableCSV(csv);
  }

  try{ hadithList = await loadJSON(HADITH_URL); }catch{ hadithList=[]; }
  try{ quranList = await loadJSON(QURAN_URL); }catch{ quranList=[]; }

  el("mosqueName").textContent = cfg.mosqueName || "مسجد";
  applyLang();
  renderTicker();
  showQuote();
  startSlideshow();
  wireAdmin();

  tick();
  setInterval(tick, 1000);
  setInterval(showQuote, 60 * 60 * 1000);
}

bootstrap();
