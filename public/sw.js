importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName === 'pages' || cacheName === 'assets') {
            console.log('Clearing stale cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

if (workbox) {
  console.log('Workbox is loaded');

  // Precaching can be done here if we had a build plugin, but manually we will rely on runtime caching
  
  // Cache Web Workers (omit scripts and styles to prevent chunk caching issues in development/preview)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'assets',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Cache images
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Cache OpenStreetMap tiles
  workbox.routing.registerRoute(
    ({ url }) => url.origin.includes('tile.openstreetmap.org'),
    new workbox.strategies.CacheFirst({
      cacheName: 'map-tiles',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Cache APIs (like Open Meteo, Exchange Rate) with Stale-While-Revalidate
  // Note: We already implemented appCache via Dexie, but this adds standard HTTP SW caching for any fetch
  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === 'https://api.open-meteo.com' ||
      url.origin === 'https://api.exchangerate-api.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'api-responses',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60, // 1 Day
        }),
      ],
    })
  );

} else {
  console.log('Workbox failed to load');
}
