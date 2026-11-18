// 홈 화면 앱용: 항상 인터넷에서 최신 브리핑을 받고, 인터넷이 안 될 때만 마지막으로 본 브리핑을 보여 줍니다.
const CACHE = "briefing-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const fresh = req.mode === "navigate" ? fetch(req, { cache: "no-cache" }) : fetch(req);
  e.respondWith(
    fresh.then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match("./")))
  );
});
