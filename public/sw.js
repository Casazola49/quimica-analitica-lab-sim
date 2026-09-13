const CACHE_NAME = 'quimica-analitica-sim-v3';

// Recursos esenciales que se guardan en caché para uso offline
const STATIC_SHELL_ASSETS = [
  './manifest.json',
];

// Instalación: activa inmediatamente el nuevo service worker sin esperar a que se cierren las pestañas
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_SHELL_ASSETS);
    })
  );
});

// Activación: purga todas las versiones viejas de caché para evitar servir JS/HTML obsoleto
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purgando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de Fetch:
// 1. Navegación HTML (index.html): NETWORK-FIRST.
//    Siempre busca la versión más reciente en GitHub Pages si hay internet.
//    Si falla la red (laboratorio offline), entrega la versión guardada en caché.
//    Esto ELIMINA completamente el error de pantalla blanca tras un despliegue.
// 2. Recursos estáticos con hash (assets/*.js, *.css): STALE-WHILE-REVALIDATE / CACHE-FIRST.
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Solo interceptar peticiones GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Petición de documento HTML (index.html / navegación) -> NETWORK FIRST
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('[SW] Modo offline: sirviendo index.html desde caché');
          return caches.match('./index.html').then((cached) => cached || caches.match('./'));
        })
    );
    return;
  }

  // 2. Archivos estáticos (JS, CSS, SVG, imágenes) -> CACHE FIRST con actualización en segundo plano
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
