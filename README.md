# DR CARE — Divine Rays Patient Care Tracker

Offline-first patient care tracker (roster, PhilHealth, claims, benefits, multi-user Supabase sync).

## Layout (modular)

```
index.html          → markup shell only
css/app.css         → all styles
js/app.js           → application logic
supabase.js         → vendor (auth/db client)
xlsx.full.min.js    → vendor (Excel import/export)
sw.js               → PWA service worker (dr-care-v7)
manifest.json
favicon.svg
```

## Deploy (Vercel / static host)

- Framework: **Other** (static)
- Root: repo root (folder with `index.html`)
- No build command
- After deploy: hard-refresh so SW updates to **dr-care-v7**

## Supabase

See `GO_LIVE.md` for SQL columns (`custom_benefits`, `date_t2`, etc.).

## Dev

Edit `css/app.css` or `js/app.js`, commit, push. Vercel redeploys from `main`.
