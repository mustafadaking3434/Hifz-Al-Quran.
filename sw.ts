self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('quran-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        // Add other essential files
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});