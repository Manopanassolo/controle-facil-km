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
    try{const r=await nativeFetch(input,init);const type=String(r.headers.get('content-type')||'').toLowerCase();if(type.includes('application/json'))return r}catch(_){}
    return nativeFetch(WORKER+u.pathname+u.search,{...(init||{}),cache:'no-store',mode:'cors'});
  };
  window.mvApiAuthorityV16346={worker:WORKER,paths:['/api/places','/api/routes']};

  function ensureWebPlanner(){
    if(innerWidth<900)return;
    const stack=document.getElementById('directRouteStackV127');if(!stack)return;
    let btn=document.getElementById('mvPlanRouteWeb16346');
    if(!btn){btn=document.createElement('button');btn.id='mvPlanRouteWeb16346';btn.type='button';btn.textContent='🧭 Planejar rota e custos';btn.className='pri mv-btn85 mv-button86';stack.insertAdjacentElement('afterend',btn)}
    btn.style.cssText='display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;min-height:48px!important;margin:10px 0 14px!important;background:#1767cf!important;color:#fff!important;border:0!important;border-radius:6px!important;font-weight:800!important;font-size:14px!important;pointer-events:auto!important';
    if(!btn.dataset.mvReady16346){btn.dataset.mvReady16346='1';btn.onclick=async e=>{e.preventDefault();e.stopPropagation();if(typeof globalThis.planRouteV131!=='function'){try{globalThis.msg?.('Planejador de rota não carregado',true)}catch(_){}return}btn.disabled=true;const old=btn.textContent;btn.textContent='Planejando rota…';try{await globalThis.planRouteV131()}finally{btn.disabled=false;btn.textContent=old}}}
  }

  document.addEventListener('click',e=>{
    if(innerWidth>=900)return;
    const b=e.target.closest?.('[data-p],[data-p-jump],[data-page]');if(!b)return;
    const route=b.dataset.p||b.dataset.pJump||b.dataset.page;if(!route)return;
    if(typeof globalThis.show!=='function')return;
    e.preventDefault();e.stopImmediatePropagation();
    try{globalThis.show(route)}catch(_){return}
    document.body.dataset.mv53=route;document.body.dataset.mvRoute=route;
    document.body.classList.remove('km-menu-open','mv-menu-open-v16282');
  },true);

  const ID='mvDesktopHeader16346';
  const html='<div class="mv-dbrand132"><span class="mv-dmark132">M</span><span><strong>Movvant</strong><small>INTELIGÊNCIA COMERCIAL EM CAMPO</small></span></div><div id="mvDesktopTitle16346">Dashboard</div><button class="mv-dbell132" type="button" aria-label="Notificações">●</button>';
  const headerCss='display:grid!important;grid-template-columns:minmax(260px,1fr) auto minmax(260px,1fr)!important;align-items:center!important;position:fixed!important;left:0!important;right:0!important;top:0!important;height:56px!important;min-height:56px!important;max-height:56px!important;padding:0 24px!important;margin:0!important;background:#082b50!important;color:#fff!important;visibility:visible!important;opacity:1!important;z-index:2147483647!important;box-sizing:border-box!important;border:0!important;border-bottom:1px solid #17446f!important;box-shadow:0 1px 5px rgba(8,32,58,.16)!important;transform:none!important;clip:auto!important;clip-path:none!important;pointer-events:auto!important';
  function ensureHeader(){
    for(const oldId of ['mvDesktopHeader132','mvDesktopHeader143','mvDesktopHeader144']){const old=document.getElementById(oldId);if(old)old.remove()}
    let h=document.getElementById(ID);
    if(innerWidth<900){if(h)h.remove();return}
    if(!h){h=document.createElement('div');h.id=ID;h.setAttribute('role','banner');h.innerHTML=html;document.body.prepend(h)}
    h.removeAttribute('hidden');h.className='';h.style.cssText=headerCss;
    ensureWebPlanner();
  }
  let busy=false;function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;ensureHeader()})}
  ensureHeader();
  new MutationObserver(schedule).observe(document.body||document.documentElement,{subtree:true,childList:true});
  addEventListener('pageshow',ensureHeader,true);addEventListener('resize',ensureHeader);addEventListener('popstate',ensureHeader);
  setInterval(ensureHeader,1000);
})();
`;
if(!s.includes('</body>'))throw new Error('v163.46 body anchor not found');
s=s.replace('</body>','<script id="mvRuntime16346">'+js.replace(/<\/script>/g,'<\\/script>')+'</script>\n</body>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.46 web API authority, planner, stable header and canonical mobile navigation installed');
