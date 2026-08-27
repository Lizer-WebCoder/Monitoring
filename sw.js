/* DR CARE — offline app-shell cache.
   This is what actually lets the app OPEN with zero signal. Without a
   file like this registered, the browser has no promise that it can
   serve the page without asking the network first — so on a fully
   offline device it can show a blank/stuck screen even though your
   patient data itself is safely sitting in localStorage.
   HOW TO USE:
   1. Save this file as "sw.js" in the exact same folder as your
      HTML file, supabase.js, and manifest.json.
   2. If your HTML file is not named "index.html", add its real
      filename to APP_SHELL below (e.g. "dr-care-tracker.html").
   3. The HTML page itself is always fetched fresh from the network
      first (falling back to the cached copy only when offline), so
      editing index.html and re-uploading it is enough — you do NOT
      need to bump CACHE_NAME just for HTML changes anymore. Only
      bump it (e.g. "dr-care-v4") if you change supabase.js or
      manifest.json, since those are still cache-first.
*/
const CACHE_NAME = 'dr-care-v3';
const APP_SHELL = [
  './',
  './index.html',
  './supabase.js',
  './manifest.json'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(
        APP_SHELL.map(url => cache.add(url).catch(() => {
          /* Ignore individual 404s (e.g. if index.html is named
             differently) so one missing file doesn't block the rest
             from being cached. */
        }))
      ))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});
/* Network-first for the HTML page itself, so any edit you upload
   shows up the next time the page loads — no manual cache-clearing
   needed. Falls back to the cached copy only if there's no
   connection at all. Everything else in the app shell (supabase.js,
   manifest.json) stays cache-first for instant offline loading. */
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;

  /* Only step in for plain http/https requests to our own origin.
     Browser extensions (ad blockers, dev-tool overlays, etc.) can
     inject their own requests — e.g. "chrome-extension://…" URLs —
     that happen to fire a fetch event while this page is open. The
     Fetch API can't fetch() those schemes at all, so trying would
     always reject and crash with "Failed to convert value to
     'Response'". Leaving them alone lets the browser handle them
     normally instead. */
  let url;
  try{ url = new URL(event.request.url); }catch(e){ return; }
  if(url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if(url.origin !== self.location.origin) return;

  const isHtml = event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');

  if(isHtml){
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if(response && response.ok){
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request)
        .then(response => {
          if(response && response.ok){
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached || Response.error());
    })
  );
});
