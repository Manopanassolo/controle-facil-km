const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.57: resilient Google Calendar integration host for the current Agenda shell.
(function(){
  function byId(id){return document.getElementById(id)}
  function agendaHost(){
    const direct=byId('p-agenda');if(direct)return direct;
    const candidates=[...document.querySelectorAll('main,section,article,div')];
    return candidates.find(x=>{const h=[...x.querySelectorAll(':scope > h1,:scope > h2,:scope > header h1,:scope > header h2')].find(h=>h.textContent.trim()==='Agenda');return !!h})||null;
  }
  function ensure(){
    if(byId('mvGoogleCalendar16355'))return true;
    const p=agendaHost();if(!p)return false;
    const x=document.createElement('section');x.id='mvGoogleCalendar16355';x.className='mv-google-cal16355';
    x.innerHTML='<div class="mv-google-cal-head16355"><div><small>INTEGRAÇÃO</small><h3>Google Agenda</h3><p id="mvGoogleCalendarText16355">Verificando conexão...</p></div><span id="mvGoogleCalendarBadge16355">...</span></div><div class="mv-google-cal-actions16355"><button type="button" id="mvGoogleCalendarConnect16355">Conectar Google Agenda</button><button type="button" id="mvGoogleCalendarSync16355" class="sec">Sincronizar pendentes</button><button type="button" id="mvGoogleCalendarDisconnect16355" class="sec">Desconectar</button></div>';
    const title=[...p.querySelectorAll('h1,h2')].find(h=>h.textContent.trim()==='Agenda');
    const anchor=title?.parentElement||p.firstElementChild||p;
    if(anchor!==p&&anchor.parentElement)anchor.insertAdjacentElement('afterend',x);else p.insertBefore(x,p.firstChild);
    byId('mvGoogleCalendarConnect16355').onclick=async()=>{try{const r=await globalThis.mvGoogleCalendarV16355?.refreshStatus?.();if(r?.connected)return;const t=(await sb.auth.getSession()).data.session?.access_token||'';const orgId=globalThis.org?.id||org?.id;if(!orgId)return;const q=await fetch('/api/google-calendar/auth-url?organization_id='+encodeURIComponent(orgId),{headers:{Authorization:'Bearer '+t}});const j=await q.json();if(j.url)location.href=j.url}catch(e){console.warn(e)}};
    byId('mvGoogleCalendarSync16355').onclick=()=>globalThis.mvGoogleCalendarV16355?.syncPending?.();
    byId('mvGoogleCalendarDisconnect16355').onclick=()=>document.dispatchEvent(new CustomEvent('mv-google-calendar-disconnect'));
    setTimeout(()=>globalThis.mvGoogleCalendarV16355?.refreshStatus?.(),30);
    return true;
  }
  const run=()=>{if(ensure())setTimeout(()=>globalThis.mvGoogleCalendarV16355?.refreshStatus?.(),50)};
  [0,100,300,800,1600,3000].forEach(ms=>setTimeout(run,ms));
  new MutationObserver(()=>{if(!byId('mvGoogleCalendar16355'))run()}).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-p="agenda"],[data-p-jump="agenda"],[data-mv-dock="agenda"]'))setTimeout(run,80)},true);
  globalThis.mvGoogleAgendaHostV16357={ensure:run};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.57 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.57 Google Agenda host installed');
