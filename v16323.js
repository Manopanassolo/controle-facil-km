const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.52: staged active-trip UX, completion summary, schedule->agenda flow and per-leg route selection.
(function(){
  const byId=id=>document.getElementById(id);
  const esc=v=>String(v||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const clean=arr=>(arr||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
  const money=v=>'R$ '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const km=v=>(Number(v||0)/1000).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+' km';
  const sec=v=>Number(String(v||'0').replace('s',''))||0;
  const dur=v=>{const m=Math.max(0,Math.round(sec(v)/60)),h=Math.floor(m/60);return h?(h+'h '+String(m%60).padStart(2,'0')+'min'):(m+' min')};

  // ---------- Active trip: one task at a time ----------
  let activeStage='route';
  const stageDefs=[['route','Percurso'],['stops','Paradas'],['expenses','Despesas'],['finish','Finalizar']];
  function elementBucket(el){
    if(!el)return null;
    if(el.closest?.('#routePlanResultsV131,#mvRouteCalcV16226,#mvActiveRouteSummaryV16283'))return'route';
    if(el.matches?.('#paradaNome,#paradaObs,#btParada,#listaParadas')||el.querySelector?.('#paradaNome,#btParada,#listaParadas'))return'stops';
    if(el.matches?.('#tipoDesp,#valorDesp,#descDesp,#expenseExtraV135,#btDesp,#despResumo,#listaDespesas,#despComprovante,#listaComprovantes')||el.querySelector?.('#tipoDesp,#valorDesp,#btDesp,#despResumo,#listaDespesas'))return'expenses';
    if(el.matches?.('#kmf,#obsFinal,#btFinalizar,#finishHint')||el.querySelector?.('#kmf,#btFinalizar'))return'finish';
    return null;
  }
  function ensureActiveStages(){
    const card=byId('viagemAtiva');if(!card||card.classList.contains('hide'))return;
    card.classList.add('mv-active-staged16352');
    let nav=byId('mvTripStageNav16352');
    if(!nav){nav=document.createElement('div');nav.id='mvTripStageNav16352';nav.className='mv-trip-stage-nav16352';nav.innerHTML=stageDefs.map(([k,l],i)=>'<button type="button" data-trip-stage16352="'+k+'"><span>'+String(i+1)+'</span>'+l+'</button>').join('');const anchor=byId('mvTripState16350')||byId('ativaCab');(anchor||card.firstElementChild)?.insertAdjacentElement('afterend',nav)}
    // Mark legacy detail blocks instead of presenting everything simultaneously.
    [...card.children].forEach(el=>{if(el===nav||el.id==='ativaCab'||el.id==='mvTripState16350'||el.id==='activeJourneyStatus'||el.id==='mvActiveRouteSummaryV16283')return;const b=elementBucket(el);if(b)el.dataset.tripStage16352=b});
    card.querySelectorAll('.mv-fold84').forEach(el=>{const b=elementBucket(el);if(b)el.dataset.tripStage16352=b});
    applyStage(activeStage);
  }
  function applyStage(stage){
    activeStage=stageDefs.some(x=>x[0]===stage)?stage:'route';
    document.body.dataset.mvTripStage=activeStage;
    const card=byId('viagemAtiva');if(!card)return;
    card.querySelectorAll('[data-trip-stage16352]').forEach(el=>el.classList.toggle('active',el.dataset.tripStage16352===activeStage));
    card.querySelectorAll('[data-trip-stage16352]').forEach(el=>{if(el.id==='mvTripStageNav16352')return});
    card.querySelectorAll('[data-trip-stage16352]').forEach(()=>{});
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    [...card.querySelectorAll('[data-trip-stage16352]')];
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    card.querySelectorAll('[data-trip-stage16352]');
    // Actual stage blocks are marked with data-trip-stage16352 on the block itself.
    card.querySelectorAll(':scope > [data-trip-stage16352], .mv-fold84[data-trip-stage16352]').forEach(el=>el.hidden=el.dataset.tripStage16352!==activeStage);
    const focus=card.querySelector(':scope > [data-trip-stage16352="'+activeStage+'"], .mv-fold84[data-trip-stage16352="'+activeStage+'"]');if(focus)focus.scrollIntoView({behavior:'smooth',block:'start'});
  }
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-trip-stage16352]');if(!b||b.closest('#mvTripStageNav16352')!==byId('mvTripStageNav16352'))return;e.preventDefault();applyStage(b.dataset.tripStage16352)},true);

  // ---------- Completion summary ----------
  function completionData(){try{return JSON.parse(sessionStorage.getItem('mv_trip_completed_16350')||'null')}catch{return null}}
  function ensureCompletionSummary(){
    const p=byId('p-historico'),data=completionData();if(!p||!data)return;
    let box=byId('mvCompletedSummary16352');if(!box){box=document.createElement('section');box.id='mvCompletedSummary16352';box.className='mv-completed-summary16352';p.insertAdjacentElement('afterbegin',box)}
    box.innerHTML='<div><span class="ok">✓</span><div><small>PERCURSO FINALIZADO</small><h2>Finalização confirmada</h2><p>'+esc(data.detail||'O percurso foi salvo no Histórico.')+'</p></div></div><button type="button" data-dismiss-completed16352>Ver lista de viagens</button>';
    box.querySelector('[data-dismiss-completed16352]').onclick=()=>{box.remove();sessionStorage.removeItem('mv_trip_completed_16350')};
  }
  // Ensure finish always leaves the active screen and opens completed trips.
  const finishWatch=new MutationObserver(()=>{if(document.body.dataset.mvTripState==='completed'){setTimeout(()=>{try{globalThis.mvNavigationV16282?.navigate?.('historico')}catch(_){try{show('historico')}catch(__){}}setTimeout(ensureCompletionSummary,80)},120)}});
  if(document.body)finishWatch.observe(document.body,{attributes:true,attributeFilter:['data-mv-trip-state']});

  // ---------- Schedule directly, then open internal Agenda ----------
  function googleCalendarUrl(x){const start=new Date(x.scheduled_at),end=new Date(start.getTime()+60*60*1000),fmt=d=>d.toISOString().replace(/[-:]/g,'').replace(/\\.\\d{3}Z$/,'Z'),title=encodeURIComponent(x.purpose||'Percurso Movvant'),details=encodeURIComponent((x.origin?x.origin+' → ':'')+(x.destination||'')+(x.notes?'\\n'+x.notes:'')),loc=encodeURIComponent(x.destination||'');return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+title+'&dates='+fmt(start)+'/'+fmt(end)+'&details='+details+'&location='+loc}
  async function saveSchedule16352(){
    const origin=(byId('origem')?.value||'').trim(),destination=(byId('destino')?.value||'').trim(),date=byId('dataViagem')?.value||new Date().toISOString().slice(0,10),purpose=(byId('motivo')?.value||'').trim(),notes=(byId('obs')?.value||'').trim();
    if(!destination)return msg('Informe o destino antes de agendar.',true);
    const when=new Date(date+'T'+(byId('agHora')?.value||'08:00')+':00');if(Number.isNaN(+when))return msg('Data do agendamento inválida',true);
    const route=globalThis.mvSelectedRouteV16272,stops=clean(globalThis.mvChosenStopOrderV16270?.length?globalThis.mvChosenStopOrderV16270:(globalThis.preTripStopsV127||[]));
    const payload={organization_id:org.id,user_id:ses.user.id,vehicle_id:byId('veiculo')?.value||null,location_id:byId('local')?.value||null,scheduled_at:when.toISOString(),origin:origin||null,destination,purpose:purpose||null,recurrence:'none',status:'scheduled',created_by:ses.user.id,notes:notes||null,usage_type:byId('tipoUso')?.value==='personal'?'personal':'work',planned_stops:stops.map((place_name,i)=>({place_name,stop_order:i+1})),planned_expenses:[],odometer_mode:'manual',planned_distance_km:route?.item?.distanceMeters?Number(route.item.distanceMeters)/1000:null,planned_start_odometer:byId('kmi')?.value!==''?Number(byId('kmi').value):null,planned_end_odometer:null,google_calendar_sync_status:'not_requested'};
    const r=await sb.from('km_scheduled_trips').insert(payload).select('*').single();if(r.error)throw r.error;
    try{sessionStorage.setItem('mv_last_scheduled_16352',JSON.stringify({id:r.data.id,google:googleCalendarUrl(r.data)}))}catch(_){}
    if(typeof v138LoadAgenda==='function')await v138LoadAgenda();else if(typeof loadAgenda==='function')await loadAgenda();
    try{globalThis.mvNavigationV16282?.navigate?.('agenda')}catch(_){try{show('agenda')}catch(__){}}
    msg('Percurso agendado e disponível na Agenda');
    return r.data;
  }
  function bindSchedule(){
    const old=byId('mvSaveScheduledTripV16284');if(!old||old.dataset.mvSchedule16352)return;const b=old.cloneNode(true);b.dataset.mvSchedule16352='1';b.innerHTML='📅 Agendar percurso';old.replaceWith(b);
    b.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();b.disabled=true;const t=b.innerHTML;b.textContent='Agendando…';try{await saveSchedule16352()}catch(err){msg('Não foi possível agendar: '+(err?.message||String(err)),true)}finally{b.disabled=false;b.innerHTML=t}},true);
  }
  function agendaGoogleAction(){
    const p=byId('p-agenda');if(!p)return;let data=null;try{data=JSON.parse(sessionStorage.getItem('mv_last_scheduled_16352')||'null')}catch(_){}if(!data?.google)return;
    let a=byId('mvGoogleAgenda16352');if(!a){a=document.createElement('button');a.id='mvGoogleAgenda16352';a.type='button';a.className='sec mv-google-agenda16352';a.textContent='Abrir também no Google Agenda';a.onclick=()=>window.open(data.google,'_blank');const target=p.querySelector('.v138-card,.c');target?.insertAdjacentElement('afterbegin',a)}
  }

  // ---------- Per-leg route alternatives; tap the line itself ----------
  let legPlan=null,legLayer=null,currentLeg=0;
  function decode(str){if(!str)return[];let i=0,lat=0,lng=0,out=[];while(i<str.length){let b,shift=0,result=0;do{b=str.charCodeAt(i++)-63;result|=(b&31)<<shift;shift+=5}while(b>=32&&i<=str.length);lat+=result&1?~(result>>1):(result>>1);shift=0;result=0;do{b=str.charCodeAt(i++)-63;result|=(b&31)<<shift;shift+=5}while(b>=32&&i<=str.length);lng+=result&1?~(result>>1):(result>>1);out.push([lat/1e5,lng/1e5])}return out}
  async function fetchLeg(a,b){const r=await fetch('/api/routes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({origin:a,destination:b,stops:[],optimize:false})}),j=await r.json().catch(()=>({}));if(!r.ok||!j.items?.length)throw new Error(j.error||'Não foi possível calcular o trecho');return j.items.slice(0,3)}
  async function buildLegPlan(){
    const origin=(byId('origem')?.value||'').trim(),destination=(byId('destino')?.value||'').trim(),stops=clean(globalThis.preTripStopsV127||[]);if(!origin||!destination)return null;
    const points=[origin,...stops,destination],legs=[];for(let i=0;i<points.length-1;i++)legs.push({from:points[i],to:points[i+1],options:await fetchLeg(points[i],points[i+1]),selected:0});
    legPlan={points,legs};currentLeg=0;globalThis.mvLegRoutePlanV16352=legPlan;renderLegPicker();return legPlan;
  }
  function compositeSelection(){if(!legPlan)return null;const chosen=legPlan.legs.map(l=>l.options[l.selected]).filter(Boolean);return {legs:legPlan.legs.map((l,i)=>({from:l.from,to:l.to,selected:l.selected,item:chosen[i]})),distanceMeters:chosen.reduce((n,x)=>n+Number(x.distanceMeters||0),0),duration:String(chosen.reduce((n,x)=>n+sec(x.duration),0))+'s',tollTotalBRL:chosen.reduce((n,x)=>n+Number(x.tollTotalBRL||0),0)} }
  function selectLegOption(legIndex,optIndex){if(!legPlan?.legs?.[legIndex]?.options?.[optIndex])return;legPlan.legs[legIndex].selected=optIndex;currentLeg=legIndex;globalThis.mvSelectedLegRouteV16352=compositeSelection();drawLegAlternatives();renderLegPicker()}
  function drawLegAlternatives(){
    const map=globalThis.mvRouteMapV16278,L=globalThis.L;if(!map||!L||!legPlan)return;try{if(globalThis.mvRouteLayersV16278)globalThis.mvRouteLayersV16278.clearLayers()}catch(_){}if(!legLayer)legLayer=L.layerGroup().addTo(map);legLayer.clearLayers();const all=[];
    legPlan.legs.forEach((leg,li)=>{if(li<currentLeg){const pts=decode(leg.options[leg.selected]?.polyline);all.push(...pts);if(pts.length)L.polyline(pts,{weight:7,opacity:.95,color:'#1767cf',lineCap:'round'}).addTo(legLayer);return}if(li>currentLeg)return;leg.options.forEach((o,oi)=>{const pts=decode(o.polyline);all.push(...pts);if(!pts.length)return;const selected=oi===leg.selected,line=L.polyline(pts,{weight:selected?8:6,opacity:selected?.98:.55,color:selected?'#1767cf':'#7f8b9d',lineCap:'round',className:'mv-leg-route16352 '+(selected?'selected':'alternative')}).addTo(legLayer);line.on('click',()=>selectLegOption(li,oi));line.bindTooltip((selected?'Selecionada · ':'Opção '+(oi+1)+' · ')+km(o.distanceMeters)+' · '+dur(o.duration),{sticky:true})})});
    if(all.length&&currentLeg===0){const b=L.latLngBounds(all);if(b.isValid())map.fitBounds(b,{padding:[20,20],animate:false})}
  }
  function renderLegPicker(){
    const wrap=byId('routeMapWrapV133');if(!wrap||!legPlan)return;let box=byId('mvLegPicker16352');if(!box){box=document.createElement('div');box.id='mvLegPicker16352';box.className='mv-leg-picker16352';wrap.insertAdjacentElement('beforebegin',box)}const leg=legPlan.legs[currentLeg],done=currentLeg===legPlan.legs.length-1;
    box.innerHTML='<div class="mv-leg-head16352"><div><small>TRECHO '+(currentLeg+1)+' DE '+legPlan.legs.length+'</small><b>'+esc(leg.from)+' → '+esc(leg.to)+'</b></div><span>Toque no traçado do mapa ou escolha abaixo</span></div><div class="mv-leg-options16352">'+leg.options.map((o,i)=>'<button type="button" class="'+(i===leg.selected?'selected':'')+'" data-leg-option16352="'+i+'"><b>Opção '+(i+1)+'</b><span>'+km(o.distanceMeters)+' · '+dur(o.duration)+(Number(o.tollTotalBRL)>0?' · '+money(o.tollTotalBRL):'')+'</span></button>').join('')+'</div><div class="mv-leg-actions16352"><button type="button" class="sec" data-leg-prev16352 '+(currentLeg===0?'disabled':'')+'>← Trecho anterior</button><button type="button" data-leg-next16352>'+(done?'✓ Confirmar percurso':'Próximo trecho →')+'</button></div>';
    box.querySelectorAll('[data-leg-option16352]').forEach(b=>b.onclick=()=>selectLegOption(currentLeg,Number(b.dataset.legOption16352)));box.querySelector('[data-leg-prev16352]').onclick=()=>{if(currentLeg>0){currentLeg--;renderLegPicker();drawLegAlternatives()}};box.querySelector('[data-leg-next16352]').onclick=()=>{if(!done){currentLeg++;renderLegPicker();drawLegAlternatives()}else{const c=compositeSelection();globalThis.mvSelectedLegRouteV16352=c;msg('Percurso por trechos confirmado · '+km(c.distanceMeters)+' · '+(c.tollTotalBRL?money(c.tollTotalBRL)+' em pedágios':'sem pedágio estimado'))}};drawLegAlternatives();
  }
  function installLegPlanner(){
    const results=byId('routePlanResultsV131');if(!results||byId('mvLegPlannerBtn16352'))return;const map=byId('routeMapWrapV133');if(!map)return;const b=document.createElement('button');b.id='mvLegPlannerBtn16352';b.type='button';b.className='sec mv-leg-start16352';b.textContent='Escolher rota por trecho no mapa';map.insertAdjacentElement('beforebegin',b);b.onclick=async()=>{b.disabled=true;const t=b.textContent;b.textContent='Calculando alternativas por trecho…';try{await buildLegPlan();b.style.display='none'}catch(e){msg(e.message||'Falha ao calcular trechos',true)}finally{b.disabled=false;b.textContent=t}};
  }

  function sync(){ensureActiveStages();bindSchedule();agendaGoogleAction();ensureCompletionSummary();installLegPlanner()}
  [0,100,300,700,1400,2600].forEach(ms=>setTimeout(sync,ms));
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-p],[data-p-jump],[data-mv-dock],#mvPlanRouteV16272,#mvPlanRouteV16271'))setTimeout(sync,120)},true);
  addEventListener('pageshow',()=>setTimeout(sync,60),true);
  document.documentElement.dataset.mvTripFlow='163.52';
  globalThis.mvTripFlowV16352={sync,applyStage,buildLegPlan,selectLegOption,compositeSelection};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.52 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.52 staged trip flow */
.mv-trip-stage-nav16352{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:10px 0 14px;padding:6px;border:1px solid #dfe6ef;border-radius:12px;background:#f7f9fc}.mv-trip-stage-nav16352 button{display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;min-height:42px!important;padding:7px 8px!important;background:transparent!important;color:#59677a!important;border:0!important;border-radius:8px!important;font-size:11px!important}.mv-trip-stage-nav16352 button span{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#e8edf4;color:#66758a;font-size:10px;font-weight:800}.mv-trip-stage-nav16352 button.active{background:#1767cf!important;color:#fff!important}.mv-trip-stage-nav16352 button.active span{background:#fff;color:#1767cf}.mv-active-staged16352 [data-trip-stage16352][hidden]{display:none!important}
.mv-completed-summary16352{display:flex;justify-content:space-between;align-items:center;gap:16px;margin:0 0 14px;padding:16px 18px;border:1px solid #bfe0cb;border-radius:12px;background:#f1fbf4}.mv-completed-summary16352>div{display:flex;align-items:center;gap:12px}.mv-completed-summary16352 .ok{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:#1e9e55;color:#fff;font-size:22px;font-weight:900}.mv-completed-summary16352 small{font-size:9px;font-weight:900;letter-spacing:.08em;color:#33815a}.mv-completed-summary16352 h2{font-size:17px!important;margin:2px 0!important;color:#194d34!important}.mv-completed-summary16352 p{font-size:11px;color:#607568;margin:0}.mv-completed-summary16352 button{width:auto!important;white-space:nowrap}.mv-google-agenda16352{width:auto!important;margin:0 0 10px!important}
.mv-leg-start16352{width:100%!important;min-height:44px!important;margin:8px 0!important;border:1px solid #1767cf!important;color:#1767cf!important;background:#fff!important;font-weight:800!important}.mv-leg-picker16352{margin:10px 0;padding:12px;border:1px solid #dbe4ef;border-radius:12px;background:#f8fbff}.mv-leg-head16352{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.mv-leg-head16352 small{display:block;font-size:9px;font-weight:900;color:#1767cf;letter-spacing:.06em}.mv-leg-head16352 b{display:block;font-size:12px;color:#25374f;margin-top:3px}.mv-leg-head16352>span{font-size:9.5px;color:#778397;text-align:right}.mv-leg-options16352{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:10px}.mv-leg-options16352 button{display:grid!important;text-align:left!important;gap:2px!important;min-height:52px!important;padding:8px 9px!important;background:#fff!important;color:#32445d!important;border:1px solid #dbe3ed!important;border-radius:8px!important}.mv-leg-options16352 button.selected{background:#1767cf!important;color:#fff!important;border-color:#1767cf!important}.mv-leg-options16352 button span{font-size:9.5px;opacity:.85}.mv-leg-actions16352{display:flex;gap:7px;margin-top:9px}.mv-leg-actions16352 button{flex:1!important;min-height:40px!important}.leaflet-interactive.mv-leg-route16352{cursor:pointer!important}
@media(max-width:700px){.mv-trip-stage-nav16352{grid-template-columns:repeat(2,minmax(0,1fr))}.mv-trip-stage-nav16352 button{justify-content:flex-start!important}.mv-completed-summary16352{display:block}.mv-completed-summary16352 button{width:100%!important;margin-top:12px!important}.mv-leg-head16352{display:block}.mv-leg-head16352>span{display:block;text-align:left;margin-top:5px}.mv-leg-options16352{grid-template-columns:1fr}.mv-leg-actions16352{flex-direction:column}}
`;
if(!s.includes('</style>'))throw new Error('v163.52 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.52 staged trip, schedule agenda handoff and per-leg selectable routes installed');
