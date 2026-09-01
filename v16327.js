const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.55: Google Calendar connection/status and automatic schedule sync.
(function(){
  const byId=id=>document.getElementById(id);
  let statusCache=null,statusBusy=false,lastSynced='';
  async function token(){try{return (await sb.auth.getSession()).data.session?.access_token||''}catch{return''}}
  async function api(path,opts={}){const t=await token();const h={...(opts.headers||{})};if(t)h.Authorization='Bearer '+t;if(opts.body&&!h['Content-Type'])h['Content-Type']='application/json';const r=await fetch(path,{...opts,headers:h});const j=await r.json().catch(()=>({}));return {ok:r.ok,status:r.status,data:j}}
  function host(){
    const p=byId('p-agenda');if(!p)return null;let x=byId('mvGoogleCalendar16355');if(x)return x;
    x=document.createElement('section');x.id='mvGoogleCalendar16355';x.className='mv-google-cal16355';x.innerHTML='<div class="mv-google-cal-head16355"><div><small>INTEGRAÇÃO</small><h3>Google Agenda</h3><p id="mvGoogleCalendarText16355">Verificando conexão...</p></div><span id="mvGoogleCalendarBadge16355">...</span></div><div class="mv-google-cal-actions16355"><button type="button" id="mvGoogleCalendarConnect16355">Conectar Google Agenda</button><button type="button" id="mvGoogleCalendarSync16355" class="sec">Sincronizar pendentes</button><button type="button" id="mvGoogleCalendarDisconnect16355" class="sec">Desconectar</button></div>';
    const head=p.querySelector(':scope>.mv-pagehead87')||p.firstElementChild;(head||p).insertAdjacentElement?.('afterend',x);
    byId('mvGoogleCalendarConnect16355').onclick=connect;
    byId('mvGoogleCalendarSync16355').onclick=syncPending;
    byId('mvGoogleCalendarDisconnect16355').onclick=disconnect;
    return x;
  }
  function paint(st){
    host();const text=byId('mvGoogleCalendarText16355'),badge=byId('mvGoogleCalendarBadge16355'),connect=byId('mvGoogleCalendarConnect16355'),sync=byId('mvGoogleCalendarSync16355'),disc=byId('mvGoogleCalendarDisconnect16355');if(!text)return;
    if(!st?.configured){text.textContent='OAuth do Google ainda precisa ser concluído no servidor do Movvant.';badge.textContent='Pendente';badge.className='pending';connect.disabled=true;sync.hidden=true;disc.hidden=true;return}
    if(st.connected){text.textContent='Conectado'+(st.email?' a '+st.email:'')+'. Novas viagens agendadas serão sincronizadas automaticamente.';badge.textContent='Conectado';badge.className='ok';connect.hidden=true;sync.hidden=false;disc.hidden=false}
    else{text.textContent='Conecte uma vez para enviar automaticamente as viagens agendadas ao Google Agenda.';badge.textContent='Desconectado';badge.className='off';connect.hidden=false;connect.disabled=false;sync.hidden=true;disc.hidden=true}
  }
  async function refreshStatus(){if(statusBusy||!org?.id)return statusCache;statusBusy=true;try{const r=await api('/api/google-calendar/status?organization_id='+encodeURIComponent(org.id));if(r.status===503){const h=await api('/api/google-calendar/health');statusCache={configured:!!h.data?.configured,connected:false};paint(statusCache);return statusCache}statusCache=r.data;paint(statusCache);return statusCache}finally{statusBusy=false}}
  async function connect(){
    if(!org?.id)return;const b=byId('mvGoogleCalendarConnect16355');if(b){b.disabled=true;b.textContent='Abrindo Google...'}
    try{const r=await api('/api/google-calendar/auth-url?organization_id='+encodeURIComponent(org.id));if(!r.ok||!r.data?.url){paint({configured:r.data?.configured!==false,connected:false});if(typeof msg==='function')msg(r.data?.error==='google_calendar_backend_not_configured'?'Google Agenda ainda não está configurado no servidor.':'Não foi possível iniciar a conexão com o Google.',true);return}location.href=r.data.url}catch(e){if(typeof msg==='function')msg('Falha ao abrir autorização do Google.',true)}finally{if(b){b.disabled=false;b.textContent='Conectar Google Agenda'}}
  }
  async function syncOne(id,quiet=false){if(!id||lastSynced===id)return false;const r=await api('/api/google-calendar/sync',{method:'POST',body:JSON.stringify({schedule_id:id})});if(r.ok&&r.data?.synced){lastSynced=id;if(!quiet&&typeof msg==='function')msg('Viagem sincronizada com o Google Agenda.');return true}if(!quiet&&r.status===409&&typeof msg==='function')msg('Viagem salva. Conecte o Google Agenda para sincronizar.');return false}
  async function latestScheduleId(){try{const r=await sb.from('km_scheduled_trips').select('id,created_at').eq('organization_id',org.id).eq('user_id',ses.user.id).order('created_at',{ascending:false}).limit(1);return r.data?.[0]?.id||''}catch{return''}}
  async function syncLatest(){const st=await refreshStatus();if(!st?.connected)return;let id='';try{id=JSON.parse(sessionStorage.getItem('mv_last_scheduled_16352')||'null')?.id||''}catch(_){}if(!id)id=await latestScheduleId();if(id)await syncOne(id,true);try{globalThis.mvUiAuthorityV16354?.loadDashboard?.()}catch(_){}}
  async function syncPending(){const b=byId('mvGoogleCalendarSync16355');if(b){b.disabled=true;b.textContent='Sincronizando...'}try{const st=await refreshStatus();if(!st?.connected)return;const r=await sb.from('km_scheduled_trips').select('id,google_calendar_sync_status').eq('organization_id',org.id).eq('user_id',ses.user.id).eq('status','scheduled').order('scheduled_at',{ascending:true}).limit(20);let n=0;for(const x of r.data||[]){if(x.google_calendar_sync_status==='synced')continue;if(await syncOne(x.id,true))n++}if(typeof msg==='function')msg(n?String(n)+' agendamento(s) sincronizado(s) com o Google Agenda.':'Google Agenda já está atualizado.')}catch(e){if(typeof msg==='function')msg('Falha ao sincronizar Google Agenda.',true)}finally{if(b){b.disabled=false;b.textContent='Sincronizar pendentes'}}}
  async function disconnect(){if(!org?.id)return;const r=await api('/api/google-calendar/disconnect',{method:'POST',body:JSON.stringify({organization_id:org.id})});if(r.ok){statusCache={configured:true,connected:false};paint(statusCache);if(typeof msg==='function')msg('Google Agenda desconectado.')}else if(typeof msg==='function')msg('Não foi possível desconectar o Google Agenda.',true)}
  function oauthReturn(){const u=new URL(location.href);if(u.searchParams.get('google_calendar')!=='connected')return;u.searchParams.delete('google_calendar');history.replaceState(history.state,'',u.pathname+u.search+u.hash);setTimeout(async()=>{await refreshStatus();await syncPending()},250)}
  function watchScheduleClicks(){document.addEventListener('click',e=>{if(e.target.closest?.('#mvSaveScheduledTripV16284,#btAgenda'))setTimeout(syncLatest,900)},true)}
  function sync(){host();refreshStatus();oauthReturn()}
  watchScheduleClicks();window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='movvant-google-calendar'&&e.data?.status==='connected'){refreshStatus().then(syncPending)}});
  [0,250,900,1800].forEach(ms=>setTimeout(sync,ms));
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-p="agenda"],[data-p-jump="agenda"],[data-mv-dock="agenda"]'))setTimeout(refreshStatus,120)},true);
  globalThis.mvGoogleCalendarV16355={refreshStatus,syncPending,syncLatest};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.55 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.55 Google Calendar integration */
#mvGoogleCalendar16355{border:1px solid #dfe6ee;border-radius:9px;background:#fff;padding:13px;margin:0 auto 10px;max-width:1180px}.mv-google-cal-head16355{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.mv-google-cal-head16355 small{display:block;font-size:9px;color:#748297;font-weight:800;letter-spacing:.06em}.mv-google-cal-head16355 h3{margin:2px 0 3px!important;font-size:14px!important;color:#243247}.mv-google-cal-head16355 p{margin:0;color:#6e7b8e;font-size:10px;line-height:1.4}.mv-google-cal-head16355>span{border-radius:999px;padding:5px 8px;font-size:9px;font-weight:800;background:#eef2f6;color:#687588;white-space:nowrap}.mv-google-cal-head16355>span.ok{background:#e8f7ee;color:#167843}.mv-google-cal-head16355>span.pending{background:#fff3dd;color:#996300}.mv-google-cal-actions16355{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.mv-google-cal-actions16355 button{width:auto!important;min-height:34px!important;padding:7px 10px!important;font-size:10px!important}@media(max-width:820px){#mvGoogleCalendar16355{margin:0 0 9px}.mv-google-cal-head16355{align-items:center}.mv-google-cal-actions16355{display:grid;grid-template-columns:1fr}.mv-google-cal-actions16355 button{width:100%!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.55 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.55 Google Calendar UI and sync client installed');
