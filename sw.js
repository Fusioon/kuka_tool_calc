// Bump VERSION whenever you change any file so phones pick up the update.
const VERSION = 'tool-calc-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './vendor/tesseract.min.js', './vendor/worker.min.js', './vendor/lang/eng.traineddata.gz',
  './vendor/core/tesseract-core-lstm.wasm.js', './vendor/core/tesseract-core-simd-lstm.wasm.js', './vendor/core/tesseract-core-relaxedsimd-lstm.wasm.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Cache first, fall back to network; page navigations fall back to the cached app.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).catch(() =>
      e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
  );
});
