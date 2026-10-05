# DR CARE — Divine Rays Mobile Operations Tracker

Offline-first field roster for Divine Rays mobile medical operations.

## Deploy (GitHub Pages / static host)

**Production file:** `index.html` (single file, includes all CSS/JS).

Also required next to it:
- `supabase.js`
- `xlsx.full.min.js`
- `sw.js`
- `manifest.json`

After updating `index.html`, hard-refresh the site (or clear cache once) so the service worker picks up changes.

## Local modular layout (optional, for development)

```
css/app.css
js/core.js      — config, state, sync
js/ui.js        — roster render
js/screens.js   — modals, dashboard, admin
js/features.js  — drawer, merge, checklist
js/boot.js      — SW toast
index.modular.html
```

The modular tree mirrors the same app; `index.html` is the bundled deploy artifact.

## Supabase optional columns

```sql
alter table patients
  add column if not exists medicine boolean default false,
  add column if not exists vitamins boolean default false,
  add column if not exists referral boolean default false,
  add column if not exists mca_photo text,
  add column if not exists custom_benefits jsonb default '{}'::jsonb,
  add column if not exists history jsonb default '[]'::jsonb;
```

**Boyz at the Back · © 2026**
