// =====================================================
// VELMORTH SERVICE WORKER — Offline PWA
// =====================================================

const CACHE_NAME   = 'velmorth-v2';
const DATA_CACHE   = 'velmorth-data-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/style.css',
  '/src/main.js',
];

const DATA_URLS = [
  '/data/config/units_index.json',
  '/data/config/categories_index.json',
  '/data/lessons/ja_u01_greetings.json',
  '/data/lessons/ja_u02_numbers.json',
  '/data/lessons/ja_u03_self_intro.json',
  '/data/lessons/ja_u04_objects.json',
  '/data/lessons/ja_u05_time.json',
  '/data/lessons/ja_u06_family.json',
  '/data/lessons/ja_u07_food.json',
  '/data/lessons/ja_u08_colors.json',
  '/data/lessons/ja_u09_locations.json',
  '/data/lessons/ja_u10_verbs.json',
];

// Install — cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS).catch(() => {})),
      caches.open(DATA_CACHE).then(cache => cache.addAll(DATA_URLS).catch(() => {})),
    ])
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== DATA_CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — cache-first for data, network-first for app
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Data files — cache first
  if (url.includes('/data/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then(cache =>
        cache.match(event.request).then(cached =>
          cached || fetch(event.request).then(res => {
            cache.put(event.request, res.clone());
            return res;
          }).catch(() => cached)
        )
      )
    );
    return;
  }

  // Network first for everything else
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(cached => cached || caches.match('/index.html'))
    )
  );
});
