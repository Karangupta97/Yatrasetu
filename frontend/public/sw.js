/**
 * YatraSetu Service Worker
 * Strategies:
 *   Static assets  → cache-first
 *   HTML pages     → network-first + offline fallback
 *   Everything else → stale-while-revalidate
 */

const CACHE_VERSION = "v1.0.0";
const STATIC_CACHE  = `yatrasetu-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `yatrasetu-dynamic-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/passenger",
  "/my-bookings",
  "/contact",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

/* ── Install ── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[SW] pre-cache failed (non-fatal):", err))
  );
});

/* ── Activate ── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch ── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (!url.protocol.startsWith("http")) return;
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;
  if (url.pathname.startsWith("/api/")) return;

  // Static assets — cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.match(/\.(webp|png|jpg|jpeg|svg|gif|ico|woff|woff2|ttf)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigation — network-first with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Everything else — stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

/* ── Strategies ── */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(cacheName)).put(request, response.clone());
    return response;
  } catch {
    return new Response("Resource unavailable offline.", { status: 503 });
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(DYNAMIC_CACHE)).put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const offline = await caches.match("/offline");
    return offline || new Response(
      `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline — YatraSetu</title>
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#f0f2f5;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center;color:#181d2a}.icon{font-size:64px;margin-bottom:20px}h1{font-size:26px;font-weight:700;margin-bottom:10px}p{color:#6b7280;font-size:15px;line-height:1.6;max-width:360px}button{margin-top:28px;padding:12px 32px;background:#748efe;color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit}</style>
      </head><body><div class="icon">🚂</div><h1>You're offline</h1><p>Please check your internet connection and try again.</p><button onclick="window.location.reload()">Try again</button></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html;charset=utf-8" } }
    );
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((r) => { if (r.ok) cache.put(request, r.clone()); return r; })
    .catch(() => cached);
  return cached || fetchPromise;
}

/* ── Push notifications ── */
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || "YatraSetu", {
      body: data.body || "",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
