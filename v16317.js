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

  function enforceMobilePage(route){
    if(innerWidth>=900||!route)return false;
    const target=document.getElementById('p-'+route);if(!target)return false;
    document.querySelectorAll('#app>[id^="p-"]').forEach(page=>{
      const active=page===target;
      page.classList.toggle('hide',!active);
      if(active){
        page.removeAttribute('hidden');
        page.style.setProperty('display','block','important');
        page.style.setProperty('visibility','visible','important');
        page.style.setProperty('opacity','1','important');
        page.style.setProperty('pointer-events','auto','important');
      }else{
        page.style.setProperty('display','none','important');
      }
    });
    return true;
  }

  function canonicalMobileNavigate(route){
    if(innerWidth>=900||!route)return false;
    if(route==='viagem'&&typeof globalThis.mvTripLockArm==='function'){
      try{globalThis.mvTripLockArm()}catch(_){}
    }
    let ok=false;
    try{
      if(typeof globalThis.mvWindowNavigationV16307?.activate==='function'){
        globalThis.mvWindowNavigationV16307.activate(route);ok=true;
      }else if(typeof globalThis.mvNavigationV16282?.navigate==='function'){
        globalThis.mvNavigationV16282.navigate(route);ok=true;
      }
    }catch(_){ok=false}
    document.body.dataset.mv53=route;document.body.dataset.mvRoute=route;
    document.body.classList.remove('km-menu-open','mv-menu-open-v16282');
    ok=enforceMobilePage(route)||ok;
    requestAnimationFrame(()=>enforceMobilePage(route));
    setTimeout(()=>enforceMobilePage(route),80);
    setTimeout(()=>enforceMobilePage(route),240);
    return ok;
  }
  globalThis.mvCanonicalNavigationV16346={navigate:canonicalMobileNavigate,enforce:enforceMobilePage};

  document.addEventListener('click',e=>{
    if(innerWidth>=900)return;
    const b=e.target.closest?.('[data-p],[data-p-jump],[data-page]');if(!b)return;
    const route=b.dataset.p||b.dataset.pJump||b.dataset.page;if(!route)return;
    if(!canonicalMobileNavigate(route))return;
    e.preventDefault();e.stopImmediatePropagation();
  },true);

  const menuGroups=[
    {label:'Visão geral',items:[['inicio','Dashboard'],['painel','Painel ADM'],['relatorios','Relatórios']]},
    {label:'Operação',items:[['viagem','Novo percurso'],['historico','Viagens'],['rotas','Rotas'],['agenda','Agenda']]},
    {label:'Gestão',items:[['veiculos','Frota'],['equipe','Equipe'],['custos','Despesas']]},
    {label:'Sistema',items:[['notificacoes','Avisos'],['auditoria','Auditoria'],['backup','Backup'],['config','Configurações'],['perfil','Meu perfil'],['ajuda','Ajuda']]}
  ];
  function menuMarkup(){return '<div class="mv-navgroups140">'+menuGroups.map((g,i)=>'<div class="mv-menugroup140"><button class="mv-menutrigger140" type="button" data-mvgroup="'+i+'">'+g.label+' <span>▾</span></button><div class="mv-submenu140">'+g.items.map(x=>'<button type="button" data-mvroute="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>').join('')+'</div>'}
  function desktopGo(route){
    const old=[...document.querySelectorAll('#app>.nav [data-p]')].find(b=>b.dataset.p===route);
    if(old){old.click();return true}
    try{if(typeof globalThis.mvNavigationV16282?.navigate==='function'){globalThis.mvNavigationV16282.navigate(route);return true}}catch(_){}
    return false;
  }
  function ensureApprovedDesktopMenu(){
    const old=document.getElementById('mvDesktopNav132');
    let nav=document.getElementById('mvDesktopNav16346');
    if(innerWidth<900){if(nav)nav.remove();if(old)old.style.removeProperty('display');return}
    if(old)old.style.setProperty('display','none','important');
    if(!nav){
      nav=document.createElement('nav');nav.id='mvDesktopNav16346';nav.setAttribute('aria-label','Navegação principal');nav.innerHTML=menuMarkup();document.body.appendChild(nav);
      nav.addEventListener('click',e=>{const b=e.target.closest('[data-mvroute]');if(!b)return;e.preventDefault();e.stopPropagation();desktopGo(b.dataset.mvroute)});
    }
  }

  const ID='mvDesktopHeader16346';
  const html='<div class="mv-dbrand132"><span class="mv-dmark132">M</span><span><strong>Movvant</strong><small>INTELIGÊNCIA COMERCIAL EM CAMPO</small></span></div><div id="mvDesktopTitle16346">Dashboard</div><button class="mv-dbell132" type="button" aria-label="Notificações">●</button>';
  const headerCss='display:grid!important;grid-template-columns:minmax(260px,1fr) auto minmax(260px,1fr)!important;align-items:center!important;position:fixed!important;left:0!important;right:0!important;top:0!important;height:56px!important;min-height:56px!important;max-height:56px!important;padding:0 24px!important;margin:0!important;background:#082b50!important;color:#fff!important;visibility:visible!important;opacity:1!important;z-index:2147483647!important;box-sizing:border-box!important;border:0!important;border-bottom:1px solid #17446f!important;box-shadow:0 1px 5px rgba(8,32,58,.16)!important;transform:none!important;clip:auto!important;clip-path:none!important;pointer-events:auto!important';
  function ensureHeader(){
    for(const oldId of ['mvDesktopHeader132','mvDesktopHeader143','mvDesktopHeader144']){const old=document.getElementById(oldId);if(old)old.remove()}
    let h=document.getElementById(ID);
    if(innerWidth<900){if(h)h.remove();ensureApprovedDesktopMenu();return}
    if(!h){h=document.createElement('div');h.id=ID;h.setAttribute('role','banner');h.innerHTML=html;document.body.prepend(h)}
    h.removeAttribute('hidden');h.className='';h.style.cssText=headerCss;
    ensureApprovedDesktopMenu();
    ensureWebPlanner();
  }
  let busy=false;function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;ensureHeader()})}
  ensureHeader();
  new MutationObserver(schedule).observe(document.body||document.documentElement,{subtree:true,childList:true});
  addEventListener('pageshow',ensureHeader,true);addEventListener('resize',ensureHeader);addEventListener('popstate',ensureHeader);
  setInterval(ensureHeader,1000);
})();
`;
const css=`
@media(min-width:900px){
 #mvDesktopNav132{display:none!important;visibility:hidden!important;pointer-events:none!important}
 #mvDesktopNav16346{display:flex!important;align-items:center!important;justify-content:center!important;position:fixed!important;z-index:2147483000!important;top:56px!important;left:0!important;right:0!important;height:46px!important;margin:0!important;padding:0!important;background:#fff!important;border:0!important;border-bottom:1px solid #dce3ec!important;box-shadow:none!important;overflow:visible!important}
 #mvDesktopNav16346 .mv-navgroups140{width:auto!important;min-width:520px!important;max-width:680px!important;display:grid!important;grid-template-columns:repeat(4,auto)!important;justify-content:center!important;gap:18px!important;margin:0 auto!important;padding:0 14px!important;overflow:visible!important}
 #mvDesktopNav16346 .mv-menugroup140{position:relative!important;height:30px!important;display:flex!important;align-items:center!important}
 #mvDesktopNav16346 .mv-menutrigger140{display:flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:96px!important;height:30px!important;min-height:30px!important;padding:0 12px!important;margin:0!important;border:0!important;border-radius:6px!important;background:#0c356b!important;color:#fff!important;font-size:11px!important;font-weight:750!important;line-height:1!important;white-space:nowrap!important;box-shadow:none!important}
 #mvDesktopNav16346 .mv-menutrigger140 span{font-size:9px!important;margin-left:5px!important}
 #mvDesktopNav16346 .mv-submenu140{position:absolute!important;z-index:2147483646!important;top:34px!important;left:0!important;min-width:190px!important;width:max-content!important;max-width:300px!important;background:#fff!important;border:1px solid #d9e2ec!important;border-radius:9px!important;box-shadow:0 14px 34px rgba(15,42,68,.16)!important;padding:6px!important;display:none!important}
 #mvDesktopNav16346 .mv-menugroup140:hover .mv-submenu140,#mvDesktopNav16346 .mv-menugroup140:focus-within .mv-submenu140{display:grid!important;gap:3px!important}
 #mvDesktopNav16346 .mv-menugroup140:last-child .mv-submenu140{left:auto!important;right:0!important}
 #mvDesktopNav16346 .mv-submenu140 button{display:block!important;width:100%!important;text-align:left!important;border:0!important;background:#fff!important;color:#334155!important;padding:8px 10px!important;border-radius:6px!important;font-size:11px!important;font-weight:650!important;white-space:nowrap!important;box-shadow:none!important}
 #mvDesktopNav16346 .mv-submenu140 button:hover,#mvDesktopNav16346 .mv-submenu140 button:focus{background:#edf6ff!important;color:#0867c7!important}
}
@media(max-width:899px){#mvDesktopNav16346{display:none!important}}
`;
if(!s.includes('</style>')||!s.includes('</body>'))throw new Error('v163.46 anchors not found');
s=s.replace('</style>',css+'\n</style>');
s=s.replace('</body>','<script id="mvRuntime16346">'+js.replace(/<\/script>/g,'<\\/script>')+'</script>\n</body>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.46 web API authority, planner, stable header, final approved grouped desktop menu and canonical mobile navigation installed');
