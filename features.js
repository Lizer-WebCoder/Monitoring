/* features pack - loaded after main app script */

const LANG_KEY = 'drcare_lang';
const CUSTOM_BENEFITS_KEY = 'drcare_custom_benefits';
const REPORT_CFG_KEY = 'drcare_report_cfg';
const RECYCLE_KEY = 'drcare_recycle_bin';
const TEAM_GEO_KEY = 'drcare_team_geo';

const I18N = {
  en: {
    addMobile: '+ Add Mobile', dashboard: 'Dashboard', activity: 'Activity', archived: 'Archived',
    admin: 'Admin', dark: 'Dark mode', light: 'Light mode', syncNow: 'Sync now',
    exportCsv: 'Export CSV', dailyReport: 'Daily report', importCsv: 'Import CSV',
    pdfReport: 'PDF report', sendReport: 'Send report', recycle: 'Recycle bin',
    searchPh: 'Search name, PhilHealth ID, notes, or team…'
  },
  tl: {
    addMobile: '+ Magdagdag ng Mobile', dashboard: 'Dashboard', activity: 'Aktibidad', archived: 'Naka-archive',
    admin: 'Admin', dark: 'Madilim', light: 'Maliwanag', syncNow: 'I-sync ngayon',
    exportCsv: 'I-export ang CSV', dailyReport: 'Arawang ulat', importCsv: 'Mag-import ng CSV',
    pdfReport: 'Ulat PDF', sendReport: 'Ipadala ang ulat', recycle: 'Basurahan',
    searchPh: 'Maghanap ng pangalan, PhilHealth ID, notes, o team…'
  }
};

function currentLang(){ return localStorage.getItem(LANG_KEY) === 'tl' ? 'tl' : 'en'; }
function t(key){ const L = I18N[currentLang()] || I18N.en; return L[key] || I18N.en[key] || key; }

function applyLanguage(){
  const lang = currentLang();
  const btn = document.getElementById('langToggle');
  if(btn) btn.textContent = lang === 'tl' ? 'TL' : 'EN';
  const map = [
    ['addTeamBtn', 'addMobile'], ['dashboardBtn', 'dashboard'], ['activityBtn', 'activity'],
    ['archiveToggleBtn', 'archived'], ['adminBtn', 'admin'], ['syncNowBtn', 'syncNow'],
    ['exportBtn', 'exportCsv'], ['dailyReportBtn', 'dailyReport'], ['importBtn', 'importCsv'],
    ['pdfReportBtn', 'pdfReport'], ['sendReportBtn', 'sendReport'], ['recycleBtn', 'recycle']
  ];
  map.forEach(([id, key])=>{
    const el = document.getElementById(id);
    if(!el) return;
    const iconSvg = el.querySelector('svg');
    const label = t(key);
    if(iconSvg){
      el.innerHTML = '';
      el.appendChild(iconSvg);
      el.appendChild(document.createTextNode(' ' + label));
    } else {
      el.textContent = label;
    }
  });
  const search = document.getElementById('search');
  if(search) search.placeholder = t('searchPh');
  const themeBtn = document.getElementById('themeToggle');
  if(themeBtn){
    const dark = document.body.classList.contains('dark');
    const iconSvg = themeBtn.querySelector('svg');
    const label = dark ? t('light') : t('dark');
    if(iconSvg){ themeBtn.innerHTML = ''; themeBtn.appendChild(iconSvg); themeBtn.appendChild(document.createTextNode(' ' + label)); }
  }
}

document.getElementById('langToggle') && document.getElementById('langToggle').addEventListener('click', ()=>{
  localStorage.setItem(LANG_KEY, currentLang() === 'tl' ? 'en' : 'tl');
  applyLanguage();
});
