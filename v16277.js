const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.83: carry the selected plan into the active trip and simplify the execution screen.
(function(){
  const PENDING='mv_pending_route_plan_v16283';
  const TRIP_PREFIX='mv_trip_route_plan_v16283_';
  const AUTO_TOLL_PREFIX='[AUTO-ROTA]';
  const byId=id=>document.getElementById(id);
  const money=n=>{try{return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n||0))}catch{return 'R$ '+Number(n||0).toFixed(2)}};
  const one=n=>Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1});
  function selectedPlan(){
    const o=globalThis.mvSelectedRouteV16272;
    const item=o?.item||null;
    const distanceMeters=Number(item?.distanceMeters||0);
    const toll=Number(item?.tollTotalBRL||0);
    const stops=(o?.stops||globalThis.mvChosenStopOrderV16270||globalThis.preTripStopsV127||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
    const origin=String(o?.origin||byId('origem')?.value||'').trim();
    const destination=String(o?.destination||byId('destino')?.value||'').trim();
    const round=!!o?.round;
    const sameWayReturn=!!o?.sameWayReturn;
    if(!distanceMeters&&!toll&&!origin&&!destination)return null;
    return {distanceMeters,toll,stops,origin,destination,round,sameWayReturn,routeVariant:Number(o?.routeVariant||0),capturedAt:new Date().toISOString()};
  }
  function savePending(){
    const p=selectedPlan();if(!p)return;
    try{localStorage.setItem(PENDING,JSON.stringify(p))}catch(_){}
  }
  function readPending(){try{return JSON.parse(localStorage.getItem(PENDING)||'null')}catch{return null}}
  function tripPlan(id){try{return JSON.parse(localStorage.getItem(TRIP_PREFIX+id)||'null')}catch{return null}}
  function saveTripPlan(id,p){if(!id||!p)return;try{localStorage.setItem(TRIP_PREFIX+id,JSON.stringify(p));localStorage.removeItem(PENDING)}catch(_){} }
  async function syncToll(tripId,total){
    if(!tripId||typeof sb==='undefined')return;
    total=Math.round(Number(total||0)*100)/100;
    const q=await sb.from('km_expenses').select('*').eq('trip_id',tripId).eq('expense_type','toll');if(q.error)throw q.error;
    const auto=(q.data||[]).find(x=>String(x.description||'').startsWith(AUTO_TOLL_PREFIX));
    if(total>0){const row={expense_type:'toll',amount:total,description:AUTO_TOLL_PREFIX+' Pedágio da rota selecionada'};const r=auto?await sb.from('km_expenses').update(row).eq('id',auto.id):await sb.from('km_expenses').insert({...row,trip_id:tripId});if(r.error)throw r.error}
  }
  function planForActive(){if(typeof activeTrip==='undefined'||!activeTrip?.id)return null;let p=tripPlan(activeTrip.id);if(!p){p=readPending();if(p)saveTripPlan(activeTrip.id,p)}return p}
  function ensurePlanApplied(){
    if(typeof activeTrip==='undefined'||!activeTrip?.id)return;
    const p=planForActive();if(!p)return;
    const km=Number(p.distanceMeters||0)/1000;
    const start=Number(activeTrip.start_odometer||0);
    if(km>0&&byId('kmf')&&!byId('kmf').value)byId('kmf').value=(start+km).toFixed(1);
    if(Number(p.toll||0)>0&&!p.tollSynced){syncToll(activeTrip.id,p.toll).then(()=>{p.tollSynced=true;saveTripPlan(activeTrip.id,p);try{refreshActive().then(()=>renderActive())}catch(_){}}).catch(e=>console.warn('v162.83 toll sync',e))}
  }
  function routeText(p){const pts=[p?.origin,...(p?.stops||[]),p?.destination].filter(Boolean);if(p?.round&&p?.origin)pts.push(p.origin);return pts.join(' → ')}
  function enhanceActive(){
    const card=byId('viagemAtiva');if(!card||card.classList.contains('hide')||typeof activeTrip==='undefined'||!activeTrip?.id)return;
    const p=planForActive();if(!p)return;
    ensurePlanApplied();
    const km=Number(p.distanceMeters||0)/1000,start=Number(activeTrip.start_odometer||0),expected=start+km;
    const h2=card.querySelector('h2');if(h2)h2.textContent='Percurso em andamento';
    let box=byId('mvActiveRouteSummaryV16283');if(!box){box=document.createElement('div');box.id='mvActiveRouteSummaryV16283';box.className='mv-active-route-summary-v16283';const cab=byId('ativaCab');(cab||h2)?.insertAdjacentElement('afterend',box)}
    box.innerHTML='<div class="mv-route-title83"><div><span class="mv-live83">● EM PERCURSO</span><b>Rota selecionada</b><small>'+routeText(p).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</small></div><button type="button" data-mv-openmaps83>Abrir no Maps</button></div><div class="mv-metrics83"><div><span>Distância da rota</span><strong>'+one(km)+' km</strong></div><div><span>Pedágio previsto</span><strong>'+(Number(p.toll||0)>0?money(p.toll):'R$ 0,00')+'</strong></div><div><span>KM inicial</span><strong>'+one(start)+'</strong></div><div><span>KM final previsto</span><strong>'+one(expected)+'</strong></div></div><div class="mv-note83">O KM final foi preenchido automaticamente pela distância exata da rota escolhida. Ajuste somente se o hodômetro real terminar diferente.</div>';
    const old=byId('mvRouteCalcV16226');if(old)old.style.display='none';
    const heads=[...card.querySelectorAll('h3')];for(const x of heads){if(/Adicionar parada/i.test(x.textContent))x.textContent='Paradas durante o percurso';if(/Adicionar despesa/i.test(x.textContent))x.textContent='Despesas adicionais';if(/Comprovante/i.test(x.textContent))x.textContent='Comprovantes';if(/Finalizar viagem/i.test(x.textContent))x.textContent='Encerrar percurso'}
    const final=byId('btFinalizar');if(final)final.textContent='Finalizar percurso';
    const kmf=byId('kmf');if(kmf){kmf.placeholder='KM final do hodômetro';kmf.classList.add('mv-kmf83')}
  }
  document.addEventListener('click',e=>{if(e.target?.closest?.('#mvStartTripV16267,#btViagem'))savePending();const maps=e.target?.closest?.('[data-mv-openmaps83]');if(maps){e.preventDefault();if(typeof globalThis.openActiveTripMapsV16226==='function')globalThis.openActiveTripMapsV16226()}},true);
  const ra=typeof renderActive==='function'?renderActive:null;if(ra){renderActive=function(){const r=ra();setTimeout(enhanceActive,0);return r}}
  const rr=typeof render==='function'?render:null;if(rr){render=function(){const r=rr();setTimeout(enhanceActive,0);return r}}
  [200,700,1400,2600].forEach(ms=>setTimeout(()=>{ensurePlanApplied();enhanceActive()},ms));
  globalThis.mvActiveRouteV16283={selectedPlan,enhance:enhanceActive,apply:ensurePlanApplied};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.83 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.83 focused active route screen */
#viagemAtiva{border:0!important;background:#f4f7fb!important;padding:12px!important}#viagemAtiva>h2{margin:2px 0 10px!important;color:#102a4d!important}.mv-active-route-summary-v16283{background:#fff;border:1px solid #d9e3f0;border-radius:16px;padding:14px;margin:8px 0 14px;box-shadow:0 8px 24px #0b2d5d10}.mv-route-title83{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}.mv-route-title83>div{min-width:0;display:grid;gap:4px}.mv-route-title83 b{font-size:17px;color:#102a4d}.mv-route-title83 small{color:#66758a;line-height:1.35}.mv-route-title83 button{width:auto!important;min-width:110px!important;padding:10px 12px!important;background:#1767cf!important}.mv-live83{font-size:11px;font-weight:900;letter-spacing:.05em;color:#16834b}.mv-metrics83{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:12px}.mv-metrics83>div{background:#f6f9fd;border:1px solid #e3eaf3;border-radius:12px;padding:10px}.mv-metrics83 span{display:block;color:#6e7b8f;font-size:11px}.mv-metrics83 strong{display:block;color:#102a4d;font-size:18px;margin-top:3px}.mv-note83{margin-top:10px;background:#eef7ff;color:#31506f;border-radius:10px;padding:9px 10px;font-size:12px;line-height:1.4}#viagemAtiva h3{color:#14365f;margin-top:16px}#viagemAtiva .sep{border-color:#dce5f0}.mv-kmf83{font-weight:800!important;border:2px solid #1767cf!important;background:#fff!important}#btFinalizar{background:#1767cf!important;min-height:48px!important;font-size:16px!important}
@media(max-width:700px){.mv-route-title83{display:grid}.mv-route-title83 button{width:100%!important}.mv-metrics83{grid-template-columns:1fr 1fr}.mv-metrics83 strong{font-size:16px}}
`;
if(!s.includes('</style>'))throw new Error('v162.83 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.83: planned distance/toll carried into active trip and execution screen simplified');
