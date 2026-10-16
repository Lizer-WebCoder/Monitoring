# DR CARE — Divine Rays Patient Care Tracker

Offline-first patient care tracker (roster, PhilHealth, claims, benefits, multi-user Supabase sync).

**Version:** `8.0.0` · **Service worker cache:** `dr-care-v8`  
**Live:** https://dr-care-monitoring.vercel.app

## Layout (current)

The app ships as a **monolith**. CSS and application logic live inside `index.html`.

```
index.html          → markup + embedded CSS + app logic (~single page)
supabase.js         → vendor (auth/db client)
xlsx.full.min.js    → vendor (Excel import/export)
sw.js               → PWA service worker (CACHE_NAME = dr-care-v8)
manifest.json       → PWA manifest
favicon.svg
GO_LIVE.md          → Supabase SQL + deploy checklist
```

There is no separate `css/` or modular `js/app.js` on `main`. An incomplete modular split was abandoned; do not rely on `js/core.js` placeholders.

## Versioning

- UI constant: `window.APP_VERSION` / meta `app-version` (currently `8.0.0`)
- PWA cache name in `sw.js`: `dr-care-v8` — bump both when you intentionally invalidate client caches
- Header shows a small **v8.0.0** tag next to “Patient Tracker”

## Deploy (Vercel / static host)

- Framework: **Other** (static)
- Root: repo root (folder with `index.html`)
- No build command
- After deploy: hard-refresh so the service worker picks up **dr-care-v8** (or the new cache name if you bumped it)

## Supabase

See `GO_LIVE.md` for SQL columns (`custom_benefits`, `date_t2`, etc.).

## Dev

Edit `index.html` (and `sw.js` / `manifest.json` as needed), commit, push. Vercel redeploys from `main`.
