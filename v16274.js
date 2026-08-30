const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.74: simplified route choices, synchronized map, and same-way return option.
(function(){
  const byId=id=>document.getElementById(id);
  const sec=v=>Number(String(v||'0').replace('s',''))||0;
  const durSec=n=>String(Math.max(0,Math.round(n)))+'s';
  const clean=arr=>(arr||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
  const esc=v=>String(v||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const km=v=>(Number(v||0)/1000).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+' km';
  const dur=v=>{const m=Math.round(sec(v)/60),h=Math.floor(m/60);return h?(h+'h '+String(m%60).padStart(2,'0')+'min'):(m+' min')};
  const money=v=>'R$ '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  function mapUrl(o){
    const pts=[...clean(o.stops),o.destination];if(o.round)pts.push(o.origin);
    const base='https://maps.google.com/maps?output=embed&hl=pt-BR&dirflg=d&saddr='+encodeURIComponent(o.origin)+'&daddr='+encodeURIComponent(pts.join(' to: '));
    // Force iframe navigation on every selected alternative; cache-buster also prevents stale embedded route.
    return base+'&mvroute='+encodeURIComponent(String(o.routeVariant??0)+'-'+String(o.sameWayReturn?'same':'google'))+'&t='+Date.now();
  }
  function draw(o){
    const box=byId('routeEmbeddedMapV133'),st=byId('routeMapStatusV133');if(!box||!o)return;
    box.innerHTML='';const f=document.createElement('iframe');f.id='mvGoogleRouteFrameV16274';f.title='Percurso selecionado no Google Maps';f.loading='eager';f.referrerPolicy='no-referrer-when-downgrade';f.allowFullscreen=true;f.setAttribute('allow','geolocation');f.src=mapUrl(o);box.appendChild(f);
    if(st)st.textContent='Google Maps · rota '+(Number(o.routeVariant||0)+1)+(o.sameWayReturn?' · retorno pelo mesmo caminho':'');
  }
  function sameWayOption(base){
    const out=base?.item?.outbound||base?.outboundItem||base?.item;if(!base||!out)return null;
    const item={...base.item,distanceMeters:Number(out.distanceMeters||0)*2,duration:durSec(sec(out.duration)*2),tollTotalBRL:Number(out.tollTotalBRL||0)*2,hasTolls:!!out.hasTolls,outbound:out,returnRoute:{...out,reverseOfOutbound:true}};
    return {...base,label:'Retornar pelo mesmo caminho',best:false,item,sameWayReturn:true,routeVariant:99};
  }
  function path(o){return [o.origin,...clean(o.stops),o.destination,...(o.round?[o.origin]:[])].filter(Boolean).join(' → ')}
  function specialCard(o,i){
    const toll=o.item.hasTolls?(Number(o.item.tollTotalBRL)>0?'Pedágios estimados: '+money(o.item.tollTotalBRL):'Com pedágio'):'Sem pedágio identificado';
    return '<button type="button" class="route-choice-v131 mv-route72 mv-sameway74" data-route74="'+i+'"><div class="route-choice-head-v131"><b>↩ Retornar pelo mesmo caminho</b><span>'+dur(o.item.duration)+'</span></div><div class="route-choice-metrics-v131"><strong>'+km(o.item.distanceMeters)+'</strong><span>'+toll+'</span></div><small>'+esc(path(o))+'</small><em>Ida escolhida + retorno pelo trajeto inverso</em></button>';
  }
  function simplify(){
    const box=byId('routePlanResultsV131');if(!box)return;
    byId('mvPlannerModesV16273')?.remove();byId('mvPlannerHintV16273')?.remove();byId('mvCustomPlannerV16273')?.remove();
    box.querySelectorAll('.mv-route72').forEach(x=>x.classList.remove('mv-suggested-hidden73'));
    const opts=globalThis.mvRouteOptionsV16272;if(!Array.isArray(opts)||!opts.length)return;
    let same=opts.find(x=>x.sameWayReturn);if(!same&&opts[0]?.round){same=sameWayOption(opts[0]);if(same){opts.push(same);globalThis.mvRouteOptionsV16272=opts}}
    if(same&&!box.querySelector('.mv-sameway74')){
      const map=byId('routeMapWrapV133');map?.insertAdjacentHTML('beforebegin',specialCard(same,opts.indexOf(same)));
    }
    const choose=i=>{const o=opts[i];if(!o)return;globalThis.mvSelectedRouteV16272=o;globalThis.mvChosenStopOrderV16270=[...clean(o.stops)];box.querySelectorAll('[data-route72],[data-route74]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.route72??b.dataset.route74)===i));draw(o)};
    box.querySelectorAll('[data-route72],[data-route74]').forEach(b=>{if(b.dataset.mv74)return;b.dataset.mv74='1';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();choose(Number(b.dataset.route72??b.dataset.route74))},true)});
    const selected=globalThis.mvSelectedRouteV16272;const idx=selected?opts.indexOf(selected):0;if(idx>=0)choose(idx);
  }
  [0,180,450,900,1800,3200].forEach(ms=>setTimeout(simplify,ms));
  new MutationObserver(()=>requestAnimationFrame(simplify)).observe(document.documentElement,{subtree:true,childList:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.74 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.74 simplified planner */
#mvPlannerModesV16273,#mvPlannerHintV16273,#mvCustomPlannerV16273{display:none!important}
.mv-route72.mv-suggested-hidden73{display:block!important}
.mv-sameway74{border-style:dashed!important;background:#f8fbff!important}
.mv-sameway74.selected{background:#1767cf!important;border-style:solid!important;color:#fff!important}
.mv-sameway74.selected *{color:#fff!important}
#mvGoogleRouteFrameV16274{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#eef2f7!important}
`;
if(!s.includes('</style>'))throw new Error('v162.74 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.74: synchronized map + same-way return option installed');
