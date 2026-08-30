const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.77: single-owner route selection and persistent map instance.
(function(){
  globalThis.mvStableRouteControllerV16277=true;
  const byId=id=>document.getElementById(id);
  const clean=arr=>(arr||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
  const seconds=v=>Number(String(v||'0').replace('s',''))||0;
  const duration=v=>{const m=Math.round(seconds(v)/60),h=Math.floor(m/60);return h?(h+'h '+String(m%60).padStart(2,'0')+'min'):(m+' min')};
  const distance=v=>(Number(v||0)/1000).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+' km';
  let map=null,layers=null,loadToken=0,activeIndex=-1,lastTouchAt=0;
  function decode(str){
    if(!str)return[];let i=0,lat=0,lng=0,out=[];
    while(i<str.length){let b,shift=0,result=0;do{b=str.charCodeAt(i++)-63;result|=(b&31)<<shift;shift+=5}while(b>=32&&i<=str.length);lat+=result&1?~(result>>1):(result>>1);shift=0;result=0;do{b=str.charCodeAt(i++)-63;result|=(b&31)<<shift;shift+=5}while(b>=32&&i<=str.length);lng+=result&1?~(result>>1):(result>>1);out.push([lat/1e5,lng/1e5])}
    return out;
  }
  function coords(o){
    const outbound=o?.item?.outbound||o?.item||{},ret=o?.item?.returnRoute;
    const out=decode(outbound.polyline),back=o?.round?(o.sameWayReturn?[...out].reverse():decode(ret?.polyline)):[];
    return {out,back,all:[...out,...back]};
  }
  function markerPoints(o,c){
    const legs=(o?.item?.outbound||o?.item||{}).legs||[],points=[];
    const loc=x=>{const a=Number(x?.latitude),b=Number(x?.longitude);return Number.isFinite(a)&&Number.isFinite(b)&&a&&b?[a,b]:null};
    if(legs.length){const start=loc(legs[0]?.startLocation);if(start)points.push({p:start,label:'A',title:'Origem'});legs.forEach((leg,i)=>{const p=loc(leg.endLocation);if(p)points.push({p,label:i===legs.length-1?'D':String(i+1),title:i===legs.length-1?'Destino':'Parada '+(i+1)})})}
    if(!points.length&&c.out.length){const stops=clean(o.stops);points.push({p:c.out[0],label:'A',title:'Origem'});stops.forEach((_,i)=>{const k=Math.round((i+1)*(c.out.length-1)/(stops.length+1));points.push({p:c.out[k],label:String(i+1),title:'Parada '+(i+1)})});points.push({p:c.out[c.out.length-1],label:'D',title:'Destino'})}
    return points;
  }
  function fallback(box,o,c){
    if(!c.all.length){box.innerHTML='<div class="route-map-empty-v133">O Google não retornou o desenho desta rota.</div>';return}
    const xs=c.all.map(p=>p[1]),ys=c.all.map(p=>p[0]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),pad=24,w=640,h=330;
    const project=p=>[pad+(p[1]-minX)/(maxX-minX||1)*(w-pad*2),h-pad-(p[0]-minY)/(maxY-minY||1)*(h-pad*2)];
    const line=a=>a.map(p=>project(p).map(n=>n.toFixed(1)).join(',')).join(' '),marks=markerPoints(o,c).map(x=>{const [px,py]=project(x.p);return '<g><circle cx="'+px+'" cy="'+py+'" r="12"/><text x="'+px+'" y="'+(py+4)+'">'+x.label+'</text></g>'}).join('');
    box.innerHTML='<svg class="mv-route-fallback77" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Mapa do percurso"><polyline class="out" points="'+line(c.out)+'"/>'+(c.back.length?'<polyline class="back" points="'+line(c.back)+'"/>':'')+marks+'</svg>';
  }
  function addLayers(L,o,c){
    layers.clearLayers();
    if(c.out.length)L.polyline(c.out,{weight:7,opacity:.92,color:'#1767cf',lineCap:'round'}).addTo(layers);
    if(c.back.length)L.polyline(c.back,{weight:5,opacity:.92,color:o.sameWayReturn?'#18a36b':'#f28c28',dashArray:o.sameWayReturn?'9 7':null,lineCap:'round'}).addTo(layers);
    markerPoints(o,c).forEach(x=>L.circleMarker(x.p,{radius:10,weight:3,color:'#fff',fillColor:x.label==='D'?'#e14b4b':'#1767cf',fillOpacity:1}).bindTooltip(x.title).addTo(layers));
    const bounds=L.latLngBounds(c.all);if(bounds.isValid())map.fitBounds(bounds,{padding:[22,22],animate:false});requestAnimationFrame(()=>map?.invalidateSize({animate:false}));
  }
  async function enhance(box,o,c,token){
    try{const L=await loadLeafletV133();if(token!==loadToken||!box.isConnected)return;if(!map){box.replaceChildren();map=L.map(box,{zoomControl:true,attributionControl:true,preferCanvas:true});L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);layers=L.layerGroup().addTo(map)}addLayers(L,o,c)}catch(_){/* instant SVG remains usable */}
  }
  function draw(o){
    const box=byId('routeEmbeddedMapV133'),st=byId('routeMapStatusV133');if(!box||!o)return;
    const token=++loadToken,c=coords(o),num=o.sameWayReturn?'Retorno pelo mesmo caminho':('Opção '+(Number(o.routeVariant||0)+1));
    if(map)addLayers(globalThis.L,o,c);else{fallback(box,o,c);enhance(box,o,c,token)}
    if(st)st.textContent=num+' · '+clean(o.stops).length+' parada'+(clean(o.stops).length===1?'':'s')+(o.round?' · ida e volta':'');
    globalThis.mvLastMapRouteV16275={variant:o.routeVariant??0,sameWay:!!o.sameWayReturn,points:c.all.length};
  }
  function choose(i){
    const opts=globalThis.mvRouteOptionsV16272||[],o=opts[i];if(!o||i===activeIndex&&globalThis.mvSelectedRouteV16272===o)return;
    activeIndex=i;globalThis.mvSelectedRouteV16272=o;globalThis.mvChosenStopOrderV16270=[...clean(o.stops)];
    document.querySelectorAll('#routePlanResultsV131 [data-route72],#routePlanResultsV131 [data-route74]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.route72??b.dataset.route74)===i));draw(o);
  }
  function ensureSameWay(box,opts){
    let same=opts.find(x=>x.sameWayReturn);const base=opts[0],out=base?.item?.outbound||base?.item;
    if(!same&&base?.round&&out){const item={...base.item,distanceMeters:Number(out.distanceMeters||0)*2,duration:String(seconds(out.duration)*2)+'s',tollTotalBRL:Number(out.tollTotalBRL||0)*2,hasTolls:!!out.hasTolls,outbound:out,returnRoute:{...out,reverseOfOutbound:true}};same={...base,label:'Retornar pelo mesmo caminho',best:false,item,sameWayReturn:true,routeVariant:99};opts.push(same)}
    if(!same||box.querySelector('[data-route74]'))return;
    const source=box.querySelector('[data-route72]'),button=source?.cloneNode(true);if(!button)return;
    button.removeAttribute('data-route72');button.dataset.route74=String(opts.indexOf(same));button.classList.add('mv-sameway74');button.classList.remove('selected');
    const title=button.querySelector('.route-choice-head-v131 b'),time=button.querySelector('.route-choice-head-v131 span'),km=button.querySelector('.route-choice-metrics-v131 strong'),small=button.querySelector('small'),em=button.querySelector('em');
    if(title)title.textContent='↩ Retornar pelo mesmo caminho';if(time)time.textContent=duration(same.item.duration);if(km)km.textContent=distance(same.item.distanceMeters);if(small)small.textContent=[same.origin,...clean(same.stops),same.destination,same.origin].join(' → ');if(em)em.textContent='Ida escolhida + retorno pelo trajeto inverso';
    box.querySelector('#routeMapWrapV133')?.insertAdjacentElement('beforebegin',button);
  }
  function card(e){return e.target.closest?.('#routePlanResultsV131 [data-route72],#routePlanResultsV131 [data-route74]')}
  document.addEventListener('pointerup',e=>{const b=card(e);if(!b)return;lastTouchAt=Date.now();e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();choose(Number(b.dataset.route72??b.dataset.route74))},true);
  document.addEventListener('click',e=>{const b=card(e);if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(Date.now()-lastTouchAt<500)return;choose(Number(b.dataset.route72??b.dataset.route74))},true);
  function sync(){
    const box=byId('routePlanResultsV131'),opts=globalThis.mvRouteOptionsV16272;if(!box||!Array.isArray(opts)||!opts.length)return;
    ensureSameWay(box,opts);
    [...box.querySelectorAll('[data-route72]')].forEach((b,n)=>{if(n<3)b.style.removeProperty('display');else b.style.setProperty('display','none','important')});
    const idx=opts.indexOf(globalThis.mvSelectedRouteV16272);if(activeIndex<0||idx<0||!byId('routeEmbeddedMapV133')?.children.length)choose(idx>=0&&idx<3?idx:0);
  }
  globalThis.mvChooseRouteV16275=choose;globalThis.mvChooseRouteV16277=choose;
  [0,100,300,700,1400].forEach(ms=>setTimeout(sync,ms));
  const results=byId('routePlanResultsV131')||document.body;let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;sync()})}).observe(results,{childList:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.77 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
#mvGoogleRouteFrameV16270,#mvGoogleRouteFrameV16272,#mvGoogleRouteFrameV16274,#mvGoogleRouteFrameV16275{display:none!important}
#routeEmbeddedMapV133{touch-action:pan-x pan-y!important;contain:layout paint!important}
.mv-route-fallback77{display:block;width:100%;height:100%;background:linear-gradient(135deg,#eef3f8,#f9fbfd)}.mv-route-fallback77 polyline{fill:none;stroke-linecap:round;stroke-linejoin:round}.mv-route-fallback77 .out{stroke:#1767cf;stroke-width:7}.mv-route-fallback77 .back{stroke:#18a36b;stroke-width:5;stroke-dasharray:10 7}.mv-route-fallback77 circle{fill:#1767cf;stroke:#fff;stroke-width:3}.mv-route-fallback77 text{fill:#fff;font:700 11px Arial;text-anchor:middle}
`;
if(!s.includes('</style>'))throw new Error('v162.77 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.77: one route controller and persistent map layers active');
