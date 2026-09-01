const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.54: authoritative mobile dock + operational dashboard. Older handlers must not own these surfaces.
(function(){
  const byId=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const dt=v=>{if(!v)return'—';const d=new Date(v);return Number.isNaN(+d)?'—':d.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})};
  let dashLoading=false,dashToken=0;

  function navigate(page){
    try{if(globalThis.mvNavigationV16282?.navigate){globalThis.mvNavigationV16282.navigate(page);return}}
    catch(_){}
    try{if(typeof show==='function')show(page)}catch(_){}
  }

  function ownDock(){
    const dock=byId('mvBottomDock85');if(!dock)return;
    dock.dataset.mvAuthority='163.54';
    dock.querySelectorAll('button[data-mv-dock]').forEach(old=>{
      if(old.dataset.mvOwned16354==='1')return;
      const b=old.cloneNode(true);b.dataset.mvOwned16354='1';old.replaceWith(b);
      b.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        const p=b.dataset.mvDock;
        if(p==='menu'){try{globalThis.mvNavigationV16282?.openMenu?.()}catch(_){};return}
        navigate(p);
        setTimeout(()=>{syncDock();if(p==='inicio')loadDashboard()},50);
      },true);
    });
  }
  function syncDock(){
    const cur=document.body.dataset.mvPage||globalThis.mvNavigationV16282?.page||'inicio';
    document.querySelectorAll('#mvBottomDock85 [data-mv-dock]').forEach(b=>b.classList.toggle('active',b.dataset.mvDock===cur));
  }

  function dashboardHost(){
    const p=byId('p-inicio');if(!p)return null;
    let host=byId('mvDashTrips16354');
    if(!host){
      host=document.createElement('section');host.id='mvDashTrips16354';host.className='mv-dash-trips16354';
      host.innerHTML='<div class="mv-dash-tabs16354" role="tablist"><button type="button" data-dtab="scheduled" class="active">Agendadas <span id="mvDashScheduledCount16354">0</span></button><button type="button" data-dtab="completed">Finalizadas <span id="mvDashCompletedCount16354">0</span></button><button type="button" data-dtab="alerts">Avisos <span id="mvDashAlertCount16354">0</span></button></div><div id="mvDashTripsBody16354" class="mv-dash-trips-body16354"><div class="mv-dash-loading16354">Atualizando...</div></div>';
      const head=byId('mvDashboardHead85');(head||p.firstElementChild)?.insertAdjacentElement('afterend',host);
      host.addEventListener('click',e=>{const t=e.target.closest('[data-dtab]');if(!t)return;host.querySelectorAll('[data-dtab]').forEach(x=>x.classList.toggle('active',x===t));renderTab(t.dataset.dtab)},true);
    }
    return host;
  }
  let dashData={scheduled:[],completed:[],alerts:[]},activeTab='scheduled';
  function renderTab(tab){
    activeTab=tab||activeTab;const body=byId('mvDashTripsBody16354');if(!body)return;
    const rows=dashData[activeTab]||[];
    if(!rows.length){body.innerHTML='<div class="mv-dash-empty16354">Nenhum registro nesta aba.</div>';return}
    if(activeTab==='scheduled')body.innerHTML=rows.map(x=>'<button type="button" class="mv-dash-row16354" data-open-agenda><div><small>AGENDADA · '+dt(x.scheduled_at)+'</small><b>'+esc(x.origin||'Origem não informada')+' → '+esc(x.destination||'Destino não informado')+'</b><span>'+esc(x.purpose||'Percurso programado')+'</span></div><strong>Agenda ›</strong></button>').join('');
    else if(activeTab==='completed')body.innerHTML=rows.map(x=>'<button type="button" class="mv-dash-row16354" data-open-history><div><small>FINALIZADA · '+dt(x.ended_at||x.started_at||x.trip_date)+'</small><b>'+esc(x.origin||'Origem não informada')+' → '+esc(x.destination||'Destino não informado')+'</b><span>'+esc(x.purpose||'Percurso concluído')+'</span></div><strong>Ver ›</strong></button>').join('');
    else body.innerHTML=rows.map(x=>'<div class="mv-dash-alert16354"><div><small>CONFIRMAÇÃO PENDENTE · '+dt(x.scheduled_at)+'</small><b>'+esc(x.origin||'Origem não informada')+' → '+esc(x.destination||'Destino não informado')+'</b><span>Esta viagem estava agendada e ainda não consta como iniciada/finalizada.</span></div><button type="button" data-alert-agenda>Revisar na Agenda</button></div>').join('');
    body.querySelectorAll('[data-open-agenda],[data-alert-agenda]').forEach(b=>b.onclick=()=>navigate('agenda'));
    body.querySelectorAll('[data-open-history]').forEach(b=>b.onclick=()=>navigate('historico'));
  }

  async function loadDashboard(){
    if(dashLoading||!ses?.user?.id||!org?.id)return;dashLoading=true;const token=++dashToken;dashboardHost();
    try{
      const now=new Date().toISOString();
      const [sq,cq]=await Promise.all([
        sb.from('km_scheduled_trips').select('id,scheduled_at,origin,destination,purpose,status,trip_id').eq('organization_id',org.id).eq('user_id',ses.user.id).order('scheduled_at',{ascending:false}).limit(30),
        sb.from('km_trips').select('id,trip_date,started_at,ended_at,origin,destination,purpose,status').eq('organization_id',org.id).eq('user_id',ses.user.id).eq('status','completed').order('ended_at',{ascending:false}).limit(12)
      ]);
      if(token!==dashToken)return;
      const scheduled=(sq.data||[]).filter(x=>x.status==='scheduled'||x.status==='pending');
      const alerts=scheduled.filter(x=>!x.trip_id&&x.scheduled_at&&x.scheduled_at<now);
      dashData={scheduled:scheduled.slice(0,10),completed:(cq.data||[]),alerts};
      const sc=byId('mvDashScheduledCount16354'),cc=byId('mvDashCompletedCount16354'),ac=byId('mvDashAlertCount16354');if(sc)sc.textContent=String(dashData.scheduled.length);if(cc)cc.textContent=String(dashData.completed.length);if(ac)ac.textContent=String(dashData.alerts.length);
      const alertsTab=document.querySelector('#mvDashTrips16354 [data-dtab="alerts"]');if(alertsTab)alertsTab.classList.toggle('has-alerts',dashData.alerts.length>0);
      renderTab(activeTab);
    }catch(e){const body=byId('mvDashTripsBody16354');if(body)body.innerHTML='<div class="mv-dash-empty16354">Não foi possível atualizar viagens do Dashboard.</div>';console.warn('v163.54 dashboard',e)}finally{dashLoading=false}
  }

  function suppressLegacyOwners(){
    document.documentElement.dataset.mvUiAuthority='163.54';
    document.querySelectorAll('#mvBottomV16249').forEach(x=>{x.hidden=true;x.setAttribute('aria-hidden','true')});
    // The original mobile .nav remains only as the slide/menu source; it must never occupy the bottom edge.
    const nav=document.querySelector('#app>.nav');if(nav)nav.dataset.mvLegacyMenuSource='1';
  }
  function sync(){suppressLegacyOwners();ownDock();syncDock();dashboardHost();if((document.body.dataset.mvPage||'inicio')==='inicio')loadDashboard()}
  [0,120,400,900,1800].forEach(ms=>setTimeout(sync,ms));
  document.addEventListener('click',e=>{const p=e.target.closest?.('[data-p],[data-p-jump]')?.dataset?.p||e.target.closest?.('[data-p-jump]')?.dataset?.pJump;if(p==='inicio')setTimeout(loadDashboard,100)},true);
  addEventListener('pageshow',()=>setTimeout(sync,80),true);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&document.body.dataset.mvPage==='inicio')loadDashboard()});
  globalThis.mvUiAuthorityV16354={sync,loadDashboard,navigate};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.54 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.54 single-authority navigation + dashboard */
#mvDashTrips16354{grid-column:1/-1!important;background:#fff;border:1px solid #e1e7ee;border-radius:9px;overflow:hidden;margin:0 0 12px}.mv-dash-tabs16354{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #e4e9ef;background:#f8fafc}.mv-dash-tabs16354 button{min-height:42px!important;border:0!important;border-right:1px solid #e5eaf0!important;border-radius:0!important;background:transparent!important;color:#526074!important;font-size:11px!important}.mv-dash-tabs16354 button:last-child{border-right:0!important}.mv-dash-tabs16354 button.active{background:#fff!important;color:#0b66e4!important;box-shadow:inset 0 -2px #0b66e4!important}.mv-dash-tabs16354 button span{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;margin-left:4px;border-radius:999px;background:#e9eef5;color:#556274;font-size:9px}.mv-dash-tabs16354 button.has-alerts span{background:#fff0d8;color:#9a6200}.mv-dash-trips-body16354{padding:8px}.mv-dash-row16354{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;width:100%!important;padding:10px 11px!important;margin:0 0 6px!important;border:1px solid #e5eaf0!important;border-radius:7px!important;background:#fff!important;color:#213047!important;text-align:left!important}.mv-dash-row16354>div{display:grid;gap:2px;min-width:0}.mv-dash-row16354 small,.mv-dash-alert16354 small{font-size:9px;color:#708096}.mv-dash-row16354 b,.mv-dash-alert16354 b{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mv-dash-row16354 span,.mv-dash-alert16354 span{font-size:10px;color:#68768a}.mv-dash-row16354 strong{font-size:10px;color:#0b66e4;white-space:nowrap}.mv-dash-alert16354{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 11px;margin-bottom:6px;border:1px solid #f0d9a9;border-radius:7px;background:#fffaf0}.mv-dash-alert16354>div{display:grid;gap:2px;min-width:0}.mv-dash-alert16354 button{width:auto!important;min-height:34px!important;padding:7px 10px!important;font-size:10px!important;background:#fff!important;color:#9a6500!important;border:1px solid #e9c983!important}.mv-dash-empty16354,.mv-dash-loading16354{padding:18px;text-align:center;color:#748095;font-size:11px}
@media(max-width:820px){#app>.nav[data-mv-legacy-menu-source="1"]{top:0!important;bottom:auto!important;left:0!important;right:auto!important;position:fixed!important;max-height:100vh!important}#mvBottomDock85{pointer-events:auto!important;z-index:300!important}#mvBottomDock85 button{pointer-events:auto!important}.mv-dash-tabs16354 button{padding:5px 3px!important;font-size:10px!important}.mv-dash-alert16354{grid-template-columns:1fr}.mv-dash-alert16354 button{width:100%!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.54 css anchor not found');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.54 authoritative navigation and dashboard installed');
