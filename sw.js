const CACHE_NAME = 'exchange-demo-v3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './config.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/logo.png',
  './icons/coins/btc.png',
  './icons/coins/eth.png',
  './icons/coins/link.png',
  './icons/coins/avax.png',
  './icons/coins/bnb.png',
  './icons/coins/op.png',
  './icons/coins/ltc.png',
  './icons/coins/bch.png',
  './icons/coins/dash.png',
  './icons/coins/xmr.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: always try to get the latest file (so config.json edits
// show up immediately); only fall back to the cached copy if offline.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
