const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.5 isolated mobile drawer: avoids legacy nav CSS collisions
function v1625EnsureDrawer(){
  let shade=document.getElementById('movvantDrawerShadeV1625'),drawer=document.getElementById('movvantDrawerV1625');
  if(!shade){shade=document.createElement('div');shade.id='movvantDrawerShadeV1625';document.body.appendChild(shade)}
  if(!drawer){
    drawer=document.createElement('aside');drawer.id='movvantDrawerV1625';drawer.setAttribute('aria-hidden','true');
    drawer.innerHTML='<div class="mv-drawer-head-v1625"><div><b>Movvant</b><small>Inteligência comercial em campo</small></div><button type="button" id="movvantDrawerCloseV1625">×</button></div><div id="movvantDrawerItemsV1625" class="mv-drawer-items-v1625"></div>';
    document.body.appendChild(drawer);
  }
  const items=document.getElementById('movvantDrawerItemsV1625');
  if(items){
    const source=document.getElementById('sideMenuV136')||document.querySelector('.classic-module-nav');
    const buttons=source?[...source.querySelectorAll('[data-p]')]:[...document.querySelectorAll('#app [data-p]')];
    const seen=new Set();
    items.innerHTML=buttons.filter(b=>{const p=b.dataset.p;if(!p||seen.has(p)||getComputedStyle(b).display==='none')return false;seen.add(p);return true}).map(b=>'<button type="button" data-mv-page-v1625="'+b.dataset.p+'">'+(b.textContent||b.dataset.p).trim()+'</button>').join('')+'<button type="button" data-mv-logout-v1625="1" class="mv-drawer-logout-v1625">Sair</button>';
  }
  const close=document.getElementById('movvantDrawerCloseV1625');
  if(close)close.onclick=v1625CloseDrawer;
  shade.onclick=v1625CloseDrawer;
  drawer.onclick=e=>{
    const page=e.target.closest?.('[data-mv-page-v1625]')?.dataset.mvPageV1625;
    if(page&&typeof show==='function'){show(page);v1625CloseDrawer();return}
    if(e.target.closest?.('[data-mv-logout-v1625]'))document.getElementById('sair')?.click();
  };
  return {shade,drawer};
}
function v1625OpenDrawer(e){
  if(e){e.preventDefault();e.stopImmediatePropagation?.();e.stopPropagation?.()}
  const {shade,drawer}=v1625EnsureDrawer();
  shade.classList.add('open');drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('mv-drawer-open-v1625');
}
function v1625CloseDrawer(e){
  if(e){e.preventDefault();e.stopPropagation?.()}
  const shade=document.getElementById('movvantDrawerShadeV1625'),drawer=document.getElementById('movvantDrawerV1625');
  shade?.classList.remove('open');drawer?.classList.remove('open');drawer?.setAttribute('aria-hidden','true');document.body.classList.remove('mv-drawer-open-v1625');
  const oldShade=document.getElementById('sideMenuShadeV136'),oldNav=document.getElementById('sideMenuV136');oldShade?.classList.remove('open-v136');oldNav?.classList.remove('open-v136');oldNav?.style.removeProperty('transform');
}
function v1625BindHeaderMenu(){
  const top=document.getElementById('topMenu');
  if(top){top.onclick=v1625OpenDrawer;top.ontouchend=v1625OpenDrawer;top.setAttribute('aria-controls','movvantDrawerV1625')}
  v1625EnsureDrawer();
}
document.addEventListener('click',e=>{const b=e.target.closest?.('#topMenu,.header-menu');if(b)v1625OpenDrawer(e)},true);
document.addEventListener('touchend',e=>{const b=e.target.closest?.('#topMenu,.header-menu');if(b)v1625OpenDrawer(e)},{capture:true,passive:false});
const v1625RenderBase=render;render=function(){const r=v1625RenderBase();setTimeout(v1625BindHeaderMenu,0);return r};
setTimeout(v1625BindHeaderMenu,300);setTimeout(v1625BindHeaderMenu,1600);setTimeout(v1625BindHeaderMenu,4000);
`;
if(!s.includes('carga();'))throw new Error('v162.5 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.5 isolated drawer */
#movvantDrawerShadeV1625{position:fixed!important;inset:0!important;background:rgba(7,20,40,.48)!important;z-index:2147483000!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .18s ease!important}
#movvantDrawerShadeV1625.open{opacity:1!important;visibility:visible!important;pointer-events:auto!important}
#movvantDrawerV1625{position:fixed!important;left:0!important;top:0!important;bottom:0!important;width:min(86vw,330px)!important;max-width:330px!important;background:#fff!important;z-index:2147483001!important;transform:translate3d(-105%,0,0)!important;transition:transform .2s ease!important;box-shadow:14px 0 40px rgba(7,20,40,.25)!important;padding:14px!important;overflow-y:auto!important;display:block!important;visibility:visible!important;opacity:1!important;border-radius:0 20px 20px 0!important}
#movvantDrawerV1625.open{transform:translate3d(0,0,0)!important}
.mv-drawer-head-v1625{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;padding:4px 2px 14px!important;border-bottom:1px solid #e4e9f0!important;margin-bottom:10px!important;color:#071428!important}
.mv-drawer-head-v1625 b{display:block!important;font-size:20px!important}.mv-drawer-head-v1625 small{display:block!important;font-size:10px!important;margin-top:3px!important;color:#657084!important}
#movvantDrawerCloseV1625{width:38px!important;height:38px!important;min-width:38px!important;padding:0!important;border-radius:10px!important;background:#eef2f7!important;color:#071428!important;font-size:24px!important;border:0!important}
.mv-drawer-items-v1625{display:flex!important;flex-direction:column!important;gap:6px!important}
.mv-drawer-items-v1625 button{display:block!important;width:100%!important;min-height:44px!important;padding:10px 12px!important;text-align:left!important;border-radius:10px!important;background:#f5f7fa!important;color:#071428!important;border:0!important;font-size:13px!important;font-weight:700!important}
.mv-drawer-items-v1625 .mv-drawer-logout-v1625{margin-top:8px!important;background:#eef0f4!important}
.mv-drawer-open-v1625{overflow:hidden!important}
@media(max-width:720px){#sideMenuV136,#sideMenuShadeV136,#sideMenuOpenV136{visibility:hidden!important;pointer-events:none!important}.header-menu,#topMenu{pointer-events:auto!important;z-index:2147482999!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.5 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.5: isolated mobile drawer rebuilt');
