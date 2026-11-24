/* 離線快取：連上網時永遠拿最新版，沒訊號時用上次存下的內容 */
const V = 'isg-v4';
const FILES = ["./", "index.html", "manifest.webmanifest", "assets/apple-touch-icon.png", "assets/archery.jpg", "assets/beach.jpg", "assets/counter.jpg", "assets/cover.jpg", "assets/icon-192.png", "assets/icon-512.png", "assets/info-quick.jpg", "assets/info-security.jpg", "assets/info-tax.jpg", "assets/info-vjw.jpg", "assets/kids.jpg", "assets/kidspool.jpg", "assets/pool.jpg", "assets/poster.jpg", "assets/resort-map.jpg", "assets/restaurant.jpg", "assets/room-deluxe.jpg", "assets/room-standard.jpg", "assets/salon-baoge.jpg", "assets/salon1.jpg", "assets/salon2.jpg", "assets/salon3.jpg", "assets/tennis.jpg", "assets/terrace.jpg", "assets/trapeze.jpg", "assets/water.jpg"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; })
      .catch(() => caches.match(r, {ignoreSearch: true}).then(m => m || caches.match('index.html')))
  );
});
