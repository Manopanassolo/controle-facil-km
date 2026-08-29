const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.26: stabilize the core active-trip flow end-to-end.
(function(){
  const AUTO_TOLL_PREFIX='[AUTO-ROTA]';
  const isHomologation=()=>/workers\\.dev$/.test(location.hostname)||/homolog/i.test(location.hostname);
  const money=n=>{try{return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n||0))}catch{return 'R$ '+Number(n||0).toFixed(2)}};

  async function tripStops(tripId){
    if(!tripId)return [];
    const r=await sb.from('km_stops').select('*').eq('trip_id',tripId).order('stop_order',{ascending:true});
    if(r.error)throw r.error;
    return (r.data||[]).filter(x=>String(x.place_name||'').trim());
  }

  async function openActiveTripMaps(){
    if(!activeTrip?.id)return msg('Nenhum deslocamento em andamento',true);
    try{
      const ss=await tripStops(activeTrip.id),origin=String(activeTrip.origin||'').trim(),destination=String(activeTrip.destination||'').trim();
      if(!destination)return msg('O deslocamento não possui destino',true);
      const qs=new URLSearchParams({api:'1',destination});
      if(origin)qs.set('origin',origin);
      if(ss.length)qs.set('waypoints',ss.map(x=>x.place_name).join('|'));
      window.open('https://www.google.com/maps/dir/?'+qs.toString(),'_blank');
    }catch(e){msg('Não foi possível abrir a rota completa no Maps: '+(e?.message||String(e)),true)}
  }
  globalThis.openActiveTripMapsV16226=openActiveTripMaps;

  async function syncAutoToll(tripId,total){
    const q=await sb.from('km_expenses').select('*').eq('trip_id',tripId).eq('expense_type','toll');
    if(q.error)throw q.error;
    const auto=(q.data||[]).find(x=>String(x.description||'').startsWith(AUTO_TOLL_PREFIX));
    total=Math.round(Number(total||0)*100)/100;
    if(total>0){
      const row={expense_type:'toll',amount:total,description:AUTO_TOLL_PREFIX+' Pedágio calculado automaticamente pelo Google Routes'};
      const r=auto?await sb.from('km_expenses').update(row).eq('id',auto.id):await sb.from('km_expenses').insert({...row,trip_id:tripId});
      if(r.error)throw r.error;
    }else if(auto){
      const r=await sb.from('km_expenses').delete().eq('id',auto.id);if(r.error)throw r.error;
    }
  }

  async function recalcActiveTrip(opts={}){
    if(!activeTrip?.id)return msg('Nenhum deslocamento em andamento',true);
    const box=document.getElementById('mvRouteCalcV16226'),status=document.getElementById('mvRouteCalcStatusV16226');
    if(status)status.textContent='Calculando rota...';
    try{
      const ss=await tripStops(activeTrip.id),origin=String(activeTrip.origin||'').trim(),destination=String(activeTrip.destination||'').trim();
      if(!origin||!destination)throw new Error('Origem e destino são necessários para calcular a rota');
      const r=await fetch('/api/routes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({origin,destination,stops:ss.map(x=>x.place_name),optimize:false})});
      const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Falha no Google Routes');
      const item=j.items?.[0];if(!item)throw new Error('Nenhuma rota retornada pelo Google');
      const km=Number(item.distanceMeters||0)/1000,toll=Number(item.tollTotalBRL||0);
      await syncAutoToll(activeTrip.id,toll);
      await refreshActive();
      const rr=await sb.from('km_trip_report').select('*').eq('organization_id',org.id);if(!rr.error)reportCache=rr.data||[];
      if(status)status.innerHTML='<b>'+km.toFixed(1)+' km</b> · '+ss.length+' parada(s) · '+(toll>0?money(toll)+' em pedágio':'sem pedágio estimado');
      if(box)box.dataset.lastOk='1';
      if(!opts.silent)msg('Rota recalculada e despesas de pedágio sincronizadas');
      renderActive();
      ensureActiveTripTools();
      return {km,toll,stops:ss};
    }catch(e){if(status)status.textContent='Falha ao calcular: '+(e?.message||String(e));if(!opts.silent)msg('Não foi possível recalcular a rota: '+(e?.message||String(e)),true);return null}
  }
  globalThis.recalcActiveTripV16226=recalcActiveTrip;

  function ensureActiveTripTools(){
    const card=document.getElementById('viagemAtiva');if(!card)return;
    let box=document.getElementById('mvRouteCalcV16226');
    if(!box){
      box=document.createElement('div');box.id='mvRouteCalcV16226';box.className='mv-route-calc-v16226';
      box.innerHTML='<div><b>Rota atual</b><div id="mvRouteCalcStatusV16226" class="muted small">Pronta para calcular com todas as paradas.</div></div><div class="mv-route-actions-v16226"><button type="button" data-mv-recalc-v16226>Recalcular rota</button><button type="button" class="sec" data-mv-maps-v16226>Abrir no Google Maps</button></div>';
      const cab=document.getElementById('ativaCab');(cab||card.firstElementChild)?.insertAdjacentElement('afterend',box);
    }
  }

  function replaceStopHandler(){
    const old=document.getElementById('btParada');if(!old||old.dataset.mv16226)return;
    const fresh=old.cloneNode(true);fresh.dataset.mv16226='1';old.replaceWith(fresh);globalThis.btParada=fresh;
    fresh.addEventListener('click',async e=>{
      e.preventDefault();e.stopPropagation();
      if(!activeTrip?.id)return msg('Nenhum deslocamento em andamento',true);
      const name=paradaNome?.value?.trim()||'';if(!name)return msg('Informe o local da parada',true);
      fresh.disabled=true;const oldText=fresh.textContent;fresh.textContent='Adicionando...';
      try{
        const current=await tripStops(activeTrip.id);
        const r=await sb.from('km_stops').insert({trip_id:activeTrip.id,stop_order:current.length+1,place_name:name,notes:paradaObs?.value?.trim()||null});
        if(r.error)throw r.error;
        paradaNome.value='';if(paradaObs)paradaObs.value='';
        await refreshActive();renderActive();ensureActiveTripTools();
        await recalcActiveTrip({silent:true});
        msg('Parada adicionada e rota atualizada');
      }catch(err){msg('Não foi possível adicionar a parada: '+(err?.message||String(err)),true)}finally{fresh.disabled=false;fresh.textContent=oldText}
    },true);
  }

  async function cleanupHomologationRouteExecution(){
    if(!isHomologation()||!org?.id||!ses?.user?.id)return;
    try{
      const q=await sb.from('km_route_executions').select('*').eq('organization_id',org.id).eq('driver_user_id',ses.user.id).eq('status','in_progress');
      if(q.error)return;
      for(const x of q.data||[]){
        await sb.from('km_route_executions').update({status:'completed',ended_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',x.id);
        if(x.route_plan_id)await sb.from('km_route_plans').update({status:'completed',updated_at:new Date().toISOString()}).eq('id',x.route_plan_id);
      }
      if(typeof routeWatchIdV141!=='undefined'&&routeWatchIdV141!=null&&navigator.geolocation){try{navigator.geolocation.clearWatch(routeWatchIdV141)}catch{}routeWatchIdV141=null}
      if(typeof activeRouteExecutionV141!=='undefined')activeRouteExecutionV141=null;
    }catch(_){}
  }

  function replaceFinalizeHandler(){
    const old=document.getElementById('btFinalizar');if(!old||old.dataset.mv16226)return;
    const fresh=old.cloneNode(true);fresh.dataset.mv16226='1';old.replaceWith(fresh);globalThis.btFinalizar=fresh;
    fresh.addEventListener('click',async e=>{
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
      if(!activeTrip?.id)return msg('Nenhum deslocamento em andamento',true);
      if(kmf?.value==='')return msg('Informe o KM final',true);
      const id=activeTrip.id,end=Number(kmf.value),start=Number(activeTrip.start_odometer||0);if(end<start)return msg('KM final não pode ser menor que o inicial',true);
      fresh.disabled=true;const oldText=fresh.textContent;fresh.textContent='Finalizando...';
      try{
        const q=await sb.from('km_trips').select('*').eq('id',id).maybeSingle();if(q.error)throw q.error;
        if(q.data?.status!=='completed'){
          const r=await sb.from('km_trips').update({end_odometer:end,ended_at:new Date().toISOString(),status:'completed',notes:obsFinal?.value?.trim()||q.data?.notes||null}).eq('id',id).select('*').maybeSingle();if(r.error)throw r.error;
        }
        await cleanupHomologationRouteExecution();
        activeTrip=null;if(kmf)kmf.value='';if(obsFinal)obsFinal.value='';
        await refreshAll();render();if(typeof show==='function')show('historico');
        msg('Deslocamento finalizado com sucesso');
      }catch(err){msg('Não foi possível finalizar o deslocamento: '+(err?.message||String(err)),true)}finally{fresh.disabled=false;fresh.textContent=oldText}
    },true);
  }

  document.addEventListener('click',e=>{
    const rec=e.target.closest?.('[data-mv-recalc-v16226]');if(rec){e.preventDefault();recalcActiveTrip();return}
    const maps=e.target.closest?.('[data-mv-maps-v16226]');if(maps){e.preventDefault();openActiveTripMaps();return}
    const legacy=e.target.closest?.('#viagemAtiva button');if(legacy&&/abrir rota.*maps/i.test(legacy.textContent||'')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();openActiveTripMaps()}
  },true);

  const renderActiveBase=renderActive;
  renderActive=function(){const r=renderActiveBase();setTimeout(()=>{ensureActiveTripTools();replaceStopHandler();replaceFinalizeHandler()},0);return r};
  const renderBase=render;
  render=function(){const r=renderBase();setTimeout(()=>{ensureActiveTripTools();replaceStopHandler();replaceFinalizeHandler()},0);return r};
  setTimeout(()=>{ensureActiveTripTools();replaceStopHandler();replaceFinalizeHandler()},1000);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.26 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.26 stable active-trip controls */
.mv-route-calc-v16226{margin:12px 0;padding:12px 14px;border:1px solid #dbe3ef;border-radius:14px;background:#f8faff;display:grid;gap:10px}.mv-route-actions-v16226{display:flex;gap:8px}.mv-route-actions-v16226 button{flex:1}@media(max-width:700px){.mv-route-actions-v16226{flex-direction:column}}
`;
if(!s.includes('</style>'))throw new Error('v162.26 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.26: active trip stops, Maps waypoints, toll expense sync and finalization stabilized');
