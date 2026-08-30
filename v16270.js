const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.70: one stop source for form, route planning and Google map; restore proven Google embed encoding.
(function(){
  const byId=id=>document.getElementById(id);
  const clean=arr=>(arr||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
  function lexicalStops(){try{return typeof preTripStopsV127!=='undefined'?clean(preTripStopsV127):[]}catch(_){return []}}
  function domStops(){return [...document.querySelectorAll('#preTripStopsListV127 .pre-stop-row-v127 b')].map(x=>(x.textContent||'').trim()).filter(Boolean)}
  function routeStops(){const a=lexicalStops();if(a.length)return a;const b=domStops();if(b.length)return b;return clean(globalThis.mvPreTripStopsV16270||[])}
  function syncStore(){globalThis.mvPreTripStopsV16270=routeStops();return [...globalThis.mvPreTripStopsV16270]}
  function chosenStops(){return clean(globalThis.mvChosenStopOrderV16270?.length?globalThis.mvChosenStopOrderV16270:syncStore())}
  function routeUrl(order){
    const origin=(byId('origem')?.value||'').trim(),destination=(byId('destino')?.value||'').trim(),round=!!byId('routeRoundTripV132')?.checked;
    const stops=clean(order?.length?order:chosenStops()),points=[...stops,destination];if(round&&origin)points.push(origin);
    // Same syntax that already rendered correctly in v162.67, now with all intermediate stops included.
    return 'https://maps.google.com/maps?output=embed&hl=pt-BR&dirflg=d&saddr='+encodeURIComponent(origin)+'&daddr='+encodeURIComponent(points.filter(Boolean).join(' to: '));
  }
  function draw(item,order){
    const box=byId('routeEmbeddedMapV133'),st=byId('routeMapStatusV133');if(!box)return;
    const stops=clean(order?.length?order:chosenStops());box.innerHTML='';
    const f=document.createElement('iframe');f.id='mvGoogleRouteFrameV16270';f.title='Percurso no Google Maps';f.loading='eager';f.referrerPolicy='no-referrer-when-downgrade';f.allowFullscreen=true;f.src=routeUrl(stops);f.setAttribute('allow','geolocation');box.appendChild(f);
    if(st)st.textContent='Google Maps · '+stops.length+' parada'+(stops.length===1?'':'s');
  }
  globalThis.mvRouteStopsV16270=routeStops;globalThis.mvRouteUrlV16270=routeUrl;globalThis.renderEmbeddedMapV133=(item,index)=>draw(item,chosenStops());
  const sec=v=>Number(String(v||'0').replace('s',''))||0, km=v=>(Number(v||0)/1000).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+' km';
  const dur=v=>{const m=Math.round(sec(v)/60),h=Math.floor(m/60);return h?(h+'h '+String(m%60).padStart(2,'0')+'min'):(m+' min')};
  const money=v=>'R$ '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  async function getRoute(origin,destination,stops,optimize){const r=await fetch('/api/routes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({origin,destination,stops,optimize})}),j=await r.json().catch(()=>({}));if(!r.ok||!j.items?.length)throw Error(j.error||'Falha ao calcular percurso');return j.items[0]}
  function same(a,b){return clean(a).join('|').toLocaleLowerCase('pt-BR')===clean(b).join('|').toLocaleLowerCase('pt-BR')}
  function path(o){return [o.origin,...o.stops,o.destination,...(o.round?[o.origin]:[])].filter(Boolean).join(' → ')}
  function card(o,i){const toll=o.item.hasTolls?(o.item.tollTotalBRL>0?'Pedágios: '+money(o.item.tollTotalBRL):'Com pedágio'):'Sem pedágio identificado';return '<button type="button" class="route-choice-v131 mv-seq70 '+(i===0?'selected':'')+'" data-seq70="'+i+'"><div class="route-choice-head-v131"><b>'+(o.best?'★ ':'')+o.label+'</b><span>'+dur(o.item.duration)+'</span></div><div class="route-choice-metrics-v131"><strong>'+km(o.item.distanceMeters)+'</strong><span>'+toll+'</span></div><small>'+path(o).replace(/</g,'&lt;')+'</small></button>'}
  function renderOptions(opts){
    const box=byId('routePlanResultsV131');if(!box)return;globalThis.mvRouteOptionsV16270=opts;
    box.innerHTML=opts.map(card).join('')+'<div id="routeMapWrapV133" class="route-map-wrap-v133"><div class="route-map-head-v133"><b>Mapa do percurso</b><span id="routeMapStatusV133">Google Maps</span></div><div id="routeEmbeddedMapV133"></div></div><button type="button" class="sec route-real-map-v131" id="routeRealMapV131">🗺️ Abrir mapa real da rota</button>';
    box.classList.remove('hide');
    const choose=i=>{const o=opts[i];if(!o)return;globalThis.mvChosenStopOrderV16270=[...o.stops];box.querySelectorAll('[data-seq70]').forEach((b,n)=>b.classList.toggle('selected',n===i));draw(o.item,o.stops)};
    box.querySelectorAll('[data-seq70]').forEach(b=>b.onclick=()=>choose(Number(b.dataset.seq70)));
    byId('routeRealMapV131').onclick=()=>{const i=[...box.querySelectorAll('[data-seq70]')].findIndex(b=>b.classList.contains('selected')),o=opts[Math.max(i,0)],wp=[...o.stops,...(o.round?[o.destination]:[])];window.open('https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(o.origin)+'&destination='+encodeURIComponent(o.round?o.origin:o.destination)+'&travelmode=driving&waypoints='+encodeURIComponent(wp.join('|')),'_blank')};choose(0);
  }
  async function plan(){
    const origin=(byId('origem')?.value||'').trim(),destination=(byId('destino')?.value||'').trim(),stops=syncStore(),round=!!byId('routeRoundTripV132')?.checked,btn=byId('routePlanBtnV131'),box=byId('routePlanResultsV131');
    if(!origin)return msg('Informe a origem',true);if(!destination)return msg('Informe o destino',true);
    globalThis.mvChosenStopOrderV16270=[];if(btn){btn.disabled=true;btn.textContent='Comparando trajetos...'}if(box){box.classList.remove('hide');box.innerHTML='<div class="route-loading-v131">Calculando percurso com '+stops.length+' parada'+(stops.length===1?'':'s')+'...</div>'}
    try{
      const base=await getRoute(origin,destination,stops,false),opts=[{label:stops.length?'Sequência informada':'Rota recomendada',item:base,stops:[...stops],origin,destination,round,best:stops.length<2}];
      if(stops.length>=2){const opt=await getRoute(origin,destination,stops,true),idx=Array.isArray(opt.optimizedIntermediateWaypointIndex)?opt.optimizedIntermediateWaypointIndex:[],ordered=idx.length===stops.length?idx.map(i=>stops[i]):[...stops];if(same(ordered,stops))opts[0].best=true;else opts.push({label:'Melhor sequência Google',item:opt,stops:ordered,origin,destination,round,best:true});const rev=[...stops].reverse();if(!same(rev,stops)&&!same(rev,ordered)){try{opts.push({label:'Sequência alternativa',item:await getRoute(origin,destination,rev,false),stops:rev,origin,destination,round,best:false})}catch(_){}}}
      opts.sort((a,b)=>a.best!==b.best?(a.best?-1:1):sec(a.item.duration)-sec(b.item.duration));renderOptions(opts);msg(stops.length>=2?'Escolha a sequência de paradas para o percurso.':stops.length===1?'Rota calculada com a parada incluída.':'Rota calculada pelo Google')
    }catch(e){if(box)box.innerHTML='<div class="route-error-v131"><b>Planejamento indisponível</b><span>'+String(e.message||e).replace(/</g,'&lt;')+'</span></div>';msg(e.message||'Erro ao calcular rota',true)}finally{if(btn){btn.disabled=false;btn.textContent='🧭 Planejar rota e custos'}}
  }
  function bind(){
    const add=byId('preTripStopAddV127');if(add&&!add.dataset.mvStore70){add.dataset.mvStore70='1';add.addEventListener('click',()=>setTimeout(syncStore,0))}
    const list=byId('preTripStopsListV127');if(list&&!list.dataset.mvStore70){list.dataset.mvStore70='1';new MutationObserver(syncStore).observe(list,{childList:true,subtree:true})}
    const b=byId('routePlanBtnV131');if(b&&!b.dataset.mv70){b.dataset.mv70='1';b.onclick=null;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();plan()},true)}
  }
  globalThis.planRouteV131=plan;[0,250,800,1600,3000].forEach(ms=>setTimeout(bind,ms));new MutationObserver(()=>requestAnimationFrame(bind)).observe(document.documentElement,{subtree:true,childList:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.70 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.70 route map and sequence planner */
#mvGoogleRouteFrameV16267,#mvGoogleRouteFrameV16268,#mvGoogleRouteFrameV16269{display:none!important}
#mvGoogleRouteFrameV16270{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#eef2f7!important}
.mv-seq70{min-height:88px!important}.mv-seq70.selected{background:#1767cf!important;color:#fff!important;border-color:#123e78!important}.mv-seq70.selected *{color:#fff!important}.mv-seq70 small{display:block!important;margin-top:7px!important;white-space:normal!important;line-height:1.4!important}
`;
if(!s.includes('</style>'))throw new Error('v162.70 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.70: visible stops drive route sequences and Google map');
