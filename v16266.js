const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.66: ensure the computed route polyline is visibly rendered above tiles and reconcile stale active trips.
(function(){
  function strengthenRoute(){
    try{
      if(typeof routeLayerV133!=='undefined'&&routeLayerV133?.setStyle){
        routeLayerV133.setStyle({color:'#0b57d0',weight:8,opacity:1,lineCap:'round',lineJoin:'round'});
        routeLayerV133.bringToFront?.();
      }
      const svg=document.querySelector('#routeEmbeddedMapV133 .leaflet-overlay-pane svg');
      if(svg){svg.style.setProperty('z-index','450','important');svg.style.setProperty('pointer-events','none','important')}
      document.querySelectorAll('#routeEmbeddedMapV133 .leaflet-overlay-pane path').forEach(p=>{
        p.style.setProperty('stroke','#0b57d0','important');
        p.style.setProperty('stroke-width','8','important');
        p.style.setProperty('stroke-opacity','1','important');
        p.style.setProperty('fill','none','important');
        p.style.setProperty('stroke-linecap','round','important');
        p.style.setProperty('stroke-linejoin','round','important');
      });
      if(typeof routeMapV133!=='undefined'&&routeMapV133&&typeof routeLayerV133!=='undefined'&&routeLayerV133?.getBounds?.().isValid?.()){
        routeMapV133.invalidateSize({pan:false});
        routeMapV133.fitBounds(routeLayerV133.getBounds(),{padding:[24,24],maxZoom:12});
      }
    }catch(e){console.error('v162.66 route strengthen',e)}
  }
  async function reconcileActive(){
    try{
      if(!globalThis.activeTrip?.id||!globalThis.sb)return;
      const r=await sb.from('km_trips').select('id,status').eq('id',activeTrip.id).maybeSingle();
      if(!r?.data){globalThis.activeTrip=null;try{localStorage.removeItem('km_active_trip')}catch(_){};try{await refreshAll?.()}catch(_){};try{render?.()}catch(_){}}
    }catch(e){console.error('v162.66 active reconcile',e)}
  }
  const mo=new MutationObserver(()=>{if(document.getElementById('routeEmbeddedMapV133'))requestAnimationFrame(strengthenRoute)});
  try{mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']})}catch(_){ }
  [0,120,350,800,1500,2800].forEach(ms=>setTimeout(strengthenRoute,ms));
  [400,1400,3000].forEach(ms=>setTimeout(reconcileActive,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.66 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.66 route polyline visibility + selected route contrast */
#routeEmbeddedMapV133 .leaflet-tile-pane{z-index:200!important}
#routeEmbeddedMapV133 .leaflet-overlay-pane{z-index:450!important;pointer-events:none!important}
#routeEmbeddedMapV133 .leaflet-shadow-pane{z-index:500!important}
#routeEmbeddedMapV133 .leaflet-marker-pane{z-index:600!important}
#routeEmbeddedMapV133 .leaflet-tooltip-pane{z-index:650!important}
#routeEmbeddedMapV133 .leaflet-popup-pane{z-index:700!important}
#routeEmbeddedMapV133 .leaflet-overlay-pane svg{overflow:visible!important;pointer-events:none!important}
#routeEmbeddedMapV133 .leaflet-overlay-pane path{stroke:#0b57d0!important;stroke-width:8px!important;stroke-opacity:1!important;fill:none!important;stroke-linecap:round!important;stroke-linejoin:round!important;filter:drop-shadow(0 0 1px #fff)!important}
#routePlanResultsV131 .route-choice-v131.selected{background:#1767cf!important;border-color:#123b74!important;color:#fff!important}
#routePlanResultsV131 .route-choice-v131.selected b,
#routePlanResultsV131 .route-choice-v131.selected strong,
#routePlanResultsV131 .route-choice-v131.selected span,
#routePlanResultsV131 .route-choice-v131.selected small{color:#fff!important;opacity:1!important}
#routePlanResultsV131 .route-choice-v131.selected .route-choice-head-v131 span,
#routePlanResultsV131 .route-choice-v131.selected .route-choice-metrics-v131 span{color:#f5f9ff!important}
`;
if(!s.includes('</style>'))throw new Error('v162.66 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.66: visible route polyline, readable selected route card and stale active-trip reconciliation installed');
