const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.72: full round-trip totals + selectable route alternatives.
(function(){
  const byId=id=>document.getElementById(id);
  const clean=arr=>(arr||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
  const sec=v=>Number(String(v||'0').replace('s',''))||0;
  const durSec=n=>String(Math.max(0,Math.round(n)))+'s';
  const km=v=>(Number(v||0)/1000).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+' km';
  const dur=v=>{const m=Math.round(sec(v)/60),h=Math.floor(m/60);return h?(h+'h '+String(m%60).padStart(2,'0')+'min'):(m+' min')};
  const money=v=>'R$ '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  function stops(){try{return clean(globalThis.mvRouteStopsV16270?.())}catch(_){return []}}
  async function routes(origin,destination,waypoints,optimize=false){
    const r=await fetch('/api/routes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({origin,destination,stops:clean(waypoints),optimize})});
    const j=await r.json().catch(()=>({}));if(!r.ok||!Array.isArray(j.items)||!j.items.length)throw Error(j.error||'Falha ao calcular percurso');return j.items;
  }
  function combine(outbound,returnItem){
    if(!returnItem)return {...outbound};
    return {
      ...outbound,
      distanceMeters:Number(outbound.distanceMeters||0)+Number(returnItem.distanceMeters||0),
      duration:durSec(sec(outbound.duration)+sec(returnItem.duration)),
      tollTotalBRL:Number(outbound.tollTotalBRL||0)+Number(returnItem.tollTotalBRL||0),
      hasTolls:!!(outbound.hasTolls||returnItem.hasTolls),
      hasFerry:!!(outbound.hasFerry||returnItem.hasFerry),
      outbound,
      returnRoute:returnItem
    };
  }
  function same(a,b){return clean(a).join('|').toLocaleLowerCase('pt-BR')===clean(b).join('|').toLocaleLowerCase('pt-BR')}
  function path(o){return [o.origin,...o.stops,o.destination,...(o.round?[o.origin]:[])].filter(Boolean).join(' → ')}
  function labelFor(i,total,baseLabel,best){
    if(total<=1)return (best?'★ ':'')+baseLabel;
    if(i===0)return '★ Mais rápida · '+baseLabel;
    return 'Opção de rota '+(i+1)+' · '+baseLabel;
  }
  function card(o,i,total){
    const toll=o.item.hasTolls?(o.item.tollTotalBRL>0?'Pedágios: '+money(o.item.tollTotalBRL):'Com pedágio'):'Sem pedágio identificado';
    return '<button type="button" class="route-choice-v131 mv-route72 '+(i===0?'selected':'')+'" data-route72="'+i+'"><div class="route-choice-head-v131"><b>'+labelFor(i,total,o.label,o.best)+'</b><span>'+dur(o.item.duration)+'</span></div><div class="route-choice-metrics-v131"><strong>'+km(o.item.distanceMeters)+'</strong><span>'+toll+'</span></div><small>'+path(o).replace(/</g,'&lt;')+'</small><em>'+(o.round?'Total ida + volta':'Percurso total')+'</em></button>';
  }
  function mapUrl(o){
    const pts=[...o.stops,o.destination];if(o.round)pts.push(o.origin);
    return 'https://maps.google.com/maps?output=embed&hl=pt-BR&dirflg=d&saddr='+encodeURIComponent(o.origin)+'&daddr='+encodeURIComponent(pts.join(' to: '));
  }
  function draw(o){
    const box=byId('routeEmbeddedMapV133'),st=byId('routeMapStatusV133');if(!box)return;
    box.innerHTML='';const f=document.createElement('iframe');f.id='mvGoogleRouteFrameV16272';f.title='Percurso no Google Maps';f.loading='eager';f.referrerPolicy='no-referrer-when-downgrade';f.allowFullscreen=true;f.src=mapUrl(o);f.setAttribute('allow','geolocation');box.appendChild(f);
    if(st)st.textContent='Google Maps · '+o.stops.length+' parada'+(o.stops.length===1?'':'s')+' · '+(o.round?'ida e volta':'somente ida');
  }
  function render(opts){
    const box=byId('routePlanResultsV131');if(!box)return;globalThis.mvRouteOptionsV16272=opts;
    box.innerHTML=opts.map((o,i)=>card(o,i,opts.length)).join('')+'<div id="routeMapWrapV133" class="route-map-wrap-v133"><div class="route-map-head-v133"><b>Mapa do percurso</b><span id="routeMapStatusV133">Google Maps</span></div><div id="routeEmbeddedMapV133"></div></div><button type="button" class="sec route-real-map-v131" id="routeRealMapV131">🗺️ Abrir mapa real da rota</button>';
    box.classList.remove('hide');
    const choose=i=>{const o=opts[i];if(!o)return;globalThis.mvSelectedRouteV16272=o;globalThis.mvChosenStopOrderV16270=[...o.stops];box.querySelectorAll('[data-route72]').forEach((b,n)=>b.classList.toggle('selected',n===i));draw(o)};
    box.querySelectorAll('[data-route72]').forEach(b=>b.onclick=()=>choose(Number(b.dataset.route72)));
    byId('routeRealMapV131').onclick=()=>{const o=globalThis.mvSelectedRouteV16272||opts[0],wp=[...o.stops,...(o.round?[o.destination]:[])];window.open('https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(o.origin)+'&destination='+encodeURIComponent(o.round?o.origin:o.destination)+'&travelmode=driving&waypoints='+encodeURIComponent(wp.join('|')),'_blank')};
    choose(0);
  }
  async function buildSequence(origin,destination,seq,round,label,best){
    const outboundItems=await routes(origin,destination,seq,false);
    if(!round)return outboundItems.slice(0,3).map((item,i)=>({label,best:best||i===0,item,stops:[...seq],origin,destination,round:false}));
    const returnItems=await routes(destination,origin,[],false);
    const out=outboundItems[0];
    return returnItems.slice(0,3).map((r,i)=>({label,best:best||i===0,item:combine(out,r),stops:[...seq],origin,destination,round:true,routeVariant:i}));
  }
  async function plan72(){
    const origin=(byId('origem')?.value||'').trim(),destination=(byId('destino')?.value||'').trim(),seq=stops(),round=!!byId('routeRoundTripV132')?.checked,box=byId('routePlanResultsV131');
    if(!origin)return msg('Informe a origem',true);if(!destination)return msg('Informe o destino',true);
    if(box){box.classList.remove('hide');box.innerHTML='<div class="route-loading-v131">Calculando distância total e opções de rota...</div>'}
    try{
      let options=[];
      if(seq.length>=2){
        const optimizedItems=await routes(origin,destination,seq,true),idx=optimizedItems[0]?.optimizedIntermediateWaypointIndex||[],ordered=idx.length===seq.length?idx.map(i=>seq[i]):[...seq];
        const firstSeq=same(ordered,seq)?seq:ordered,firstLabel=same(ordered,seq)?'Sequência informada':'Melhor sequência Google';
        options.push(...await buildSequence(origin,destination,firstSeq,round,firstLabel,true));
        if(!same(firstSeq,seq))options.push(...(await buildSequence(origin,destination,seq,round,'Sequência informada',false)).slice(0,1));
      }else{
        options.push(...await buildSequence(origin,destination,seq,round,seq.length?'Sequência informada':'Rota recomendada',true));
      }
      const seen=new Set();options=options.filter(o=>{const k=[o.stops.join('|'),o.item.distanceMeters,sec(o.item.duration)].join('#');if(seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>sec(a.item.duration)-sec(b.item.duration)).slice(0,4);
      options.forEach((o,i)=>o.best=i===0);
      render(options);msg(round?'Distância e tempo agora consideram ida + volta. Escolha a rota desejada.':'Escolha a rota desejada.')
    }catch(e){if(box)box.innerHTML='<div class="route-error-v131"><b>Planejamento indisponível</b><span>'+String(e.message||e).replace(/</g,'&lt;')+'</span></div>';msg(e.message||'Erro ao calcular rota',true)}
  }
  function install(){
    const b=byId('mvPlanRouteV16271');if(!b||b.dataset.mv72)return;b.dataset.mv72='1';
    const clone=b.cloneNode(true);clone.id='mvPlanRouteV16272';clone.removeAttribute('data-mv72');b.style.setProperty('display','none','important');b.insertAdjacentElement('afterend',clone);
    clone.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();clone.disabled=true;clone.textContent='Calculando ida + volta...';try{await plan72()}finally{clone.disabled=false;clone.textContent='🧭 Planejar rota e custos'}},true);
  }
  globalThis.planRouteV16272=plan72;
  [0,250,800,1600,3000].forEach(ms=>setTimeout(install,ms));new MutationObserver(()=>requestAnimationFrame(install)).observe(document.documentElement,{subtree:true,childList:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.72 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
#mvPlanRouteV16272{width:100%!important;min-height:48px!important;background:#1767cf!important;color:#fff!important;border:0!important;border-radius:4px!important;font-weight:800!important;font-size:15px!important}
#mvGoogleRouteFrameV16272{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#eef2f7!important}
.mv-route72{min-height:96px!important}.mv-route72.selected{background:#1767cf!important;color:#fff!important;border-color:#123e78!important}.mv-route72.selected *{color:#fff!important}.mv-route72 small{display:block!important;margin-top:7px!important;white-space:normal!important;line-height:1.4!important}.mv-route72 em{display:block!important;margin-top:6px!important;font-size:10px!important;font-style:normal!important;opacity:.85!important}
`;
if(!s.includes('</style>'))throw new Error('v162.72 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.72: full round-trip totals and selectable route alternatives installed');
