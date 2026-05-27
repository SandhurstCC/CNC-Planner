const CACHE = 'cnc-planner-v3';
const ASSETS = [
  '/CNC-Planner/CNC_Planner.html',
  '/CNC-Planner/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first strategy: always try network, fall back to cache
  e.respondWith(
    fetch(e.request).then(response => {
      if (!response || response.status !== 200 || response.type !== 'basic') return response;
      const clone = response.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, clone));
      return response;
    }).catch(() => caches.match(e.request))
  );
});
