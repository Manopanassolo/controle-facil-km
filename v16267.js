const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.67: use Google's own embedded route map and isolate trip start from legacy duplicate handlers.
(function(){
  const DEMO_VEHICLE='__mv_demo_vehicle__',DEMO_LOCATION='__mv_demo_location__';
  const byId=id=>document.getElementById(id);
  function field(name,id){try{const v=globalThis[name];if(v&&v.nodeType===1)return v}catch(_){}return byId(id)}
  function googleRouteUrl(){
    const origin=(byId('origem')?.value||'').trim();
    const destination=(byId('destino')?.value||'').trim();
    const stops=(globalThis.preTripStopsV127||[]).map(x=>(x?.place_name||'').trim()).filter(Boolean);
    const round=!!byId('routeRoundTripV132')?.checked;
    const legs=[...stops,destination].filter(Boolean);
    if(round&&origin)legs.push(origin);
    const daddr=legs.join(' to: ');
    return 'https://maps.google.com/maps?output=embed&hl=pt-BR&dirflg=d&saddr='+encodeURIComponent(origin)+'&daddr='+encodeURIComponent(daddr);
  }
  async function googleMap(item,index=0){
    const box=byId('routeEmbeddedMapV133'),statusEl=byId('routeMapStatusV133');if(!box)return;
    try{if(globalThis.routeMapV133){routeMapV133.remove?.();routeMapV133=null;routeLayerV133=null}}catch(_){}
    box.innerHTML='';
    const frame=document.createElement('iframe');frame.id='mvGoogleRouteFrameV16267';frame.title='Rota no Google Maps';frame.loading='eager';frame.referrerPolicy='no-referrer-when-downgrade';frame.allowFullscreen=true;frame.src=googleRouteUrl();frame.setAttribute('allow','geolocation');box.appendChild(frame);
    if(statusEl){const km=typeof fmtKmV131==='function'?fmtKmV131(item?.distanceMeters):'';const dur=typeof fmtDurV131==='function'?fmtDurV131(item?.duration):'';statusEl.textContent='Google Maps · '+[km,dur].filter(Boolean).join(' · ')}
  }
  try{globalThis.renderEmbeddedMapV133=googleMap}catch(_){}
  function rebindMap(){
    try{if(typeof renderEmbeddedMapV133==='function'&&renderEmbeddedMapV133!==googleMap)renderEmbeddedMapV133=googleMap}catch(_){}
    const box=byId('routeEmbeddedMapV133');if(box&&!box.querySelector('#mvGoogleRouteFrameV16267')&&Array.isArray(globalThis.routeItemsV133)&&routeItemsV133[0])googleMap(routeItemsV133[0],0);
  }
  async function startTrip(btn){
    const destination=field('destino','destino'),startKm=field('kmi','kmi'),vehicle=field('veiculo','veiculo'),location=field('local','local');
    const date=field('dataViagem','dataViagem'),usage=field('tipoUso','tipoUso'),origin=field('origem','origem'),purpose=field('motivo','motivo'),notes=field('obs','obs');
    const d=(destination?.value||'').trim();if(!d)return msg('Informe o destino',true);
    if(startKm?.value==null||startKm.value==='')return msg('Informe o KM inicial',true);
    if(!globalThis.sb||!globalThis.org?.id||!globalThis.ses?.user?.id)return msg('Sessão ou empresa não carregada. Atualize a página e tente novamente.',true);
    btn.disabled=true;const oldText=btn.textContent;btn.textContent='Iniciando...';
    try{
      const existing=await sb.from('km_trips').select('*').eq('organization_id',org.id).eq('user_id',ses.user.id).eq('status','in_progress').order('started_at',{ascending:false}).limit(1);
      if(existing.error)throw existing.error;
      if(existing.data?.length){globalThis.activeTrip=existing.data[0];await refreshAll?.();render?.();show?.('viagem');return msg('Existe um deslocamento realmente em andamento. Continue ou finalize o atual.',true)}
      globalThis.activeTrip=null;
      const payload={organization_id:org.id,user_id:ses.user.id,vehicle_id:vehicle?.value===DEMO_VEHICLE?null:(vehicle?.value||null),location_id:location?.value===DEMO_LOCATION?null:(location?.value||null),trip_date:date?.value||new Date().toISOString().slice(0,10),started_at:new Date().toISOString(),origin:(origin?.value||'').trim()||null,destination:d,start_odometer:Number(startKm.value),usage_type:usage?.value==='personal'?'personal':'work',purpose:(purpose?.value||'').trim()||null,notes:(notes?.value||'').trim()||null,status:'in_progress'};
      const r=await sb.from('km_trips').insert(payload).select('*').single();if(r.error)throw r.error;globalThis.activeTrip=r.data;
      const planned=Array.isArray(globalThis.preTripStopsV127)?[...globalThis.preTripStopsV127]:[];
      if(planned.length){const sr=await sb.from('km_stops').insert(planned.map((x,i)=>({trip_id:r.data.id,stop_order:i+1,place_name:x.place_name,notes:x.notes||null})));if(sr.error)throw sr.error;globalThis.preTripStopsV127=[]}
      try{localStorage.removeItem('km_trip_draft')}catch(_){}
      await refreshAll?.();render?.();show?.('viagem');
      setTimeout(()=>{const active=byId('viagemAtiva');active?.scrollIntoView({behavior:'smooth',block:'start'})},80);
      msg('Deslocamento iniciado');
    }catch(err){msg('Não foi possível iniciar o deslocamento: '+(err?.message||String(err)),true)}finally{btn.disabled=false;btn.textContent=oldText}
  }
  function installStart(){
    const old=byId('btViagem');if(!old)return;
    old.style.setProperty('display','none','important');old.setAttribute('aria-hidden','true');old.tabIndex=-1;
    let btn=byId('mvStartTripV16267');
    if(!btn){btn=document.createElement('button');btn.id='mvStartTripV16267';btn.type='button';btn.textContent='Iniciar deslocamento';btn.className=old.className;old.insertAdjacentElement('afterend',btn);btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();startTrip(btn)},true)}
  }
  function sync(){installStart();rebindMap()}
  const mo=new MutationObserver(()=>requestAnimationFrame(sync));try{mo.observe(document.documentElement,{subtree:true,childList:true})}catch(_){}
  [0,250,800,1600,3000].forEach(ms=>setTimeout(sync,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.67 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.67 Google Maps route + isolated start button */
#routeEmbeddedMapV133{height:360px!important;min-height:360px!important;background:#eef2f7!important;overflow:hidden!important}
#mvGoogleRouteFrameV16267{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#eef2f7!important}
#mvStartTripV16267{width:100%!important;margin-top:10px!important;min-height:46px!important;background:#1767cf!important;color:#fff!important;border:0!important;border-radius:10px!important;font-weight:800!important}
@media(max-width:700px){#routeEmbeddedMapV133{height:340px!important;min-height:340px!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.67 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.67: Google Maps route embed and isolated trip start installed');
