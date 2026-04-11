const CACHE_NAME = 'medcore-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Pass-through for Next.js internal assets and development hot-reloads
  if (event.request.url.includes('/_next/') || event.request.url.includes('webpack-hmr')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // If fetch fails (offline or server down), don't throw, just let it fail gracefully
          return null;
        });
      })
  );
});

self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'MedCore Notificação';
  const options = {
    body: data.body || 'Você tem uma nova atualização estratégica.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
