const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.75: force the selected Google Routes alternative into the embedded Google map.
(function(){
  const byId=id=>document.getElementById(id);
  const clean=arr=>(arr||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
  function decode(str){
    if(!str)return[];let i=0,lat=0,lng=0,out=[];
    while(i<str.length){let b,shift=0,result=0;do{b=str.charCodeAt(i++)-63;result|=(b&31)<<shift;shift+=5}while(b>=32&&i<=str.length);lat+=result&1?~(result>>1):(result>>1);shift=0;result=0;do{b=str.charCodeAt(i++)-63;result|=(b&31)<<shift;shift+=5}while(b>=32&&i<=str.length);lng+=result&1?~(result>>1):(result>>1);out.push([lat/1e5,lng/1e5])}
    return out;
  }
  function sample(points,max=4){if(!points||points.length<3)return[];const out=[];for(let n=1;n<=max;n++){const idx=Math.round(n*(points.length-1)/(max+1));if(idx>0&&idx<points.length-1&&!out.some(p=>p[0]===points[idx][0]&&p[1]===points[idx][1]))out.push(points[idx])}return out}
  const coord=p=>Number(p[0]).toFixed(5)+','+Number(p[1]).toFixed(5);
  function forcedPoints(o){
    const stops=clean(o.stops),item=o.item||{},outbound=item.outbound||item;
    if(!o.round){const via=stops.length?[]:sample(decode(outbound.polyline),4);return [...via,...stops,o.destination]}
    let ret=item.returnRoute||null,retPts=[];
    if(o.sameWayReturn){retPts=decode(outbound.polyline).reverse()}else if(ret?.polyline){retPts=decode(ret.polyline)}
    return [...stops,o.destination,...sample(retPts,5),o.origin];
  }
  function mapUrl(o){
    const pts=forcedPoints(o).filter(Boolean).map(x=>Array.isArray(x)?coord(x):x);
    return 'https://maps.google.com/maps?output=embed&hl=pt-BR&dirflg=d&saddr='+encodeURIComponent(o.origin)+'&daddr='+encodeURIComponent(pts.join(' to: '))+'&mvsel='+encodeURIComponent(String(o.routeVariant??0)+(o.sameWayReturn?'-same':'-google'))+'&t='+Date.now();
  }
  function draw(o){
    const box=byId('routeEmbeddedMapV133'),st=byId('routeMapStatusV133');if(!box||!o)return;
    box.innerHTML='';const f=document.createElement('iframe');f.id='mvGoogleRouteFrameV16275';f.title='Percurso selecionado no Google Maps';f.loading='eager';f.referrerPolicy='no-referrer-when-downgrade';f.allowFullscreen=true;f.setAttribute('allow','geolocation');f.src=mapUrl(o);box.appendChild(f);
    const num=o.sameWayReturn?'retorno pelo mesmo caminho':('opção '+(Number(o.routeVariant||0)+1));if(st)st.textContent='Google Maps · '+num;
    globalThis.mvLastMapRouteV16275={variant:o.routeVariant??0,sameWay:!!o.sameWayReturn,url:f.src};
  }
  function choose(i){
    const opts=globalThis.mvRouteOptionsV16272||[],o=opts[i];if(!o)return;
    globalThis.mvSelectedRouteV16272=o;globalThis.mvChosenStopOrderV16270=[...clean(o.stops)];
    document.querySelectorAll('#routePlanResultsV131 [data-route72],#routePlanResultsV131 [data-route74]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.route72??b.dataset.route74)===i));draw(o);
  }
  document.addEventListener('click',e=>{const b=e.target.closest?.('#routePlanResultsV131 [data-route72],#routePlanResultsV131 [data-route74]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();choose(Number(b.dataset.route72??b.dataset.route74))},true);
  function sync(){
    const box=byId('routePlanResultsV131'),opts=globalThis.mvRouteOptionsV16272;if(!box||!Array.isArray(opts)||!opts.length)return;
    byId('mvPlannerModesV16273')?.remove();byId('mvPlannerHintV16273')?.remove();byId('mvCustomPlannerV16273')?.remove();
    const selected=globalThis.mvSelectedRouteV16272,idx=Math.max(0,opts.indexOf(selected));if(!byId('mvGoogleRouteFrameV16275'))choose(idx);
  }
  globalThis.mvRouteMapUrlV16275=mapUrl;globalThis.mvChooseRouteV16275=choose;
  [0,200,500,1000,1800,3000].forEach(ms=>setTimeout(sync,ms));new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.documentElement,{subtree:true,childList:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.75 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`#mvGoogleRouteFrameV16275{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#eef2f7!important}`;
if(!s.includes('</style>'))throw new Error('v162.75 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.75: selected route now forces matching Google map path');
