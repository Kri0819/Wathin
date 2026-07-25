// Wathin｜未止 — Service Worker v2.3.5
const CACHE_NAME = 'wathin-v2.3.5';
const STATIC_ASSETS = [
  '/manifest.json',
  '/assets/water-mobile-loop.webp',
  '/assets/water-desktop-loop.webp',
  '/assets/paper-boat-v2.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith('wathin-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    );
    await self.clients.claim();

    // 舊版頁面可能仍由 v2.0.0 快取提供；新 SW 接管後立即重新載入一次。
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(windows.map((client) => client.navigate(client.url)));
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // 導覽與程式檔一律先取網路版本，避免更新後仍看到舊畫面。
  event.respondWith((async () => {
    try {
      const response = await fetch(request, { cache: 'no-store' });
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return new Response('Wathin is temporarily offline.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
      throw new Error('Offline and not cached');
    }
  })());
});
