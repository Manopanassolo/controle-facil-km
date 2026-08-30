const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.62: compact route card and deterministic stop editor.
(function(){
  function syncStops(){
    const point=document.querySelector('#directRouteStackV127 .route-point-v126.stops');
    const body=point?.querySelector('.route-point-body-v126');
    const marker=point?.querySelector('.route-marker-v126');
    const stopInput=document.getElementById('preTripStopNameV127');
    const entry=stopInput?.closest('.pre-stop-entry-v127');
    const list=document.getElementById('preTripStopsListV127');
    if(!point||!body||!entry||!list)return;
    point.classList.add('mv-stop-v16262');
    if(marker&&marker.textContent!=='+')marker.textContent='+';
    let toggle=document.getElementById('mvStopToggleV16262');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';toggle.id='mvStopToggleV16262';toggle.className='mv-stop-toggle-v16262';
      toggle.innerHTML='<span>+</span><b>Adicionar parada</b>';
      body.insertBefore(toggle,entry);
    }else{
      const icon=toggle.querySelector('span');if(icon&&icon.textContent!=='+')icon.textContent='+';
    }
    // Rebind on every sync. Some legacy route updates clone/recreate DOM nodes after an
    // autocomplete confirmation, which preserves markup but drops addEventListener handlers.
    toggle.onclick=e=>{
      e.preventDefault();e.stopPropagation();
      point.classList.toggle('mv-stop-open-v16262');
      const open=point.classList.contains('mv-stop-open-v16262');
      const label=toggle.querySelector('b');if(label)label.textContent=open?'Fechar':'Adicionar parada';
      if(open)setTimeout(()=>document.getElementById('preTripStopNameV127')?.focus(),40);
    };
    [...body.children].forEach(el=>{
      if(el===toggle||el===entry||el===list||el.tagName==='SMALL')return;
      const txt=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(txt.includes('adicionar parada')||txt==='+'||txt==='＋')el.remove();
    });
    const add=document.getElementById('preTripStopAddV127');
    if(add){
      if(add.textContent!=='Adicionar')add.textContent='Adicionar';
      add.onclick=e=>{e.preventDefault();e.stopPropagation();if(typeof addPreTripStopV127==='function')addPreTripStopV127()};
    }
    if(stopInput){
      stopInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(typeof addPreTripStopV127==='function')addPreTripStopV127()}};
    }
    const empty=list.querySelector('.muted.small');
    if(empty&&empty.style.display!=='none')empty.style.display='none';
    const hasRows=!!list.querySelector('.pre-stop-row-v127');
    point.classList.toggle('mv-stop-has-items-v16262',hasRows);
  }
  let scheduled=false;
  const requestSync=()=>{
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(()=>{scheduled=false;syncStops()});
  };
  const mo=new MutationObserver(requestSync);
  mo.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('change',e=>{if(e.target?.matches?.('#origem,#destino,#preTripStopNameV127'))setTimeout(syncStops,0)},true);
  [0,120,500,1200,2400].forEach(ms=>setTimeout(syncStops,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.62 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.62 compact route card */
#p-viagem #directRouteStackV127{margin:10px 0 12px!important;padding:8px 10px!important;border:1px solid #dfe5ed!important;border-radius:14px!important;background:#fff!important;box-shadow:none!important}
#p-viagem #directRouteStackV127:before{left:29px!important;top:31px!important;bottom:31px!important;width:2px!important;background:#e1e6ee!important}
#p-viagem #directRouteStackV127 .route-point-v126{grid-template-columns:44px minmax(0,1fr)!important;gap:10px!important;padding:6px 0!important;min-height:0!important}
#p-viagem #directRouteStackV127 .route-marker-v126{width:36px!important;height:36px!important;min-width:36px!important;font-size:14px!important;box-shadow:0 0 0 4px #fff!important}
#p-viagem #directRouteStackV127 .route-point-v126.stops .route-marker-v126{width:34px!important;height:34px!important;min-width:34px!important;font-size:23px!important;font-family:Arial,sans-serif!important}
#p-viagem #directRouteStackV127 .route-point-body-v126>small{margin:0 0 5px!important;font-size:12.5px!important;line-height:16px!important}
#p-viagem #directRouteStackV127 #origem,#p-viagem #directRouteStackV127 #destino{height:50px!important;min-height:50px!important;padding:0 14px!important;font-size:15px!important;border-radius:8px!important}
#p-viagem #directRouteStackV127 .route-gps-v127{min-height:38px!important;margin-top:6px!important;padding:6px 9px!important;font-size:11px!important}
#p-viagem #directRouteStackV127 .route-point-v126.stops:before,#p-viagem #directRouteStackV127 .route-point-v126.stops:after{display:none!important;content:none!important}
#p-viagem #directRouteStackV127 .mv-stop-v16262 .route-point-body-v126>small{display:none!important}
#p-viagem #directRouteStackV127 .mv-stop-v16262{cursor:default!important;min-height:0!important}
#p-viagem #directRouteStackV127 .mv-stop-toggle-v16262{display:flex!important;align-items:center!important;gap:7px!important;width:auto!important;min-height:36px!important;height:36px!important;margin:0!important;padding:0 10px!important;border:1px solid #dce3ec!important;border-radius:8px!important;background:#f8fafc!important;color:#405067!important;box-shadow:none!important;font-size:12px!important;font-weight:600!important}
#p-viagem #directRouteStackV127 .mv-stop-toggle-v16262 span{font-size:18px!important;line-height:1!important;color:#12458f!important;font-family:Arial,sans-serif!important}
#p-viagem #directRouteStackV127 .mv-stop-v16262 .pre-stop-entry-v127{display:none!important;margin-top:8px!important;grid-template-columns:1fr!important;gap:6px!important}
#p-viagem #directRouteStackV127 .mv-stop-v16262.mv-stop-open-v16262 .pre-stop-entry-v127{display:grid!important}
#p-viagem #directRouteStackV127 .mv-stop-v16262 .pre-stop-entry-v127 input{min-height:44px!important;height:44px!important;padding:0 12px!important;font-size:14px!important;border-radius:8px!important}
#p-viagem #directRouteStackV127 .mv-stop-v16262 .pre-stop-entry-v127 button{min-height:38px!important;height:38px!important;width:auto!important;justify-self:start!important;padding:0 14px!important;font-size:12px!important;border-radius:8px!important}
#p-viagem #directRouteStackV127 #preTripStopsListV127{margin:6px 0 0!important;padding:0!important;min-height:0!important}
#p-viagem #directRouteStackV127 #preTripStopsListV127>.muted.small{display:none!important}
#p-viagem #directRouteStackV127 .pre-stop-row-v127{grid-template-columns:minmax(0,1fr) 30px!important;gap:7px!important;padding:7px 8px!important;margin-top:5px!important;border:1px solid #e4e9f0!important;border-radius:8px!important;background:#fbfcfe!important}
#p-viagem #directRouteStackV127 .pre-stop-row-v127 b{font-size:12px!important;line-height:16px!important;color:#26364c!important}
#p-viagem #directRouteStackV127 .pre-stop-row-v127 small{font-size:10.5px!important;line-height:14px!important}
#p-viagem #directRouteStackV127 .pre-stop-row-v127 button{width:30px!important;height:30px!important;min-height:30px!important;border-radius:7px!important;padding:0!important;font-size:18px!important}
@media(max-width:700px){
 #p-viagem #novaViagem{padding-left:12px!important;padding-right:12px!important}
 #p-viagem #directRouteStackV127{padding:7px 9px!important;border-radius:12px!important}
 #p-viagem #directRouteStackV127:before{left:26px!important}
 #p-viagem #directRouteStackV127 .route-point-v126{grid-template-columns:40px minmax(0,1fr)!important;gap:9px!important;padding:5px 0!important}
 #p-viagem #directRouteStackV127 .route-marker-v126{width:34px!important;height:34px!important;min-width:34px!important}
 #p-viagem #directRouteStackV127 .route-point-v126.stops .route-marker-v126{width:32px!important;height:32px!important;min-width:32px!important;font-size:21px!important}
 #p-viagem #directRouteStackV127 #origem,#p-viagem #directRouteStackV127 #destino{height:48px!important;min-height:48px!important;font-size:15px!important}
}
`;
if(!s.includes('</style>'))throw new Error('v162.62 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.62: compact route card and stable stop editor installed');
