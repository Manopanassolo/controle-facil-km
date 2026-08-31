const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
  const WORKER='https://movvant.panassolofilho.workers.dev';
  const nativeFetch=window.fetch.bind(window);
  function isApiPath(path){return path==='/api/places'||path==='/api/routes'}
  window.fetch=async function(input,init){
    const raw=typeof input==='string'?input:(input&&input.url)||'';
    let u;try{u=new URL(raw,location.href)}catch(_){return nativeFetch(input,init)}
    if(!isApiPath(u.pathname)||location.hostname.endsWith('workers.dev'))return nativeFetch(input,init);
    try{
      const r=await nativeFetch(input,init);
      const type=String(r.headers.get('content-type')||'').toLowerCase();
      if(type.includes('application/json'))return r;
    }catch(_){ }
    return nativeFetch(WORKER+u.pathname+u.search,{...(init||{}),cache:'no-store',mode:'cors'});
  };
  window.mvApiAuthorityV16346={worker:WORKER,paths:['/api/places','/api/routes']};

  const ID='mvDesktopHeader144';
  const html='<div class="mv-dbrand132"><span class="mv-dmark132">M</span><span><strong>Movvant</strong><small>INTELIGÊNCIA COMERCIAL EM CAMPO</small></span></div><div id="mvDesktopTitle144">Dashboard</div><button class="mv-dbell132" type="button" aria-label="Notificações">●</button>';
  let busy=false;
  function ensureHeader(){
    if(innerWidth<900)return;
    let h=document.getElementById(ID);
    if(!h){h=document.createElement('header');h.id=ID;h.className='mv-desktop-header144';h.innerHTML=html;document.body.prepend(h)}
    h.style.cssText='display:grid!important;grid-template-columns:minmax(260px,1fr) auto minmax(260px,1fr)!important;align-items:center!important;position:fixed!important;left:0!important;right:0!important;top:0!important;height:56px!important;padding:0 24px!important;background:#082b50!important;color:#fff!important;visibility:visible!important;opacity:1!important;z-index:2147483647!important;box-sizing:border-box!important;border-bottom:1px solid #17446f!important;box-shadow:0 1px 5px rgba(8,32,58,.16)!important';
    for(const oldId of ['mvDesktopHeader132','mvDesktopHeader143']){const old=document.getElementById(oldId);if(old&&old!==h)old.style.setProperty('display','none','important')}
  }
  function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;ensureHeader()})}
  ensureHeader();
  const root=document.body||document.documentElement;
  new MutationObserver(schedule).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('pageshow',ensureHeader,true);addEventListener('resize',ensureHeader);addEventListener('popstate',ensureHeader);
  setInterval(ensureHeader,1500);
})();
`;
if(!s.includes('</body>'))throw new Error('v163.46 body anchor not found');
s=s.replace('</body>','<script id="mvRuntime16346">'+js.replace(/<\/script>/g,'<\\/script>')+'</script>\n</body>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.46 web API authority and persistent desktop header installed');
