DR CARE — Go-Live Checklist (P0)

Live: https://dr-care-monitoring.vercel.app
Version target: 8.x · SW cache dr-care-v8



1. Supabase schema

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



2. Realtime (live multi-user) — required once

-- Allow the app to receive INSERT/UPDATE/DELETE on patients
alter publication supabase_realtime add table patients;

If you see “already member of publication”, Realtime is already enabled.

Check: After deploy, browser console should show: [realtime] patients channel live

If you see CHANNEL_ERROR / TIMED_OUT, re-check this publication and RLS SELECT policies.



3. RLS (Row Level Security) — recommended baseline

Enable RLS and allow authenticated staff to use the roster. Adjust if you use stricter mobile assignment later.

-- PROFILES
alter table profiles enable row level security;

-- Users can read profiles (for names / presence in admin)
drop policy if exists "profiles_select_authenticated" on profiles;
create policy "profiles_select_authenticated"
  on profiles for select
  to authenticated
  using (true);

-- Users can update their own profile row (e.g. last_seen)
drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can update any profile (approve / role) — requires a helper or role claim.
-- Simple approach: allow update when the caller's profile.role = 'admin'
drop policy if exists "profiles_admin_update" on profiles;
create policy "profiles_admin_update"
  on profiles for update
  to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- PATIENTS
alter table patients enable row level security;

drop policy if exists "patients_select_authenticated" on patients;
create policy "patients_select_authenticated"
  on patients for select
  to authenticated
  using (true);

drop policy if exists "patients_insert_authenticated" on patients;
create policy "patients_insert_authenticated"
  on patients for insert
  to authenticated
  with check (true);

drop policy if exists "patients_update_authenticated" on patients;
create policy "patients_update_authenticated"
  on patients for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "patients_delete_authenticated" on patients;
create policy "patients_delete_authenticated"
  on patients for delete
  to authenticated
  using (true);

Notes





Realtime only delivers rows the user can SELECT.



Tighten later (e.g. encoder only sees assigned mobiles) after assignment UI is solid.



If you already have policies, do not blindly drop without reviewing in Dashboard → Authentication → Policies.

Verify: Sign in as encoder → add patient → Sync → second browser/user sees row (Realtime or within ~20s poll).



4. Staff practice — month filter (scale)

At 200+ patients the app prefers the current month.







Do



Don’t





Keep a month selected for daily encoding



Work on All months with 5k–10k rows open





Page size 20–50



Page size “everything”





Use Today’s mission for field days



Expand every site at once on a slow phone

Training one-liner: “Always encode under this month. All months is for search/admin only.”



5. Vercel





Framework: Other (static)



No build command



Root = folder with index.html



After each deploy: hard-refresh so SW picks up cache name



6. Smoke test





Login (approved encoder/admin)



Confirm month filter is set (or set current month)



Add/edit patient → benefits / T1 / T2



Sync now → reopen → values persist



Second user (or second browser): see update live or within ~20s



Select several patients → bulk bar fully visible (no clipped labels)



Console: no red errors; preferably [realtime] patients channel live



7. P0 code checklist (app)





[x] Styled dialogs for primary flows (merge, confirms)



[x] Scale pack (month index, leaner render)



[x] Realtime client (startPatientsRealtime)



[x] Native alert() mostly → showAppAlert



[x] Bulk action bar panel (not pill) — no clipped actions



[ ] You run Realtime publication SQL in Supabase



[ ] You review/apply RLS SQL above



[ ] Brief staff on month filter



P0–P4 delivery (v8.1.0)

Done in app





Styled dialogs; bulk bar panel; scale pack; Realtime client



Remaining alerts → showAppAlert



Version badge v8.1.0 + Account changelog



Clearer sync pill (Live · multi-user, pending counts)



Keyboard: / search, Esc close dialog



Activity Export CSV (admin)



Stronger empty-state guidance (month filter)

You still do in Supabase





alter publication supabase_realtime add table patients;



Review/apply RLS from §3 above

Explicitly deferred (too large / needs product design)





Full table virtualization



Server-only history (no local year cache)



Full modular JS split



Env-based secrets (keys still in index for static host)



Dedicated mobile-assignment admin UI (prompt remains)



Duplicate PHID merge wizard UI



Automated CI smoke tests

Release tag (optional)

git tag -a v8.1.0 -m "DR CARE 8.1.0 — realtime, scale, P0-P4 package"
git push origin v8.1.0

