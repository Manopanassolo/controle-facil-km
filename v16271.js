const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.71: isolate the route-planning click from legacy listeners so v162.70 is the only planner executed.
(function(){
  const byId=id=>document.getElementById(id);
  function install(){
    const old=byId('routePlanBtnV131');if(!old)return;
    old.style.setProperty('display','none','important');old.setAttribute('aria-hidden','true');old.tabIndex=-1;
    let btn=byId('mvPlanRouteV16271');
    if(!btn){btn=document.createElement('button');btn.id='mvPlanRouteV16271';btn.type='button';btn.className=old.className;btn.textContent='🧭 Planejar rota e custos';old.insertAdjacentElement('afterend',btn);btn.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();if(typeof globalThis.planRouteV131!=='function')return msg('Planejador de rota não carregado',true);btn.disabled=true;try{await globalThis.planRouteV131()}finally{btn.disabled=false;btn.textContent='🧭 Planejar rota e custos'}},true)}
  }
  [0,250,800,1600,3000].forEach(ms=>setTimeout(install,ms));new MutationObserver(()=>requestAnimationFrame(install)).observe(document.documentElement,{subtree:true,childList:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.71 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`#mvPlanRouteV16271{width:100%!important;min-height:48px!important;background:#1767cf!important;color:#fff!important;border:0!important;border-radius:4px!important;font-weight:800!important;font-size:15px!important}`;
if(!s.includes('</style>'))throw new Error('v162.71 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.71: isolated route planner trigger installed');
