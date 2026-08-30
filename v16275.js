const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.76: keep one Google Maps iframe alive and switch route options without render races.
(function(){
  const byId=id=>document.getElementById(id);
  const clean=arr=>(arr||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
  let mapTimer=0,mapSeq=0,choosing=false;
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
    return 'https://maps.google.com/maps?output=embed&hl=pt-BR&dirflg=d&saddr='+encodeURIComponent(o.origin)+'&daddr='+encodeURIComponent(pts.join(' to: '))+'&mvsel='+encodeURIComponent(String(o.routeVariant??0)+(o.sameWayReturn?'-same':'-google'));
  }
  function ensureFrame(){
    const box=byId('routeEmbeddedMapV133');if(!box)return null;
    let f=byId('mvGoogleRouteFrameV16275');
    if(!f){
      f=document.createElement('iframe');f.id='mvGoogleRouteFrameV16275';f.title='Percurso selecionado no Google Maps';f.loading='eager';f.referrerPolicy='no-referrer-when-downgrade';f.allowFullscreen=true;f.setAttribute('allow','geolocation');box.replaceChildren(f);
    }else if(f.parentElement!==box){box.replaceChildren(f)}
    return f;
  }
  function draw(o){
    const f=ensureFrame(),st=byId('routeMapStatusV133');if(!f||!o)return;
    const seq=++mapSeq,url=mapUrl(o),num=o.sameWayReturn?'retorno pelo mesmo caminho':('opção '+(Number(o.routeVariant||0)+1));
    if(st)st.textContent='Google Maps · carregando '+num+'…';
    clearTimeout(mapTimer);
    mapTimer=setTimeout(()=>{
      if(seq!==mapSeq)return;
      const current=f.dataset.mvRouteUrl||'';
      f.dataset.mvRouteUrl=url;
      if(current!==url)f.src=url;
      if(st)st.textContent='Google Maps · '+num;
      globalThis.mvLastMapRouteV16275={variant:o.routeVariant??0,sameWay:!!o.sameWayReturn,url};
    },90);
  }
  function choose(i){
    if(choosing)return;
    const opts=globalThis.mvRouteOptionsV16272||[],o=opts[i];if(!o)return;
    choosing=true;
    try{
      globalThis.mvSelectedRouteV16272=o;globalThis.mvChosenStopOrderV16270=[...clean(o.stops)];
      document.querySelectorAll('#routePlanResultsV131 [data-route72],#routePlanResultsV131 [data-route74]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.route72??b.dataset.route74)===i));
      draw(o);
    }finally{queueMicrotask(()=>{choosing=false})}
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('#routePlanResultsV131 [data-route72],#routePlanResultsV131 [data-route74]');if(!b)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();choose(Number(b.dataset.route72??b.dataset.route74));
  },true);
  function sync(){
    const box=byId('routePlanResultsV131'),opts=globalThis.mvRouteOptionsV16272;if(!box||!Array.isArray(opts)||!opts.length)return;
    byId('mvPlannerModesV16273')?.remove();byId('mvPlannerHintV16273')?.remove();byId('mvCustomPlannerV16273')?.remove();
    [...box.querySelectorAll('[data-route72]')].forEach((b,n)=>{if(n<3)b.style.removeProperty('display');else b.style.setProperty('display','none','important')});
    const selected=globalThis.mvSelectedRouteV16272,idx=Math.max(0,opts.indexOf(selected));
    if(!byId('mvGoogleRouteFrameV16275'))choose(idx<3?idx:0);
  }
  globalThis.mvRouteMapUrlV16275=mapUrl;globalThis.mvChooseRouteV16275=choose;
  [0,200,500,1000,1800,3000].forEach(ms=>setTimeout(sync,ms));
  const root=byId('routePlanResultsV131')||document.body;
  new MutationObserver(()=>requestAnimationFrame(sync)).observe(root,{subtree:true,childList:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.76 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`#mvGoogleRouteFrameV16275{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#eef2f7!important}`;
if(!s.includes('</style>'))throw new Error('v162.76 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.76: route switching keeps one map iframe and avoids render races');
