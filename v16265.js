const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.65: stabilize mobile route map rendering and make an existing active trip actionable.
(function(){
  const txt=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  function findAction(re){return [...document.querySelectorAll('button,a')].find(el=>re.test(txt(el))&&el.offsetParent!==null)}
  function activeTripBanner(){
    if(typeof activeTrip==='undefined'||!activeTrip?.id)return;
    const nodes=[...document.querySelectorAll('div,section,p')];
    const warning=nodes.find(el=>/Já existe um deslocamento em andamento/i.test(txt(el))&&el.children.length<12);
    if(!warning||warning.querySelector('.mv-active-actions-v16265'))return;
    const box=document.createElement('div');box.className='mv-active-actions-v16265';
    const cont=document.createElement('button');cont.type='button';cont.textContent='Continuar deslocamento atual';
    cont.onclick=e=>{e.preventDefault();const b=findAction(/continuar|acompanhar deslocamento|ver deslocamento/i);if(b&&b!==cont){b.click();return}const target=[...document.querySelectorAll('section,.card,.c,.panel,div')].find(el=>/deslocamento em andamento|finalizar deslocamento|km atual/i.test(txt(el))&&el!==warning);target?.scrollIntoView({behavior:'smooth',block:'start'})};
    const finish=document.createElement('button');finish.type='button';finish.className='secondary';finish.textContent='Finalizar atual';
    finish.onclick=e=>{e.preventDefault();const b=findAction(/finalizar deslocamento|encerrar deslocamento|finalizar atual/i);if(b&&b!==finish){b.click();return}msg?.('Abra o deslocamento atual para finalizar antes de iniciar outro.',true)};
    box.append(cont,finish);warning.appendChild(box);
  }
  function normalizeLeaflet(){
    if(globalThis.mvNativeLeafletControllerV16278)return;
    document.querySelectorAll('#routeEmbeddedMapV133 .leaflet-tile').forEach(img=>{
      img.style.setProperty('width','256px','important');img.style.setProperty('height','256px','important');img.style.setProperty('max-width','none','important');img.style.setProperty('max-height','none','important');
    });
    if(globalThis.routeMapV133){try{routeMapV133.invalidateSize({pan:false});if(routeLayerV133?.getBounds?.().isValid?.())routeMapV133.fitBounds(routeLayerV133.getBounds(),{padding:[18,18],maxZoom:13})}catch(_){}}
  }
  const mo=new MutationObserver(()=>{activeTripBanner();if(document.getElementById('routeEmbeddedMapV133'))requestAnimationFrame(normalizeLeaflet)});
  try{mo.observe(document.documentElement,{subtree:true,childList:true})}catch(_){ }
  [0,250,900,1800,3200].forEach(ms=>setTimeout(()=>{activeTripBanner();normalizeLeaflet()},ms));
  window.addEventListener('resize',()=>setTimeout(normalizeLeaflet,80),{passive:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.65 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.65 mobile map integrity + active trip UX */
#routeMapWrapV133{overflow:hidden!important}
#routeEmbeddedMapV133{position:relative!important;width:100%!important;height:300px!important;min-height:300px!important;overflow:hidden!important;touch-action:pan-x pan-y!important;background:#e9eef4!important}
#routeEmbeddedMapV133 .leaflet-container{width:100%!important;height:100%!important}
#routeEmbeddedMapV133 .leaflet-pane,#routeEmbeddedMapV133 .leaflet-map-pane,#routeEmbeddedMapV133 .leaflet-tile-pane{position:absolute!important;left:0!important;top:0!important}
#routeEmbeddedMapV133 .leaflet-tile-container{position:absolute!important;left:0!important;top:0!important}
#routeEmbeddedMapV133 img.leaflet-tile{width:256px!important;height:256px!important;max-width:none!important;max-height:none!important;object-fit:none!important;position:absolute!important}
#routeEmbeddedMapV133 .leaflet-marker-icon,#routeEmbeddedMapV133 .leaflet-marker-shadow{max-width:none!important}
#routeEmbeddedMapV133 .leaflet-control-container{position:relative!important;z-index:1000!important}
.mv-map-summary-v16230{position:relative!important;z-index:2!important}
.mv-active-actions-v16265{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin-top:12px!important}
.mv-active-actions-v16265 button{min-height:42px!important;border-radius:9px!important;padding:8px 10px!important;font-size:12px!important;font-weight:700!important;background:#1767cf!important;color:#fff!important;border:1px solid #1767cf!important}
.mv-active-actions-v16265 button.secondary{background:#fff!important;color:#17324d!important;border-color:#cfd8e5!important}
@media(max-width:700px){#routeEmbeddedMapV133{height:285px!important;min-height:285px!important}.route-map-head-v133{padding:8px 10px!important}.mv-map-summary-v16230{padding:8px 10px!important}.mv-active-actions-v16265{grid-template-columns:1fr!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.65 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.65: route map tile integrity and active-trip actions installed');
