const DEFAULTS_URL = "data/config.json";
const DEFAULT_TIMETABLE_URL = "data/timetable.csv";
const HADITH_URL = "data/hadith.json";
const QURAN_URL = "data/quran.json";
const HIJRI_URL = "data/hijri.json";

const LS_CONFIG = "msq_cfg_v1";
const LS_TIMETABLE = "msq_timetable_csv_v1";

// Fallback timetable data (March) for TV browsers that can't load files
const FALLBACK_TIMETABLE = [
  {MonthNum:"3",Day:"1",fajr:"04:44",sunrise:"06:03",dhuhr:"11:51",asr:"15:08",maghrib:"17:43",isha:"18:58"},
  {MonthNum:"3",Day:"2",fajr:"04:43",sunrise:"06:02",dhuhr:"11:51",asr:"15:08",maghrib:"17:44",isha:"18:58"},
  {MonthNum:"3",Day:"3",fajr:"04:42",sunrise:"06:01",dhuhr:"11:51",asr:"15:09",maghrib:"17:44",isha:"18:59"},
  {MonthNum:"3",Day:"4",fajr:"04:41",sunrise:"06:00",dhuhr:"11:50",asr:"15:09",maghrib:"17:45",isha:"19:00"},
  {MonthNum:"3",Day:"5",fajr:"04:40",sunrise:"05:58",dhuhr:"11:50",asr:"15:10",maghrib:"17:46",isha:"19:01"},
  {MonthNum:"3",Day:"6",fajr:"04:38",sunrise:"05:57",dhuhr:"11:50",asr:"15:10",maghrib:"17:47",isha:"19:01"},
  {MonthNum:"3",Day:"7",fajr:"04:37",sunrise:"05:56",dhuhr:"11:50",asr:"15:10",maghrib:"17:47",isha:"19:02"},
  {MonthNum:"3",Day:"8",fajr:"04:36",sunrise:"05:55",dhuhr:"11:49",asr:"15:11",maghrib:"17:48",isha:"19:03"},
  {MonthNum:"3",Day:"9",fajr:"04:35",sunrise:"05:54",dhuhr:"11:49",asr:"15:11",maghrib:"17:49",isha:"19:04"},
  {MonthNum:"3",Day:"10",fajr:"04:34",sunrise:"05:52",dhuhr:"11:49",asr:"15:11",maghrib:"17:50",isha:"19:04"},
  {MonthNum:"3",Day:"11",fajr:"04:32",sunrise:"05:51",dhuhr:"11:49",asr:"15:12",maghrib:"17:50",isha:"19:05"},
  {MonthNum:"3",Day:"12",fajr:"04:31",sunrise:"05:50",dhuhr:"11:48",asr:"15:12",maghrib:"17:51",isha:"19:06"},
  {MonthNum:"3",Day:"13",fajr:"04:30",sunrise:"05:49",dhuhr:"11:48",asr:"15:12",maghrib:"17:52",isha:"19:07"},
  {MonthNum:"3",Day:"14",fajr:"04:28",sunrise:"05:47",dhuhr:"11:48",asr:"15:12",maghrib:"17:53",isha:"19:08"},
  {MonthNum:"3",Day:"15",fajr:"04:27",sunrise:"05:46",dhuhr:"11:48",asr:"15:13",maghrib:"17:53",isha:"19:08"},
  {MonthNum:"3",Day:"16",fajr:"04:26",sunrise:"05:45",dhuhr:"11:47",asr:"15:13",maghrib:"17:54",isha:"19:09"},
  {MonthNum:"3",Day:"17",fajr:"04:24",sunrise:"05:43",dhuhr:"11:47",asr:"15:13",maghrib:"17:55",isha:"19:10"},
  {MonthNum:"3",Day:"18",fajr:"04:23",sunrise:"05:42",dhuhr:"11:47",asr:"15:13",maghrib:"17:55",isha:"19:11"},
  {MonthNum:"3",Day:"19",fajr:"04:22",sunrise:"05:41",dhuhr:"11:46",asr:"15:14",maghrib:"17:56",isha:"19:11"},
  {MonthNum:"3",Day:"20",fajr:"04:20",sunrise:"05:40",dhuhr:"11:46",asr:"15:14",maghrib:"17:57",isha:"19:12"},
  {MonthNum:"3",Day:"21",fajr:"04:19",sunrise:"05:38",dhuhr:"11:46",asr:"15:14",maghrib:"17:58",isha:"19:13"},
  {MonthNum:"3",Day:"22",fajr:"04:17",sunrise:"05:37",dhuhr:"11:46",asr:"15:14",maghrib:"17:58",isha:"19:14"},
  {MonthNum:"3",Day:"23",fajr:"04:16",sunrise:"05:36",dhuhr:"11:45",asr:"15:14",maghrib:"17:59",isha:"19:14"},
  {MonthNum:"3",Day:"24",fajr:"04:15",sunrise:"05:34",dhuhr:"11:45",asr:"15:14",maghrib:"18:00",isha:"19:15"},
  {MonthNum:"3",Day:"25",fajr:"04:13",sunrise:"05:33",dhuhr:"11:45",asr:"15:15",maghrib:"18:00",isha:"19:16"},
  {MonthNum:"3",Day:"26",fajr:"04:12",sunrise:"05:32",dhuhr:"11:44",asr:"15:15",maghrib:"18:01",isha:"19:17"},
  {MonthNum:"3",Day:"27",fajr:"04:10",sunrise:"05:30",dhuhr:"11:44",asr:"15:15",maghrib:"18:02",isha:"19:18"},
  {MonthNum:"3",Day:"28",fajr:"04:09",sunrise:"05:29",dhuhr:"11:44",asr:"15:15",maghrib:"18:02",isha:"19:19"},
  {MonthNum:"3",Day:"29",fajr:"04:08",sunrise:"05:28",dhuhr:"11:43",asr:"15:15",maghrib:"18:03",isha:"19:19"},
  {MonthNum:"3",Day:"30",fajr:"04:06",sunrise:"05:27",dhuhr:"11:43",asr:"15:15",maghrib:"18:04",isha:"19:20"},
  {MonthNum:"3",Day:"31",fajr:"04:05",sunrise:"05:25",dhuhr:"11:43",asr:"15:15",maghrib:"18:05",isha:"19:21"}
];

const FALLBACK_HADITH = [
  {text:"إنما الأعمالُ بالنيات.", source:"متفق عليه"},
  {text:"تبسُّمك في وجه أخيك صدقة.", source:"الترمذي"},
  {text:"الراحمون يرحمهم الرحمن.", source:"الترمذي"}
];

/** Fallback when data/hijri.json cannot be loaded (e.g. file:// in flash package) */
const FALLBACK_HIJRI = {"2025-06-26":"1 محرم 1447","2025-06-27":"2 محرم 1447","2025-06-28":"3 محرم 1447","2025-06-29":"4 محرم 1447","2025-06-30":"5 محرم 1447","2025-07-01":"6 محرم 1447","2025-07-02":"7 محرم 1447","2025-07-03":"8 محرم 1447","2025-07-04":"9 محرم 1447","2025-07-05":"10 محرم 1447","2025-07-06":"11 محرم 1447","2025-07-07":"12 محرم 1447","2025-07-08":"13 محرم 1447","2025-07-09":"14 محرم 1447","2025-07-10":"15 محرم 1447","2025-07-11":"16 محرم 1447","2025-07-12":"17 محرم 1447","2025-07-13":"18 محرم 1447","2025-07-14":"19 محرم 1447","2025-07-15":"20 محرم 1447","2025-07-16":"21 محرم 1447","2025-07-17":"22 محرم 1447","2025-07-18":"23 محرم 1447","2025-07-19":"24 محرم 1447","2025-07-20":"25 محرم 1447","2025-07-21":"26 محرم 1447","2025-07-22":"27 محرم 1447","2025-07-23":"28 محرم 1447","2025-07-24":"29 محرم 1447","2025-07-25":"30 محرم 1447","2025-07-26":"1 صفر 1447","2025-07-27":"2 صفر 1447","2025-07-28":"3 صفر 1447","2025-07-29":"4 صفر 1447","2025-07-30":"5 صفر 1447","2025-07-31":"6 صفر 1447","2025-08-01":"7 صفر 1447","2025-08-02":"8 صفر 1447","2025-08-03":"9 صفر 1447","2025-08-04":"10 صفر 1447","2025-08-05":"11 صفر 1447","2025-08-06":"12 صفر 1447","2025-08-07":"13 صفر 1447","2025-08-08":"14 صفر 1447","2025-08-09":"15 صفر 1447","2025-08-10":"16 صفر 1447","2025-08-11":"17 صفر 1447","2025-08-12":"18 صفر 1447","2025-08-13":"19 صفر 1447","2025-08-14":"20 صفر 1447","2025-08-15":"21 صفر 1447","2025-08-16":"22 صفر 1447","2025-08-17":"23 صفر 1447","2025-08-18":"24 صفر 1447","2025-08-19":"25 صفر 1447","2025-08-20":"26 صفر 1447","2025-08-21":"27 صفر 1447","2025-08-22":"28 صفر 1447","2025-08-23":"29 صفر 1447","2025-08-24":"1 ربيع الأول 1447","2025-08-25":"2 ربيع الأول 1447","2025-08-26":"3 ربيع الأول 1447","2025-08-27":"4 ربيع الأول 1447","2025-08-28":"5 ربيع الأول 1447","2025-08-29":"6 ربيع الأول 1447","2025-08-30":"7 ربيع الأول 1447","2025-08-31":"8 ربيع الأول 1447","2025-09-01":"9 ربيع الأول 1447","2025-09-02":"10 ربيع الأول 1447","2025-09-03":"11 ربيع الأول 1447","2025-09-04":"12 ربيع الأول 1447","2025-09-05":"13 ربيع الأول 1447","2025-09-06":"14 ربيع الأول 1447","2025-09-07":"15 ربيع الأول 1447","2025-09-08":"16 ربيع الأول 1447","2025-09-09":"17 ربيع الأول 1447","2025-09-10":"18 ربيع الأول 1447","2025-09-11":"19 ربيع الأول 1447","2025-09-12":"20 ربيع الأول 1447","2025-09-13":"21 ربيع الأول 1447","2025-09-14":"22 ربيع الأول 1447","2025-09-15":"23 ربيع الأول 1447","2025-09-16":"24 ربيع الأول 1447","2025-09-17":"25 ربيع الأول 1447","2025-09-18":"26 ربيع الأول 1447","2025-09-19":"27 ربيع الأول 1447","2025-09-20":"28 ربيع الأول 1447","2025-09-21":"29 ربيع الأول 1447","2025-09-22":"30 ربيع الأول 1447","2025-09-23":"1 ربيع الآخر 1447","2025-09-24":"2 ربيع الآخر 1447","2025-09-25":"3 ربيع الآخر 1447","2025-09-26":"4 ربيع الآخر 1447","2025-09-27":"5 ربيع الآخر 1447","2025-09-28":"6 ربيع الآخر 1447","2025-09-29":"7 ربيع الآخر 1447","2025-09-30":"8 ربيع الآخر 1447","2025-10-01":"9 ربيع الآخر 1447","2025-10-02":"10 ربيع الآخر 1447","2025-10-03":"11 ربيع الآخر 1447","2025-10-04":"12 ربيع الآخر 1447","2025-10-05":"13 ربيع الآخر 1447","2025-10-06":"14 ربيع الآخر 1447","2025-10-07":"15 ربيع الآخر 1447","2025-10-08":"16 ربيع الآخر 1447","2025-10-09":"17 ربيع الآخر 1447","2025-10-10":"18 ربيع الآخر 1447","2025-10-11":"19 ربيع الآخر 1447","2025-10-12":"20 ربيع الآخر 1447","2025-10-13":"21 ربيع الآخر 1447","2025-10-14":"22 ربيع الآخر 1447","2025-10-15":"23 ربيع الآخر 1447","2025-10-16":"24 ربيع الآخر 1447","2025-10-17":"25 ربيع الآخر 1447","2025-10-18":"26 ربيع الآخر 1447","2025-10-19":"27 ربيع الآخر 1447","2025-10-20":"28 ربيع الآخر 1447","2025-10-21":"29 ربيع الآخر 1447","2025-10-22":"1 جمادى الأولى 1447","2025-10-23":"2 جمادى الأولى 1447","2025-10-24":"3 جمادى الأولى 1447","2025-10-25":"4 جمادى الأولى 1447","2025-10-26":"5 جمادى الأولى 1447","2025-10-27":"6 جمادى الأولى 1447","2025-10-28":"7 جمادى الأولى 1447","2025-10-29":"8 جمادى الأولى 1447","2025-10-30":"9 جمادى الأولى 1447","2025-10-31":"10 جمادى الأولى 1447","2025-11-01":"11 جمادى الأولى 1447","2025-11-02":"12 جمادى الأولى 1447","2025-11-03":"13 جمادى الأولى 1447","2025-11-04":"14 جمادى الأولى 1447","2025-11-05":"15 جمادى الأولى 1447","2025-11-06":"16 جمادى الأولى 1447","2025-11-07":"17 جمادى الأولى 1447","2025-11-08":"18 جمادى الأولى 1447","2025-11-09":"19 جمادى الأولى 1447","2025-11-10":"20 جمادى الأولى 1447","2025-11-11":"21 جمادى الأولى 1447","2025-11-12":"22 جمادى الأولى 1447","2025-11-13":"23 جمادى الأولى 1447","2025-11-14":"24 جمادى الأولى 1447","2025-11-15":"25 جمادى الأولى 1447","2025-11-16":"26 جمادى الأولى 1447","2025-11-17":"27 جمادى الأولى 1447","2025-11-18":"28 جمادى الأولى 1447","2025-11-19":"29 جمادى الأولى 1447","2025-11-20":"30 جمادى الأولى 1447","2025-11-21":"1 جمادى الآخرة 1447","2025-11-22":"2 جمادى الآخرة 1447","2025-11-23":"3 جمادى الآخرة 1447","2025-11-24":"4 جمادى الآخرة 1447","2025-11-25":"5 جمادى الآخرة 1447","2025-11-26":"6 جمادى الآخرة 1447","2025-11-27":"7 جمادى الآخرة 1447","2025-11-28":"8 جمادى الآخرة 1447","2025-11-29":"9 جمادى الآخرة 1447","2025-11-30":"10 جمادى الآخرة 1447","2025-12-01":"11 جمادى الآخرة 1447","2025-12-02":"12 جمادى الآخرة 1447","2025-12-03":"13 جمادى الآخرة 1447","2025-12-04":"14 جمادى الآخرة 1447","2025-12-05":"15 جمادى الآخرة 1447","2025-12-06":"16 جمادى الآخرة 1447","2025-12-07":"17 جمادى الآخرة 1447","2025-12-08":"18 جمادى الآخرة 1447","2025-12-09":"19 جمادى الآخرة 1447","2025-12-10":"20 جمادى الآخرة 1447","2025-12-11":"21 جمادى الآخرة 1447","2025-12-12":"22 جمادى الآخرة 1447","2025-12-13":"23 جمادى الآخرة 1447","2025-12-14":"24 جمادى الآخرة 1447","2025-12-15":"25 جمادى الآخرة 1447","2025-12-16":"26 جمادى الآخرة 1447","2025-12-17":"27 جمادى الآخرة 1447","2025-12-18":"28 جمادى الآخرة 1447","2025-12-19":"29 جمادى الآخرة 1447","2025-12-20":"1 رجب 1447","2025-12-21":"2 رجب 1447","2025-12-22":"3 رجب 1447","2025-12-23":"4 رجب 1447","2025-12-24":"5 رجب 1447","2025-12-25":"6 رجب 1447","2025-12-26":"7 رجب 1447","2025-12-27":"8 رجب 1447","2025-12-28":"9 رجب 1447","2025-12-29":"10 رجب 1447","2025-12-30":"11 رجب 1447","2025-12-31":"12 رجب 1447","2026-01-01":"13 رجب 1447","2026-01-02":"14 رجب 1447","2026-01-03":"15 رجب 1447","2026-01-04":"16 رجب 1447","2026-01-05":"17 رجب 1447","2026-01-06":"18 رجب 1447","2026-01-07":"19 رجب 1447","2026-01-08":"20 رجب 1447","2026-01-09":"21 رجب 1447","2026-01-10":"22 رجب 1447","2026-01-11":"23 رجب 1447","2026-01-12":"24 رجب 1447","2026-01-13":"25 رجب 1447","2026-01-14":"26 رجب 1447","2026-01-15":"27 رجب 1447","2026-01-16":"28 رجب 1447","2026-01-17":"29 رجب 1447","2026-01-18":"30 رجب 1447","2026-01-19":"1 شعبان 1447","2026-01-20":"2 شعبان 1447","2026-01-21":"3 شعبان 1447","2026-01-22":"4 شعبان 1447","2026-01-23":"5 شعبان 1447","2026-01-24":"6 شعبان 1447","2026-01-25":"7 شعبان 1447","2026-01-26":"8 شعبان 1447","2026-01-27":"9 شعبان 1447","2026-01-28":"10 شعبان 1447","2026-01-29":"11 شعبان 1447","2026-01-30":"12 شعبان 1447","2026-01-31":"13 شعبان 1447","2026-02-01":"14 شعبان 1447","2026-02-02":"15 شعبان 1447","2026-02-03":"16 شعبان 1447","2026-02-04":"17 شعبان 1447","2026-02-05":"18 شعبان 1447","2026-02-06":"19 شعبان 1447","2026-02-07":"20 شعبان 1447","2026-02-08":"21 شعبان 1447","2026-02-09":"22 شعبان 1447","2026-02-10":"23 شعبان 1447","2026-02-11":"24 شعبان 1447","2026-02-12":"25 شعبان 1447","2026-02-13":"26 شعبان 1447","2026-02-14":"27 شعبان 1447","2026-02-15":"28 شعبان 1447","2026-02-16":"29 شعبان 1447","2026-02-17":"1 رمضان 1447","2026-02-18":"2 رمضان 1447","2026-02-19":"3 رمضان 1447","2026-02-20":"4 رمضان 1447","2026-02-21":"5 رمضان 1447","2026-02-22":"6 رمضان 1447","2026-02-23":"7 رمضان 1447","2026-02-24":"8 رمضان 1447","2026-02-25":"9 رمضان 1447","2026-02-26":"10 رمضان 1447","2026-02-27":"11 رمضان 1447","2026-02-28":"12 رمضان 1447","2026-03-01":"13 رمضان 1447","2026-03-02":"14 رمضان 1447","2026-03-03":"15 رمضان 1447","2026-03-04":"16 رمضان 1447","2026-03-05":"17 رمضان 1447","2026-03-06":"18 رمضان 1447","2026-03-07":"19 رمضان 1447","2026-03-08":"20 رمضان 1447","2026-03-09":"21 رمضان 1447","2026-03-10":"22 رمضان 1447","2026-03-11":"23 رمضان 1447","2026-03-12":"24 رمضان 1447","2026-03-13":"25 رمضان 1447","2026-03-14":"26 رمضان 1447","2026-03-15":"27 رمضان 1447","2026-03-16":"28 رمضان 1447","2026-03-17":"29 رمضان 1447","2026-03-18":"30 رمضان 1447","2026-03-19":"1 شوال 1447","2026-03-20":"2 شوال 1447","2026-03-21":"3 شوال 1447","2026-03-22":"4 شوال 1447","2026-03-23":"5 شوال 1447","2026-03-24":"6 شوال 1447","2026-03-25":"7 شوال 1447","2026-03-26":"8 شوال 1447","2026-03-27":"9 شوال 1447","2026-03-28":"10 شوال 1447","2026-03-29":"11 شوال 1447","2026-03-30":"12 شوال 1447","2026-03-31":"13 شوال 1447","2026-04-01":"14 شوال 1447","2026-04-02":"15 شوال 1447","2026-04-03":"16 شوال 1447","2026-04-04":"17 شوال 1447","2026-04-05":"18 شوال 1447","2026-04-06":"19 شوال 1447","2026-04-07":"20 شوال 1447","2026-04-08":"21 شوال 1447","2026-04-09":"22 شوال 1447","2026-04-10":"23 شوال 1447","2026-04-11":"24 شوال 1447","2026-04-12":"25 شوال 1447","2026-04-13":"26 شوال 1447","2026-04-14":"27 شوال 1447","2026-04-15":"28 شوال 1447","2026-04-16":"29 شوال 1447","2026-04-17":"1 ذو القعدة 1447","2026-04-18":"2 ذو القعدة 1447","2026-04-19":"3 ذو القعدة 1447","2026-04-20":"4 ذو القعدة 1447","2026-04-21":"5 ذو القعدة 1447","2026-04-22":"6 ذو القعدة 1447","2026-04-23":"7 ذو القعدة 1447","2026-04-24":"8 ذو القعدة 1447","2026-04-25":"9 ذو القعدة 1447","2026-04-26":"10 ذو القعدة 1447","2026-04-27":"11 ذو القعدة 1447","2026-04-28":"12 ذو القعدة 1447","2026-04-29":"13 ذو القعدة 1447","2026-04-30":"14 ذو القعدة 1447","2026-05-01":"15 ذو القعدة 1447","2026-05-02":"16 ذو القعدة 1447","2026-05-03":"17 ذو القعدة 1447","2026-05-04":"18 ذو القعدة 1447","2026-05-05":"19 ذو القعدة 1447","2026-05-06":"20 ذو القعدة 1447","2026-05-07":"21 ذو القعدة 1447","2026-05-08":"22 ذو القعدة 1447","2026-05-09":"23 ذو القعدة 1447","2026-05-10":"24 ذو القعدة 1447","2026-05-11":"25 ذو القعدة 1447","2026-05-12":"26 ذو القعدة 1447","2026-05-13":"27 ذو القعدة 1447","2026-05-14":"28 ذو القعدة 1447","2026-05-15":"29 ذو القعدة 1447","2026-05-16":"30 ذو القعدة 1447","2026-05-17":"1 ذو الحجة 1447","2026-05-18":"2 ذو الحجة 1447","2026-05-19":"3 ذو الحجة 1447","2026-05-20":"4 ذو الحجة 1447","2026-05-21":"5 ذو الحجة 1447","2026-05-22":"6 ذو الحجة 1447","2026-05-23":"7 ذو الحجة 1447","2026-05-24":"8 ذو الحجة 1447","2026-05-25":"9 ذو الحجة 1447","2026-05-26":"10 ذو الحجة 1447","2026-05-27":"11 ذو الحجة 1447","2026-05-28":"12 ذو الحجة 1447","2026-05-29":"13 ذو الحجة 1447","2026-05-30":"14 ذو الحجة 1447","2026-05-31":"15 ذو الحجة 1447","2026-06-01":"16 ذو الحجة 1447","2026-06-02":"17 ذو الحجة 1447","2026-06-03":"18 ذو الحجة 1447","2026-06-04":"19 ذو الحجة 1447","2026-06-05":"20 ذو الحجة 1447","2026-06-06":"21 ذو الحجة 1447","2026-06-07":"22 ذو الحجة 1447","2026-06-08":"23 ذو الحجة 1447","2026-06-09":"24 ذو الحجة 1447","2026-06-10":"25 ذو الحجة 1447","2026-06-11":"26 ذو الحجة 1447","2026-06-12":"27 ذو الحجة 1447","2026-06-13":"28 ذو الحجة 1447","2026-06-14":"29 ذو الحجة 1447","2026-06-15":"30 ذو الحجة 1447"};

let cfg = null;
let timetableRows = [];
let timetableFormat = "iso"; // "iso" = date column YYYY-MM-DD, "jerusalem" = MonthNum + Day
let hadithList = [];
let quranList = [];
let hijriCalendar = {};
let mediaIndex = 0;
let adhkarQuoteIndex = 0;
let lastAdhkarAdvanceTime = null;
let adhkarCyclesComplete = false;

const ADHKAR_SLIDE_SECONDS = 6;

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
      sunrise: r.sunrise,
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
/** Black "وقت الصلاة" screen duration (minutes) after iqamah, per prayer */
const ADHKAR_DURATION_MINUTES = { fajr: 11, dhuhr: 10, asr: 10, maghrib: 10, isha: 12 };
/** Hide Eid notice after this date (19 March 2026 20:00) */
const EID_NOTICE_HIDE_AT = new Date(2026, 2, 19, 20, 0, 0);
const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
function prayerName(key){
  const names = { fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء" };
  return cfg && cfg.lang === "ar" ? names[key] : key;
}

function getNextDayFajr(now) {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  let tomRow = null;
  if (timetableFormat === "jerusalem") {
    const m = tomorrow.getMonth() + 1, d = tomorrow.getDate();
    tomRow = timetableRows.find(r => Number(r.MonthNum) === m && Number(r.Day) === d);
  } else {
    tomRow = timetableRows.find(r => r.date === todayISO(tomorrow));
  }
  return tomRow ? hhmmToDate(tomRow.fajr, tomorrow) : null;
}

function getHeroState(todayRow, now){
  const list = PRAYER_KEYS.map(key => ({
    key,
    name: prayerName(key),
    adhanTime: hhmmToDate(todayRow[key], now),
    offsetMin: IQAMAH_OFFSET_MINUTES[key]
  }));
  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    const iqamahTime = new Date(p.adhanTime.getTime() + p.offsetMin * 60 * 1000);
    const waitMin = typeof ADHKAR_DURATION_MINUTES === "object" ? ADHKAR_DURATION_MINUTES[p.key] : ADHKAR_DURATION_MINUTES;
    const adhkarStartTime = new Date(iqamahTime.getTime() + waitMin * 60 * 1000);
    const nextAdhanTime = i < list.length - 1 ? list[i + 1].adhanTime : getNextDayFajr(now);
    if (now < p.adhanTime)
      return { mode: "next", nextPrayer: p, nextAt: p.adhanTime };
    if (now < iqamahTime)
      return { mode: "iqamah", prayer: p, iqamahAt: iqamahTime };
    if (now < adhkarStartTime)
      return { mode: "wait_adhkar", showAdhkarAt: adhkarStartTime };
    if (nextAdhanTime && now < nextAdhanTime)
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
    if (tr) tomRow = { fajr: tr.fajr, sunrise: tr.sunrise, dhuhr: tr.dhuhr, asr: tr.asr, maghrib: tr.maghrib, isha: tr.isha };
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
  const sunriseName = cfg.lang==="ar"?"الشروق":(cfg.lang==="he"?"זריחה":"Sunrise");
  const items = [
    {k:"fajr", n: cfg.lang==="ar"?"الفجر":(cfg.lang==="he"?"פג׳ר":"Fajr"), v: todayRow.fajr},
    {k:"dhuhr", n: cfg.lang==="ar"?"الظهر":(cfg.lang==="he"?"ד׳והר":"Dhuhr"), v: todayRow.dhuhr},
    {k:"asr", n: cfg.lang==="ar"?"العصر":(cfg.lang==="he"?"עסר":"Asr"), v: todayRow.asr},
    {k:"maghrib", n: cfg.lang==="ar"?"المغرب":(cfg.lang==="he"?"מגריב":"Maghrib"), v: todayRow.maghrib},
    {k:"isha", n: cfg.lang==="ar"?"العشاء":(cfg.lang==="he"?"עִשָא":"Isha"), v: todayRow.isha},
  ];
  const sunriseCard = document.getElementById("sunriseCard");
  if (sunriseCard && todayRow.sunrise) {
    const sunNameEl = sunriseCard.querySelector(".name");
    const sunTimeEl = document.getElementById("sunriseTime");
    const sunAmpmEl = document.getElementById("sunriseAmpm");
    const { time, ampm } = formatTime12h(todayRow.sunrise);
    if (sunNameEl) sunNameEl.textContent = sunriseName;
    if (sunTimeEl) sunTimeEl.textContent = time;
    if (sunAmpmEl) sunAmpmEl.textContent = ampm;
  }
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

function getAdhkarList(){
  const mode = cfg && cfg.quoteMode ? cfg.quoteMode : "mix";
  if (mode === "hadith") return hadithList.map(x => ({ text: x.text, source: x.source }));
  if (mode === "quran") return quranList.map(x => ({ text: x.text, source: x.source }));
  return [
    ...hadithList.map(x => ({ text: x.text, source: x.source })),
    ...quranList.map(x => ({ text: x.text, source: x.source }))
  ];
}

function pickQuote(){
  const pool = getAdhkarList();
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
  const sunriseCard = document.getElementById("sunriseCard");
  const hijriCard = document.getElementById("hijriCard");
  const hijriDateEl = document.getElementById("hijriDate");
  const heroEl = document.querySelector(".hero");
  const prayerTimeScreen = el("prayerTimeScreen");
  const eidNotice = el("eidNotice");
  if (eidNotice) {
    if (now < EID_NOTICE_HIDE_AT) eidNotice.classList.remove("hidden");
    else eidNotice.classList.add("hidden");
  }
  if(clockEl) clockEl.textContent = formatClock12h(now);
  if(dateEl) dateEl.textContent = formatDateHuman(now, cfg.lang);
  const todayKey = todayISO(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = todayISO(yesterday);
  if(hijriDateEl) hijriDateEl.textContent = hijriCalendar[yesterdayKey] || hijriCalendar[todayKey] || "—";

  const row = findTodayRow();
  if(!row){
    if(heroNextEl) { heroNextEl.textContent = "—"; heroNextEl.classList.remove("iqamah-countdown"); }
    if(heroBox) heroBox.classList.remove("hidden");
    if(adhkarBox) adhkarBox.classList.remove("visible");
    if(heroEl) heroEl.classList.remove("adhkar-visible");
    if(sunriseCard) sunriseCard.classList.remove("hidden");
    if(hijriCard) hijriCard.classList.remove("hidden");
    if(prayerTimeScreen) prayerTimeScreen.classList.add("hidden");
    return;
  }

  const state = getHeroState(row, now);

  if (state.mode !== "adhkar") {
    adhkarQuoteIndex = 0;
    lastAdhkarAdvanceTime = null;
    adhkarCyclesComplete = false;
  }

  if (state.mode === "adhkar") {
    if(prayerTimeScreen) prayerTimeScreen.classList.add("hidden");
    if (adhkarCyclesComplete) {
      if(heroBox) heroBox.classList.remove("hidden");
      if(adhkarBox) adhkarBox.classList.remove("visible");
      if(heroEl) heroEl.classList.remove("adhkar-visible");
      if(sunriseCard) sunriseCard.classList.remove("hidden");
      if(hijriCard) hijriCard.classList.remove("hidden");
      const next = computeNextPrayer(row);
      const diff = next.dt - now;
      const total = Math.max(0, Math.floor(diff/1000));
      const h = Math.floor(total/3600);
      const m = Math.floor((total%3600)/60);
      const s = total % 60;
      if(heroNextEl) { heroNextEl.textContent = `${next.name} بعد ${pad2(h)}:${pad2(m)}:${pad2(s)}`; heroNextEl.classList.remove("iqamah-countdown"); }
    } else {
      if(heroBox) heroBox.classList.add("hidden");
      if(adhkarBox) adhkarBox.classList.add("visible");
      if(heroEl) heroEl.classList.add("adhkar-visible");
      if(sunriseCard) sunriseCard.classList.add("hidden");
      if(hijriCard) hijriCard.classList.add("hidden");
      if(heroNextEl) { heroNextEl.textContent = "—"; heroNextEl.classList.remove("iqamah-countdown"); }
      const list = getAdhkarList();
      if (list.length === 0) {
        adhkarCyclesComplete = true;
      } else {
        if (lastAdhkarAdvanceTime === null) lastAdhkarAdvanceTime = now;
        const elapsed = (now - lastAdhkarAdvanceTime) / 1000;
        if (elapsed >= ADHKAR_SLIDE_SECONDS) {
          adhkarQuoteIndex++;
          lastAdhkarAdvanceTime = now;
          if (adhkarQuoteIndex >= list.length) {
            adhkarQuoteIndex = list.length - 1;
            adhkarCyclesComplete = true;
          }
        }
        const q = list[adhkarQuoteIndex];
        const quoteEl = el("adhkarQuoteText");
        const sourceEl = el("adhkarQuoteSource");
        if (quoteEl) quoteEl.textContent = q.text;
        if (sourceEl) sourceEl.textContent = q.source;
      }
    }
  } else if (state.mode === "wait_adhkar") {
    if(heroBox) heroBox.classList.add("hidden");
    if(adhkarBox) adhkarBox.classList.remove("visible");
    if(heroEl) heroEl.classList.remove("adhkar-visible");
    if(sunriseCard) sunriseCard.classList.remove("hidden");
    if(hijriCard) hijriCard.classList.remove("hidden");
    if(prayerTimeScreen) prayerTimeScreen.classList.remove("hidden");
    if(heroNextEl) { heroNextEl.textContent = "—"; heroNextEl.classList.remove("iqamah-countdown"); }
  } else {
    if(heroBox) heroBox.classList.remove("hidden");
    if(adhkarBox) adhkarBox.classList.remove("visible");
    if(heroEl) heroEl.classList.remove("adhkar-visible");
    if(sunriseCard) sunriseCard.classList.remove("hidden");
    if(hijriCard) hijriCard.classList.remove("hidden");
    if(prayerTimeScreen) prayerTimeScreen.classList.add("hidden");
    if (state.mode === "next") {
      const diff = state.nextAt - now;
      const total = Math.max(0, Math.floor(diff/1000));
      const h = Math.floor(total/3600);
      const m = Math.floor((total%3600)/60);
      const s = total % 60;
      if(heroNextEl) { heroNextEl.textContent = `${state.nextPrayer.name} بعد ${pad2(h)}:${pad2(m)}:${pad2(s)}`; heroNextEl.classList.remove("iqamah-countdown"); }
    } else {
      const diff = state.iqamahAt - now;
      const total = Math.max(0, Math.floor(diff/1000));
      const m = Math.floor(total/60);
      const s = total % 60;
      if(heroNextEl) {
        heroNextEl.textContent = `الوقت المتبقي لاقامة الصلاة : ${pad2(m)}:${pad2(s)}`;
        heroNextEl.classList.add("iqamah-countdown");
      }
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
  const bootRow = document.getElementById("adminStartOnBootRow");
  const bootCb = el("adminStartOnBoot");
  if (bootRow) bootRow.style.display = ""; /* always show: boot option for TV APK */
  if (window.StartOnBootPlugin) {
    window.StartOnBootPlugin.getEnabled().then(function(r){ if (bootCb) bootCb.checked = r.enabled === true; }).catch(function(){});
  }
  d.showModal();
}

function wireAdmin(){
  var hintBtn = el("adminHint");
  if (hintBtn) {
    function openAdminFromIcon(e) {
      if (e && e.type === "touchend") e.preventDefault();
      openAdmin();
    }
    hintBtn.addEventListener("click", openAdminFromIcon);
    hintBtn.addEventListener("touchend", openAdminFromIcon, { passive: false });
  }
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
    if (window.StartOnBootPlugin && el("adminStartOnBoot")) {
      window.StartOnBootPlugin.setEnabled({ enabled: el("adminStartOnBoot").checked }).catch(function(){});
    }
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
  try {
    if("serviceWorker" in navigator){
      try{ await navigator.serviceWorker.register("sw.js"); }catch(e){ console.log("SW error:", e); }
    }

    cfg = getStoredConfig();
    if(!cfg){
      try {
        cfg = await loadJSON(DEFAULTS_URL);
      } catch(e) {
        console.log("Config load error:", e);
        cfg = { mosqueName: "مسجد خليل عبد الرحمن", lang: "ar", slideSeconds: 12, tickerMessages: [] };
      }
      setStoredConfig(cfg);
    }

    // Always use the bundled Jerusalem timetable (data/timetable.csv) as the single source for every day/month
    try {
      const csv = await loadText(DEFAULT_TIMETABLE_URL);
      const rawRows = parseCSV(csv);
      if (isJerusalemFormat(rawRows)) {
        timetableFormat = "jerusalem";
        timetableRows = normalizeJerusalemRows(rawRows);
      } else {
        timetableRows = rawRows;
      }
    } catch(e) {
      console.log("Timetable load error, using fallback:", e);
      timetableFormat = "jerusalem";
      timetableRows = FALLBACK_TIMETABLE;
    }
    
    // Use fallback if no rows loaded
    if (!timetableRows || timetableRows.length === 0) {
      console.log("No timetable rows, using fallback");
      timetableFormat = "jerusalem";
      timetableRows = FALLBACK_TIMETABLE;
    }

    try{ hadithList = await loadJSON(HADITH_URL); }catch{ hadithList = FALLBACK_HADITH; }
    try{ quranList = await loadJSON(QURAN_URL); }catch{ quranList=[]; }
    try{ hijriCalendar = await loadJSON(HIJRI_URL); }catch{ hijriCalendar = {}; }
    if (!hijriCalendar || Object.keys(hijriCalendar).length === 0) hijriCalendar = FALLBACK_HIJRI;

    // Use fallback hadith if empty
    if (!hadithList || hadithList.length === 0) {
      hadithList = FALLBACK_HADITH;
    }

    applyLang();
    wireAdmin();

    tick();
    setInterval(tick, 1000);
    setInterval(showQuote, 60 * 60 * 1000);
  } catch(err) {
    console.error("Bootstrap error:", err);
    // Fallback: at least show something
    const mosqueEl = document.getElementById("mosqueName");
    if (mosqueEl) mosqueEl.textContent = "مسجد خليل عبد الرحمن";
    const clockEl = document.getElementById("clock");
    if (clockEl) {
      setInterval(() => {
        const now = new Date();
        const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
        const h12 = h === 0 ? 12 : (h > 12 ? h - 12 : h);
        const ampm = h >= 12 ? "PM" : "AM";
        clockEl.textContent = h12 + ":" + String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0") + " " + ampm;
      }, 1000);
    }
  }
}

bootstrap();
