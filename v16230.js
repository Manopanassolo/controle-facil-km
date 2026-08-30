const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.30: make the embedded route map always show route information, stops and a resilient basemap.
(function(){
  try{
    const escTxt=x=>String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    function currentStops(){try{return (globalThis.preTripStopsV127||[]).map(x=>x?.place_name).filter(Boolean)}catch{return []}}
    function summaryHtml(item,index){
      const o=document.getElementById('origem')?.value?.trim()||'Origem';
      const d=document.getElementById('destino')?.value?.trim()||'Destino';
      const stops=currentStops();
      const km=(Number(item?.distanceMeters||0)/1000).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1});
      const dur=typeof fmtDurV131==='function'?fmtDurV131(item?.duration):String(item?.duration||'');
      const via=stops.length?stops.map((x,i)=>'<div><b>Parada '+(i+1)+'</b><span>'+escTxt(x)+'</span></div>').join(''):'<div class="muted">Sem paradas intermediárias</div>';
      return '<div class="mv-map-summary-v16230"><div class="mv-map-route-v16230"><div><b>Origem</b><span>'+escTxt(o)+'</span></div>'+via+'<div><b>Destino</b><span>'+escTxt(d)+'</span></div></div><div class="mv-map-metrics-v16230"><strong>'+(index===0?'Rota recomendada':'Alternativa '+index)+'</strong><span>'+km+' km · '+escTxt(dur)+'</span></div></div>';
    }
    function addMarkers(L,map,item,pts){
      const labels=['Origem',...currentStops().map((_,i)=>'Parada '+(i+1)),'Destino'];
      const locs=[];
      const legs=Array.isArray(item?.legs)?item.legs:[];
      if(legs[0]?.startLocation)locs.push(legs[0].startLocation);
      legs.forEach(l=>{if(l?.endLocation)locs.push(l.endLocation)});
      const valid=locs.map(x=>[Number(x.latitude),Number(x.longitude)]).filter(x=>Number.isFinite(x[0])&&Number.isFinite(x[1])&&(x[0]||x[1]));
      if(valid.length){valid.forEach((p,i)=>L.marker(p).addTo(map).bindTooltip(labels[i]||('Ponto '+(i+1)),{permanent:false}));return}
      if(pts.length){L.marker(pts[0]).addTo(map).bindTooltip('Origem');L.marker(pts[pts.length-1]).addTo(map).bindTooltip('Destino')}
    }
    async function resilientMap(item,index=0){
      const box=document.getElementById('routeEmbeddedMapV133'),statusEl=document.getElementById('routeMapStatusV133');if(!box)return;
      const wrap=document.getElementById('routeMapWrapV133');if(wrap){let info=wrap.querySelector('.mv-map-summary-v16230');if(info)info.remove();wrap.insertAdjacentHTML('afterbegin',summaryHtml(item,index))}
      if(!item?.polyline){box.innerHTML='<div class="route-map-empty-v133"><b>Rota calculada, mas sem desenho retornado pelo Google.</b><span>Use “Abrir mapa real da rota” abaixo para visualizar no Google Maps.</span></div>';if(statusEl)statusEl.textContent='Rota sem polyline';return}
      if(statusEl)statusEl.textContent='Carregando mapa e pontos da rota...';
      try{
        const L=await loadLeafletV133(),pts=decodePolylineV133(item.polyline);if(!pts.length)throw new Error('Percurso sem coordenadas');
        if(routeMapV133){routeMapV133.remove();routeMapV133=null;routeLayerV133=null}
        box.innerHTML='';routeMapV133=L.map(box,{zoomControl:true,attributionControl:true});
        let fallbackUsed=false;
        const primary=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(routeMapV133);
        let tileErrors=0;primary.on('tileerror',()=>{tileErrors++;if(tileErrors>=2&&!fallbackUsed){fallbackUsed=true;try{routeMapV133.removeLayer(primary)}catch(_){};L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:20,attribution:'© OpenStreetMap © CARTO'}).addTo(routeMapV133)}});
        routeLayerV133=L.polyline(pts,{weight:6,opacity:.9}).addTo(routeMapV133);addMarkers(L,routeMapV133,item,pts);
        routeMapV133.fitBounds(routeLayerV133.getBounds(),{padding:[22,22]});setTimeout(()=>routeMapV133?.invalidateSize(),100);setTimeout(()=>routeMapV133?.invalidateSize(),600);
        if(statusEl)statusEl.textContent=(index===0?'Rota recomendada':'Alternativa '+index)+' · '+(typeof fmtKmV131==='function'?fmtKmV131(item.distanceMeters):'')+' · '+(typeof fmtDurV131==='function'?fmtDurV131(item.duration):'');
      }catch(e){box.innerHTML='<div class="route-map-empty-v133"><b>Mapa visual indisponível.</b><span>'+escTxt(e?.message||'Falha ao carregar mapa')+'</span><span>A rota, distância, paradas e abertura no Google Maps continuam disponíveis.</span></div>';if(statusEl)statusEl.textContent='Mapa visual indisponível'}
    }
    try{if(typeof renderEmbeddedMapV133==='function')renderEmbeddedMapV133=resilientMap}catch(e){console.error('v162.30 map hook skipped',e)}
  }catch(e){console.error('v162.30 startup skipped',e)}
})();
`;
if(!s.includes('carga();'))throw new Error('v162.30 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.30 route map information */
.mv-map-summary-v16230{padding:10px 12px;border-bottom:1px solid #e5e9f0;background:#fff;display:grid;gap:9px}.mv-map-route-v16230{display:grid;gap:6px}.mv-map-route-v16230>div{display:grid;grid-template-columns:72px 1fr;gap:8px;align-items:start}.mv-map-route-v16230 b{font-size:10px;color:#17324d}.mv-map-route-v16230 span{font-size:11px;color:#475467;word-break:break-word}.mv-map-metrics-v16230{display:flex;justify-content:space-between;gap:10px;padding-top:7px;border-top:1px dashed #e4e7ec}.mv-map-metrics-v16230 strong{font-size:11px}.mv-map-metrics-v16230 span{font-size:10.5px;color:#667085}.route-map-empty-v133{display:flex!important;flex-direction:column;gap:6px}.route-map-empty-v133 b{color:#17324d}
`;
if(!s.includes('</style>'))throw new Error('v162.30 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.30: route map now shows route summary, stops, markers and resilient tiles');
