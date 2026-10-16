DR CARE — Divine Rays Patient Care Tracker

Offline-first patient care tracker (roster, PhilHealth, claims, benefits, multi-user Supabase sync).

Version: 8.1.0 · Service worker cache: dr-care-v8
Live: https://dr-care-monitoring.vercel.app

Layout (intentional monolith)

CSS and application logic live inside index.html on purpose (simpler field deploy). Do not half-split into modular js/ without finishing the cut.

index.html          → markup + CSS + app logic
supabase.js         → vendor
xlsx.full.min.js    → vendor
sw.js               → PWA (CACHE_NAME = dr-care-v8)
manifest.json
GO_LIVE.md          → schema, Realtime, RLS, smoke test

Multi-user





Realtime on patients (when publication enabled) + 20s poll backup



Unsynced local edits are not overwritten by live events



Staff: keep month filter on for large rosters

Shortcuts







Key



Action





/



Focus search





Esc



Close top dialog





N



Add patient (when available)

Deploy

Vercel: Framework Other, no build, root = repo root. Hard-refresh after deploy.

See GO_LIVE.md for SQL (columns, Realtime, RLS) and smoke tests.
