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
   3. Bump CACHE_NAME (e.g. "dr-care-v2") any time you replace these
      files with a new version, so returning devices pick up the
      update instead of serving a stale copy forever.
*/
const CACHE_NAME = 'dr-care-v1';
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

/* Cache-first for the app shell itself (so it always opens instantly
   and offline); network-first with a cache fallback for everything
   else (so Supabase API calls still go live when online, but don't
   crash the page if a stray request happens while offline). Supabase
   API/auth calls themselves are unaffected — this only decides what
   happens if a *file* request fails. */
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request)
        .then(response => {
          if(response && response.ok && event.request.url.startsWith(self.location.origin)){
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
