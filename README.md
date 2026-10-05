# DR CARE — Divine Rays Mobile Operations Tracker

Offline-first field roster for mobile medical / relief operations: patients, PhilHealth, MCA (with photo), claims, benefits, GPS sites, multi-user Supabase sync, reports, and more.

---

## Features

| Area | Details |
|------|---------|
| **Auth & roles** | Admin / encoder / viewer. New accounts need admin approval. |
| **Offline-first** | Works offline; queues sync; PWA installable. |
| **Patients** | Name, PhilHealth (12-digit check), status, facility, MCA + **photo**, dates, claim, notes. |
| **Benefits** | Rice, lab, medicines, vitamins, referral + **custom benefits** (admin-defined). |
| **Duplicates** | Live PhilHealth duplicate detection. |
| **Teams** | Staff list + **GPS location** (use my location → OpenStreetMap link). |
| **Audit** | Added/edited by + timestamps + **change history** on each patient. |
| **Recycle bin** | Permanently deleted patients kept ~30 days on-device for restore. |
| **Reports** | CSV export, **Daily report** CSV, **PDF/print report**, **Email / Slack** send. |
| **Language** | **EN / TL** (Tagalog) toggle for main toolbar labels. |
| **Bulk** | Select rows → benefits, MCA, claim, status. |
| **Dashboard / Activity / Archive / Admin** | Metrics, recent changes, soft-archive, user roles. |

---

## Supabase (optional columns)

```sql
alter table patients
  add column if not exists medicine boolean default false,
  add column if not exists vitamins boolean default false,
  add column if not exists referral boolean default false,
  add column if not exists mca_photo text,
  add column if not exists custom_benefits jsonb default '{}'::jsonb,
  add column if not exists history jsonb default '[]'::jsonb;
```

Settings keys used: `orgName`, `customBenefits`, `teamGeo`.

Without new columns, core fields still sync; photo/history/custom benefits stay local until columns exist.

---

## Field workflow

1. Admin approves users; optionally **Custom benefits…** in Admin.
2. **+ Add Mobile** → staff + optional GPS.
3. Encode patients (MCA photo optional). Offline OK.
4. End of day: **Daily report** / **PDF report** / **Send report** (email or Slack webhook).
5. Mistaken permanent delete → **Recycle bin** → Restore.

---

## Files

- `index.html` — app  
- `supabase.js`, `xlsx.full.min.js`, `sw.js`, `manifest.json`

**Boyz at the Back · © 2026**
