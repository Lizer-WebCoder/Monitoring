# DR CARE — Divine Rays Mobile Operations Tracker

Field roster for mobile medical / relief operations. Track patients, PhilHealth IDs, MCA, claims, benefits (rice, lab, medicines, vitamins, referrals), duplicates, and staff per mobile site — offline-first, multi-user, with Supabase sync.

**Live:** open the GitHub Pages URL for this repo (Settings → Pages), or open `index.html` locally after signing in once online.

---

## Features

| Area | What you get |
|------|----------------|
| **Auth & roles** | Email sign-in via Supabase. Roles: **admin**, **encoder**, **viewer**. New accounts stay blocked until an admin approves them. |
| **Offline-first** | Works without signal after first load. Changes queue locally and upload when online. Service worker caches the app shell. |
| **Patients** | Name, PhilHealth ID (auto-formatted `1234-5678-9012`), status, facility, MCA, dates, within-24h, claim status, notes. |
| **Benefits** | Rice, laboratory, **medicines**, **vitamins**, **referral** — filterable and bulk-updatable. |
| **Duplicates** | Live PhilHealth duplicate detection across the whole roster. |
| **Teams / mobiles** | Collapsible groups, staff list per mobile, per-team export/import/print. |
| **Dashboard** | Counts, rates, scope by month and team. |
| **Activity** | Recent adds, edits, archives. |
| **Audit** | Added by / last edited by (+ timestamps when available). |
| **Import / export** | CSV and Excel templates, full or per-mobile export, daily summary report. |
| **Bulk actions** | Select rows → mark benefits, set claim, set status, MCA, within-24h. |
| **Archive** | Soft-archive patients/teams; permanent delete only from archive view. |
| **PWA** | Installable on phone/tablet; dark mode; print-friendly team view. |

---

## Quick start (GitHub Pages)

1. This repo already has the app files at the root.
2. **Settings → Pages** → source: `main` / root.
3. Open the Pages URL, sign in (or create an account and wait for admin approval).

No build step. Keep these files together:

- `index.html` — app
- `supabase.js` — Supabase client (required offline)
- `xlsx.full.min.js` — Excel import/export
- `sw.js` — service worker
- `manifest.json` — PWA manifest

---

## Supabase setup

You need a Supabase project with:

### Tables (minimal)

**`profiles`**

| column | type | notes |
|--------|------|--------|
| id | uuid PK | matches `auth.users.id` |
| email | text | |
| full_name | text | |
| role | text | `admin` \| `encoder` \| `viewer` |
| approved | boolean | default false |
| created_at | timestamptz | |

**`patients`**

| column | type | notes |
|--------|------|--------|
| id | text/uuid PK | |
| team | text | |
| name | text | |
| phid | text | |
| status | text | |
| facility | text | |
| mca | boolean | |
| date_encoded | date | |
| date_submitted | date | |
| within24 | boolean | |
| claim | text | |
| rice | boolean | |
| lab | boolean | |
| medicine | boolean | optional — run migration below |
| vitamins | boolean | optional |
| referral | boolean | optional |
| notes | text | |
| deleted | boolean | soft archive |
| created_by | uuid | |
| updated_by | uuid | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Recommended migration for new benefit columns

```sql
alter table patients
  add column if not exists medicine boolean default false,
  add column if not exists vitamins boolean default false,
  add column if not exists referral boolean default false;
```

Without these columns, rice/lab and core fields still work; the new benefit flags stay local until the columns exist.

### Auth

- Enable Email provider.
- RLS: encoders/admins can insert/update patients; viewers read-only; only admins manage `profiles.approved` and roles.

---

## Roles

| Role | Can do |
|------|--------|
| **Viewer** | See roster, dashboard, activity, export. Cannot edit. |
| **Encoder** | Add/edit patients, teams, bulk actions, import. |
| **Admin** | Everything + approve users and set roles in **Admin**. |

---

## Field workflow

1. Admin creates / approves staff accounts and sets roles.
2. Each mobile uses **+ Add Mobile**, lists managing staff, then **+ Add Patient**.
3. Encode during the day (works offline). Sync pill shows pending uploads.
4. End of shift: **Export** or **Daily report**, or rely on automatic sync.
5. Use **Duplicates only** filter and claim/Missed-24h flags before closing the day.

---

## PhilHealth ID

- Auto-formats to `####-####-####` while typing.
- Save prefers a full **12-digit** ID (warns if incomplete).
- Duplicate tracker runs on the cleaned ID across all teams.

---

## What changed vs the old local-only version

- Multi-device sync via Supabase (with offline queue).
- Login, roles, approval gate.
- Dashboard, activity, archive, bulk actions.
- Extra benefits (medicines, vitamins, referral).
- Stronger audit display and daily summary report.
- PWA install + updated offline shell.

---

## Customizing

Almost everything lives in `index.html` (no build tools). Common edits:

- `HOME_FACILITY` and facility lists near the top of the script.
- Brand colors in `:root` CSS variables.
- Benefit labels and filters in the toolbar / modal / CSV headers.

---

## Support

Built for Divine Rays field operations.  
**Boyz at the Back · © 2026**
