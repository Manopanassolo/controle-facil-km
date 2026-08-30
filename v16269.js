const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.69: use the real lexical preTripStopsV127 store (not globalThis) so Google map and sequence planner include every stop.
(function(){
  const byId=id=>document.getElementById(id);
  const clean=arr=>(arr||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
  function realStops(){try{return typeof preTripStopsV127!=='undefined'?clean(preTripStopsV127):[]}catch(_){return []}}
  function selectedStops(){try{return Array.isArray(globalThis.mvSelectedStopOrderV16269)&&globalThis.mvSelectedStopOrderV16269.length?clean(globalThis.mvSelectedStopOrderV16269):realStops()}catch(_){return realStops()}}
  function mapUrl(order){
    const origin=(byId('origem')?.value||'').trim(),destination=(byId('destino')?.value||'').trim(),round=!!byId('routeRoundTripV132')?.checked;
    const stops=clean(order?.length?order:selectedStops());
    const points=[...stops,destination];if(round&&origin)points.push(origin);
    const daddr=points.map(x=>encodeURIComponent(x)).join('+to:');
    return 'https://maps.google.com/maps?output=embed&hl=pt-BR&dirflg=d&saddr='+encodeURIComponent(origin)+'&daddr='+daddr;
  }
  async function drawGoogle(item,index=0,order){
    const box=byId('routeEmbeddedMapV133'),statusEl=byId('routeMapStatusV133');if(!box)return;
    box.innerHTML='';const f=document.createElement('iframe');f.id='mvGoogleRouteFrameV16269';f.title='Percurso no Google Maps';f.loading='eager';f.referrerPolicy='no-referrer-when-downgrade';f.allowFullscreen=true;f.src=mapUrl(order);f.setAttribute('allow','geolocation');box.appendChild(f);
    if(statusEl){const n=clean(order?.length?order:selectedStops()).length;statusEl.textContent='Google Maps · '+n+' parada'+(n===1?'':'s')}
  }
  globalThis.renderEmbeddedMapV133=drawGoogle;globalThis.mvGoogleRouteUrlV16269=mapUrl;globalThis.mvRealRouteStopsV16269=realStops;
  async function fetchRoute(origin,destination,stops,optimize){const r=await fetch('/api/routes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({origin,destination,stops,optimize})}),j=await r.json().catch(()=>({}));if(!r.ok||!j.items?.length)throw Error(j.error||'Falha ao calcular percurso');return j.items[0]}
  const seconds=v=>Number(String(v||'0').replace('s',''))||0;
  const km=v=>(Number(v||0)/1000).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+' km';
  const dur=v=>{const m=Math.round(seconds(v)/60),h=Math.floor(m/60);return h?(h+'h '+String(m%60).padStart(2,'0')+'min'):(m+' min')};
  const money=v=>'R$ '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const path=(o,d,stops,round)=>[o,...stops,d,...(round?[o]:[])].filter(Boolean).join(' → ');
  function optionCard(o,i){const toll=o.item.hasTolls?(o.item.tollTotalBRL>0?'Pedágios: '+money(o.item.tollTotalBRL):'Com pedágio'):'Sem pedágio identificado';return '<button type="button" class="route-choice-v131 mv-seq69 '+(i===0?'selected':'')+'" data-seq69="'+i+'"><div class="route-choice-head-v131"><b>'+(o.best?'★ ':'')+o.label+'</b><span>'+dur(o.item.duration)+'</span></div><div class="route-choice-metrics-v131"><strong>'+km(o.item.distanceMeters)+'</strong><span>'+toll+'</span></div><small>'+path(o.origin,o.destination,o.stops,o.round).replace(/</g,'&lt;')+'</small></button>'}
  function renderOptions(opts){
    const box=byId('routePlanResultsV131');if(!box)return;globalThis.mvRouteSequenceOptionsV16269=opts;
    box.innerHTML=opts.map(optionCard).join('')+'<div id="routeMapWrapV133" class="route-map-wrap-v133"><div class="route-map-head-v133"><b>Mapa do percurso</b><span id="routeMapStatusV133">Google Maps</span></div><div id="routeEmbeddedMapV133"></div></div><button type="button" class="sec route-real-map-v131" id="routeRealMapV131">🗺️ Abrir no Google Maps</button>';
    box.classList.remove('hide');
    const choose=i=>{const o=opts[i];if(!o)return;globalThis.mvSelectedStopOrderV16269=[...o.stops];box.querySelectorAll('[data-seq69]').forEach((b,n)=>b.classList.toggle('selected',n===i));drawGoogle(o.item,i,o.stops)};
    box.querySelectorAll('[data-seq69]').forEach(b=>b.onclick=()=>choose(Number(b.dataset.seq69)));
    byId('routeRealMapV131').onclick=()=>{const i=[...box.querySelectorAll('[data-seq69]')].findIndex(b=>b.classList.contains('selected')),o=opts[Math.max(0,i)];const wp=[...o.stops,...(o.round?[o.destination]:[])];window.open('https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(o.origin)+'&destination='+encodeURIComponent(o.round?o.origin:o.destination)+'&travelmode=driving&waypoints='+encodeURIComponent(wp.join('|')),'_blank')};
    choose(0);
  }
  async function plan(){
    const origin=(byId('origem')?.value||'').trim(),destination=(byId('destino')?.value||'').trim(),stops=realStops(),round=!!byId('routeRoundTripV132')?.checked,btn=byId('routePlanBtnV131'),box=byId('routePlanResultsV131');
    if(!origin)return msg('Informe a origem',true);if(!destination)return msg('Informe o destino',true);
    globalThis.mvSelectedStopOrderV16269=[];if(btn){btn.disabled=true;btn.textContent='Comparando trajetos...'}if(box){box.classList.remove('hide');box.innerHTML='<div class="route-loading-v131">Calculando percurso com '+stops.length+' parada'+(stops.length===1?'':'s')+'...</div>'}
    try{
      const original=await fetchRoute(origin,destination,stops,false),opts=[{label:stops.length?'Sequência informada':'Rota recomendada',item:original,stops:[...stops],origin,destination,round,best:stops.length<2}];
      if(stops.length>=2){const optimizedItem=await fetchRoute(origin,destination,stops,true),idx=optimizedItem.optimizedIntermediateWaypointIndex||[],optimized=idx.length===stops.length?idx.map(i=>stops[i]):[...stops];const same=optimized.join('|').toLowerCase()===stops.join('|').toLowerCase();if(same)opts[0].best=true;else opts.push({label:'Melhor sequência Google',item:optimizedItem,stops:optimized,origin,destination,round,best:true});const rev=[...stops].reverse();if(rev.join('|').toLowerCase()!==stops.join('|').toLowerCase()&&rev.join('|').toLowerCase()!==optimized.join('|').toLowerCase()){try{opts.push({label:'Sequência alternativa',item:await fetchRoute(origin,destination,rev,false),stops:rev,origin,destination,round,best:false})}catch(_){}}}
      opts.sort((a,b)=>a.best!==b.best?(a.best?-1:1):seconds(a.item.duration)-seconds(b.item.duration));renderOptions(opts);msg(stops.length>=2?'Escolha a sequência de paradas para o percurso.':stops.length===1?'Rota calculada com a parada incluída.':'Rota calculada pelo Google')
    }catch(e){if(box)box.innerHTML='<div class="route-error-v131"><b>Planejamento indisponível</b><span>'+String(e.message||e).replace(/</g,'&lt;')+'</span></div>';msg(e.message||'Erro ao calcular rota',true)}finally{if(btn){btn.disabled=false;btn.textContent='🧭 Planejar rota e custos'}}
  }
  function bind(){const b=byId('routePlanBtnV131');if(!b||b.dataset.mv69)return;b.dataset.mv69='1';b.onclick=null;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();plan()},true)}
  globalThis.planRouteV131=plan;[0,250,800,1600,3000].forEach(ms=>setTimeout(bind,ms));new MutationObserver(()=>requestAnimationFrame(bind)).observe(document.documentElement,{subtree:true,childList:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.69 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.69 real stop store + Google Maps route sequence cards */
#mvGoogleRouteFrameV16267,#mvGoogleRouteFrameV16268{display:none!important}
#mvGoogleRouteFrameV16269{display:block!important;width:100%!important;height:100%!important;border:0!important}
.mv-seq69{min-height:88px!important}.mv-seq69.selected{background:#1767cf!important;color:#fff!important;border-color:#123e78!important}.mv-seq69.selected *{color:#fff!important}.mv-seq69 small{display:block!important;margin-top:7px!important;white-space:normal!important;line-height:1.4!important}
`;
if(!s.includes('</style>'))throw new Error('v162.69 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.69: real route stops bound to Google Maps and sequence planner');
