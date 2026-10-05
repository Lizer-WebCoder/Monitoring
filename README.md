# DR CARE — Divine Rays Mobile Operations Tracker

Offline-first field roster for mobile medical operations (PhilHealth, MCA, benefits, claims, multi-user Supabase sync).

## Architecture (modular)

```
index.html          → shell markup only
css/app.css         → all styles
js/core.js          → config, state, auth helpers, sync, storage
js/ui.js            → roster render, rows, filters, stats
js/screens.js       → modals, dashboard, admin, activity, import/export
js/features.js      → drawer, merge, checklist, shortcuts, print queue
js/boot.js          → SW update toast
supabase.js         → vendor
xlsx.full.min.js    → vendor
sw.js               → PWA cache (v6)
manifest.json
```

Scripts load in order at the bottom of `index.html` (no bundler). Shared state uses globals intentionally for a simple static deploy.

## Deploy

Upload the whole folder. After deploy, hard-refresh so `sw.js` picks up **dr-care-v6**.

**Boyz at the Back · © 2026**
