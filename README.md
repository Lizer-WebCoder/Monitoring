# Field Roster — Mobile Medical Operations Tracker

A single-page tool for tracking patients across mobile medical / relief operations: registration status, MCA attachment, submission timing, claim status, duplicate IDs, and benefit distribution (rice, lab, or any others you add).

## Put it on GitHub (free hosting, no server needed)

1. Create a new GitHub repository (e.g. `field-roster`).
2. Upload `index.html` to the root of the repo.
3. Go to **Settings → Pages**, set source to the `main` branch / root folder, and save.
4. GitHub gives you a live link like `https://yourname.github.io/field-roster/` — bookmark that on every team laptop or tablet.

No build step, no dependencies, no backend. It's one HTML file.

## How data is stored

The app saves everything in the browser's local storage **on that one device**. That means:

- ✅ Works fully offline once the page has loaded once (good for field sites with spotty signal).
- ✅ Nothing to configure — open the link and start entering patients.
- ⚠️ **Data does not sync between devices or team members.** Each phone/laptop has its own separate roster.

**Workflow that works well for this today:** each mobile team enters on their own device during the day, then hits **Export CSV** at end-of-shift. One person merges the CSVs (Excel/Sheets) into the master tracker each evening. Import CSV lets you bring a merged file back into the tool if you want a single combined view on one device.

**If you outgrow single-device use** (multiple teams need to see the *same* live roster at once), the next step up is swapping local storage for a shared backend — Google Sheets API, Airtable, or a small Supabase/Firebase project. Say the word and I can build that version; the interface stays the same, only the data layer changes.

## What's different from the spreadsheet, and why

| Change | Why |
|---|---|
| Status and claim fields are dropdowns, not free-typed text | Prevents "SUBMITTED" vs "submited" vs "Submitted" — one form of the truth, and it's what lets automatic counts work at all |
| Duplicate Tracker is automatic, not manually typed | It now checks every PhilHealth ID against the whole roster live, so a duplicate can't slip through because someone forgot to flag it |
| Summary counts at the top | No more manually counting checkmarks down a column — registered/submitted/rice/lab/duplicate totals update as you type |
| Search + filter bar | Find one patient instantly in a roster of hundreds, or isolate "rice not yet availed" to see who's still owed |
| Teams/sites are collapsible groups | Keeps a long roster scannable, same grouping idea as "PLACE OF PROFILING / MOBILE" in your sheet, but foldable |
| CSV export/import | Gives you a portable backup and a way to merge multiple devices' data, since local storage doesn't sync on its own |
| One row = one modal form to edit | Reduces mis-clicks on the wrong checkbox/column in a dense table, especially on a phone screen in the field |

## Other suggestions worth considering

- **Add a "last updated by" field** if more than one person edits the same device — even just initials — so you can trace who validated what.
- **Lock the PhilHealth ID format** (e.g. require a consistent digit pattern) if your province uses a standard format — catches typos at entry instead of after.
- **Add more benefit columns as needed** — the code has `rice` and `lab` as an example pair; duplicating that pattern (checkbox + column + filter option) for medicines, vitamins, or referrals takes a few lines each. Ask me and I'll add them.
- **Print view** is included (top toolbar) for a physical printout to leave with a site supervisor who has no device.
- **Color + text together** on every status badge (not just color) so the tool stays usable for colorblind staff — already done, but worth keeping in mind if you extend it.

## Customizing

Everything lives in `index.html` — no build tools. To change the organization branding, colors, or add a column, edit that file directly and re-upload to GitHub (or ask me for the specific change and I'll hand you the updated file).
