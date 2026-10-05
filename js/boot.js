/* DR CARE — boot: service worker toast, final init hooks */
function showSwUpdateToast(reg){
  if(document.getElementById('swUpdateToast')) return;
  const toast = document.createElement('div');
  toast.id = 'swUpdateToast';
  toast.style.cssText = 'position:fixed;bottom:24px;right:16px;z-index:300;background:var(--teal-deep);color:#f2ede0;padding:12px 16px;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,0.25);font-size:13px;font-weight:600;display:flex;gap:12px;align-items:center;max-width:min(340px,calc(100vw - 24px));';
  toast.innerHTML = `<span>Update available</span>
    <button type="button" style="background:#fff;color:#0b3630;border:none;border-radius:6px;padding:6px 12px;font-weight:700;cursor:pointer;font-size:12px;">Refresh</button>
    <button type="button" style="background:transparent;color:#c7dcd5;border:none;cursor:pointer;font-size:16px;line-height:1;" aria-label="Dismiss">×</button>`;
  const [refreshBtn, dismissBtn] = toast.querySelectorAll('button');
  refreshBtn.addEventListener('click', ()=>{
    if(reg && reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  });
  dismissBtn.addEventListener('click', ()=> toast.remove());
  document.body.appendChild(toast);
}
