const CACHE = "mosque-screens-offline-v1";

const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./data/config.json",
  "./data/timetable.csv",
  "./data/hadith.json",
  "./data/quran.json"
];

self.addEventListener("install", (event)=>{
  event.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", (event)=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE?null:caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", (event)=>{
  event.respondWith(
    caches.match(event.request).then(cached=>{
      if(cached) return cached;
      return fetch(event.request).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(event.request, copy)).catch(()=>{});
        return res;
      }).catch(()=>cached);
    })
  );
});
