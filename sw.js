// Basic service worker to cache the app shell (index + assets).
const CACHE = 'pocketclass-shell-v1';
const ASSETS = [
  './',
  './index.html',
  './library.html',
  './classroom.html',
  './quiz.html',
  './project.html',
  './assets/styles.css',
  './assets/app.js'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evt) => {
  // Navigation requests -> network first then fallback to cache
  if (evt.request.mode === 'navigate') {
    evt.respondWith(fetch(evt.request).catch(() => caches.match('./index.html')));
    return;
  }
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request).then(r => {
      // optionally cache GET same-origin assets
      if (evt.request.method === 'GET' && evt.request.url.startsWith(self.location.origin)) {
        caches.open(CACHE).then(c => c.put(evt.request, r.clone()));
      }
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});