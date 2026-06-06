// @ts-nocheck
import { build, files, version } from '$service-worker';

const CACHE_NAME = `rio-cache-${version}`;

const ASSETS = [
  ...build,
  ...files,
  '/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      for (const key of keys) {
        if (key !== CACHE_NAME) {
          await caches.delete(key);
        }
      }
      self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.headers.has('range')) return;

  const url = new URL(event.request.url);

  const isHttp = url.protocol.startsWith('http');
  const isLocal = url.host === self.location.host;
  const isStaticAsset = ASSETS.includes(url.pathname);

  if (isHttp && isLocal) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        if (isStaticAsset) {
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) return cachedResponse;
        }

        try {
          const fetchResponse = await fetch(event.request);
          if (fetchResponse.status === 200) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        } catch (error) {
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) return cachedResponse;

          if (event.request.headers.get('accept')?.includes('text/html')) {
            return cache.match('/');
          }
          throw error;
        }
      })
    );
  }
});
