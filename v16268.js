const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.68: preserve all intermediate stops in Google Maps and offer selectable stop sequences.
(function(){
  const byId=id=>document.getElementById(id);
  const cleanStops=arr=>(arr||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
  const keyOf=arr=>arr.map(x=>x.toLocaleLowerCase('pt-BR')).join('|');
  const currentStops=()=>cleanStops(globalThis.mvSelectedStopOrderV16268?.length?globalThis.mvSelectedStopOrderV16268:(globalThis.preTripStopsV127||[]));
  function googleRouteUrl(stopsOverride){
    const origin=(byId('origem')?.value||'').trim();
    const destination=(byId('destino')?.value||'').trim();
    const round=!!byId('routeRoundTripV132')?.checked;
    const stops=cleanStops(stopsOverride?.length?stopsOverride:currentStops());
    const legs=[...stops,destination].filter(Boolean);if(round&&origin)legs.push(origin);
    // Google legacy embed parser requires unescaped +to: separators between individually escaped addresses.
    const daddr=legs.map(v=>encodeURIComponent(v)).join('+to:');
    return 'https://maps.google.com/maps?output=embed&hl=pt-BR&dirflg=d&saddr='+encodeURIComponent(origin)+'&daddr='+daddr;
  }
  async function googleMap68(item,index=0,stopsOverride){
    const box=byId('routeEmbeddedMapV133'),statusEl=byId('routeMapStatusV133');if(!box)return;
    try{if(globalThis.routeMapV133){routeMapV133.remove?.();routeMapV133=null;routeLayerV133=null}}catch(_){}
    box.innerHTML='';const frame=document.createElement('iframe');frame.id='mvGoogleRouteFrameV16268';frame.title='Rota no Google Maps';frame.loading='eager';frame.referrerPolicy='no-referrer-when-downgrade';frame.allowFullscreen=true;frame.src=googleRouteUrl(stopsOverride);frame.setAttribute('allow','geolocation');box.appendChild(frame);
    if(statusEl){const km=typeof fmtKmV131==='function'?fmtKmV131(item?.distanceMeters):'';const dur=typeof fmtDurV131==='function'?fmtDurV131(item?.duration):'';statusEl.textContent='Google Maps · '+[km,dur].filter(Boolean).join(' · ')}
  }
  globalThis.renderEmbeddedMapV133=googleMap68;
  globalThis.mvGoogleRouteUrlV16268=googleRouteUrl;
  function money(v){return typeof moeda==='function'?moeda(v):('R$ '+Number(v||0).toFixed(2).replace('.',','))}
  function km(v){return typeof fmtKmV131==='function'?fmtKmV131(v):(Number(v||0)/1000).toFixed(1)+' km'}
  function dur(v){return typeof fmtDurV131==='function'?fmtDurV131(v):String(v||'')}
  function routeBody(origin,destination,stops,optimize=false){return {origin,destination,stops,optimize}}
  async function routeFetch(origin,destination,stops,optimize=false){const r=await fetch('/api/routes',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(routeBody(origin,destination,stops,optimize))}),j=await r.json().catch(()=>({}));if(!r.ok||!j.items?.length)throw Error(j.error||'Não foi possível calcular esta sequência');return j.items[0]}
  function sequenceText(origin,destination,stops,round){const all=[origin,...stops,destination];if(round)all.push(origin);return all.filter(Boolean).join(' → ')}
  function makeOption(label,item,stops,origin,destination,round,recommended=false){return {label,item,stops:[...stops],origin,destination,round,recommended}}
  function renderSequences(options){
    const box=byId('routePlanResultsV131');if(!box)return;globalThis.mvRouteSequenceOptionsV16268=options;
    box.innerHTML=options.map((o,i)=>'<button type="button" class="route-choice-v131 mv-seq-choice-v16268 '+(i===0?'selected':'')+'" data-mv-seq68="'+i+'"><div class="route-choice-head-v131"><b>'+((o.recommended?'★ ':'')+o.label)+'</b><span>'+dur(o.item.duration)+'</span></div><div class="route-choice-metrics-v131"><strong>'+km(o.item.distanceMeters)+'</strong><span>'+(o.item.hasTolls?(o.item.tollTotalBRL>0?('Pedágios: '+money(o.item.tollTotalBRL)):'Com pedágio'):'Sem pedágio identificado')+'</span></div><small class="mv-seq-path-v16268">'+sequenceText(o.origin,o.destination,o.stops,o.round).replace(/</g,'&lt;')+'</small></button>').join('')+'<div id="routeMapWrapV133" class="route-map-wrap-v133"><div class="route-map-head-v133"><b>Mapa do percurso</b><span id="routeMapStatusV133">Google Maps</span></div><div id="routeEmbeddedMapV133" class="route-embedded-map-v133"></div></div><button type="button" class="sec route-real-map-v131" id="routeRealMapV131">🗺️ Abrir mapa real da rota</button>';
    box.classList.remove('hide');
    const choose=i=>{const o=options[i];if(!o)return;globalThis.mvSelectedStopOrderV16268=[...o.stops];box.querySelectorAll('[data-mv-seq68]').forEach((b,n)=>b.classList.toggle('selected',n===i));googleMap68(o.item,i,o.stops)};
    box.querySelectorAll('[data-mv-seq68]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.mvSeq68))));
    const open=byId('routeRealMapV131');if(open)open.onclick=()=>window.open('https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(options.find((_,i)=>box.querySelector('[data-mv-seq68="'+i+'"]')?.classList.contains('selected'))?.origin||options[0].origin)+'&destination='+encodeURIComponent(options[0].round?options[0].origin:options[0].destination)+'&waypoints='+encodeURIComponent(currentStops().concat(options[0].round?[options[0].destination]:[]).join('|')),'_blank');
    choose(0);
  }
  async function plan68(){
    const origin=(byId('origem')?.value||'').trim(),destination=(byId('destino')?.value||'').trim(),stops=cleanStops(globalThis.preTripStopsV127||[]),round=!!byId('routeRoundTripV132')?.checked,btn=byId('routePlanBtnV131'),box=byId('routePlanResultsV131');
    if(!origin)return msg('Informe a origem',true);if(!destination)return msg('Informe o destino',true);
    globalThis.mvSelectedStopOrderV16268=[];if(btn){btn.disabled=true;btn.textContent='Calculando sequências...'}if(box){box.classList.remove('hide');box.innerHTML='<div class="route-loading-v131">Comparando sequências de paradas e rotas no Google...</div>'}
    try{
      const baseItem=await routeFetch(origin,destination,stops,false);const candidates=[makeOption(stops.length?'Sequência informada':'Rota recomendada',baseItem,stops,origin,destination,round,stops.length<2)];
      if(stops.length>=2){
        const optItem=await routeFetch(origin,destination,stops,true);const idx=Array.isArray(optItem.optimizedIntermediateWaypointIndex)?optItem.optimizedIntermediateWaypointIndex:[];const optimized=idx.length===stops.length?idx.map(i=>stops[i]):[...stops];
        if(keyOf(optimized)!==keyOf(stops))candidates.push(makeOption('Melhor sequência Google',optItem,optimized,origin,destination,round,true));else candidates[0].recommended=true;
        const rev=[...stops].reverse();if(keyOf(rev)!==keyOf(stops)&&keyOf(rev)!==keyOf(optimized)){try{const revItem=await routeFetch(origin,destination,rev,false);candidates.push(makeOption('Sequência alternativa',revItem,rev,origin,destination,round,false))}catch(_){}}
      }
      candidates.sort((a,b)=>{if(a.recommended!==b.recommended)return a.recommended?-1:1;return Number(a.item.duration?.replace?.('s','')||0)-Number(b.item.duration?.replace?.('s','')||0)});renderSequences(candidates);msg(stops.length>=2?'Sequências comparadas. Escolha a melhor para o percurso.':'Rota calculada pelo Google')
    }catch(e){if(box)box.innerHTML='<div class="route-error-v131"><b>Planejamento de rota indisponível</b><span>'+String(e.message||e).replace(/</g,'&lt;')+'</span></div>';msg(e.message||'Erro ao calcular rota',true)}finally{if(btn){btn.disabled=false;btn.textContent='🧭 Planejar rota e custos'}}
  }
  function bind(){const b=byId('routePlanBtnV131');if(b&&!b.dataset.mvSeqV16268){b.dataset.mvSeqV16268='1';b.onclick=null;b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation?.();plan68()},true)}}
  globalThis.planRouteV131=plan68;[0,250,800,1600,3000].forEach(ms=>setTimeout(bind,ms));new MutationObserver(()=>requestAnimationFrame(bind)).observe(document.documentElement,{subtree:true,childList:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.68 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.68 sequence planner + Google Maps stop preservation */
#mvGoogleRouteFrameV16268{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#eef2f7!important}
.mv-seq-choice-v16268{min-height:86px!important}
.mv-seq-choice-v16268.selected{background:#1767cf!important;color:#fff!important;border-color:#123e78!important}
.mv-seq-choice-v16268.selected *{color:#fff!important}
.mv-seq-path-v16268{display:block!important;white-space:normal!important;line-height:1.35!important;margin-top:7px!important}
@media(max-width:700px){.mv-seq-choice-v16268{padding:11px!important}.mv-seq-path-v16268{font-size:10px!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.68 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.68: Google Maps stops and sequence choices installed');
