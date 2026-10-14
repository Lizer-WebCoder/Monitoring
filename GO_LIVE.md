# DR CARE — Go-Live Checklist

## 1. Supabase

```sql
alter table patients
  add column if not exists medicine boolean default false,
  add column if not exists vitamins boolean default false,
  add column if not exists referral boolean default false,
  add column if not exists mca_photo text,
  add column if not exists custom_benefits jsonb default '{}'::jsonb,
  add column if not exists history jsonb default '[]'::jsonb,
  add column if not exists date_t1 date,
  add column if not exists date_t2 date,
  add column if not exists lab_tests text;

alter table profiles
  add column if not exists approved boolean default false,
  add column if not exists role text default 'encoder',
  add column if not exists full_name text,
  add column if not exists last_seen timestamptz;
```

## 2. Vercel

Framework **Other**, no build command, root = folder with index.html.

## 3. Smoke test

Login → set System/T1/T2 by/T2 date → Sync → reopen → values persist.
