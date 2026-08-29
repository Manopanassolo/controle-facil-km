const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.6 hard-isolated mobile menu overlay (no legacy transform dependency)
function v1626BuildMenu(){
  let overlay=document.getElementById('movvantMenuOverlayV1626');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='movvantMenuOverlayV1626';
    overlay.innerHTML='<div id="movvantMenuPanelV1626"><div class="mv1626-head"><div><b>Movvant</b><small>Inteligência comercial em campo</small></div><button type="button" id="movvantMenuCloseV1626" aria-label="Fechar menu">×</button></div><div id="movvantMenuItemsV1626" class="mv1626-items"></div></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click',e=>{if(e.target===overlay)v1626CloseMenu()});
    document.getElementById('movvantMenuCloseV1626').onclick=v1626CloseMenu;
  }
  const items=document.getElementById('movvantMenuItemsV1626');
  if(items){
    const source=document.getElementById('sideMenuV136')||document.querySelector('.classic-module-nav');
    const btns=source?[...source.querySelectorAll('[data-p]')]:[...document.querySelectorAll('[data-p]')];
    const seen=new Set();
    const rows=[];
    for(const b of btns){const p=b.dataset.p;if(!p||seen.has(p))continue;seen.add(p);rows.push('<button type="button" data-v1626-page="'+p+'">'+(b.textContent||p).trim()+'</button>')}
    rows.push('<button type="button" data-v1626-logout="1" class="mv1626-logout">Sair</button>');
    items.innerHTML=rows.join('');
    items.onclick=e=>{
      const page=e.target.closest?.('[data-v1626-page]')?.dataset.v1626Page;
      if(page&&typeof show==='function'){show(page);v1626CloseMenu();return}
      if(e.target.closest?.('[data-v1626-logout]')){v1626CloseMenu();document.getElementById('sair')?.click()}
    };
  }
  return overlay;
}
function v1626OpenMenu(e){
  if(e){e.preventDefault();e.stopImmediatePropagation?.();e.stopPropagation?.()}
  const overlay=v1626BuildMenu();
  overlay.classList.add('is-open');
  document.documentElement.classList.add('mv1626-lock');
  document.body.classList.add('mv1626-lock');
}
function v1626CloseMenu(e){
  if(e){e.preventDefault();e.stopPropagation?.()}
  document.getElementById('movvantMenuOverlayV1626')?.classList.remove('is-open');
  document.documentElement.classList.remove('mv1626-lock');
  document.body.classList.remove('mv1626-lock');
  document.getElementById('sideMenuShadeV136')?.classList.remove('open-v136');
  document.getElementById('sideMenuV136')?.classList.remove('open-v136');
  document.getElementById('movvantDrawerShadeV1625')?.classList.remove('open');
  document.getElementById('movvantDrawerV1625')?.classList.remove('open');
}
function v1626Bind(){
  const top=document.getElementById('topMenu');
  if(top){
    top.onclick=v1626OpenMenu;
    top.onpointerup=null;
    top.ontouchend=null;
    top.setAttribute('aria-controls','movvantMenuOverlayV1626');
    top.setAttribute('aria-expanded','false');
  }
  v1626BuildMenu();
}
document.addEventListener('click',e=>{const b=e.target.closest?.('#topMenu,.header-menu');if(b)v1626OpenMenu(e)},true);
const v1626RenderBase=render;render=function(){const r=v1626RenderBase();setTimeout(v1626Bind,0);return r};
setTimeout(v1626Bind,100);setTimeout(v1626Bind,800);setTimeout(v1626Bind,2200);
`;
if(!s.includes('carga();'))throw new Error('v162.6 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.6 hard isolated mobile menu */
#movvantMenuOverlayV1626{display:none!important;position:fixed!important;inset:0!important;background:rgba(7,20,40,.52)!important;z-index:2147483646!important;margin:0!important;padding:0!important}
#movvantMenuOverlayV1626.is-open{display:block!important}
#movvantMenuPanelV1626{display:block!important;position:fixed!important;left:0!important;top:0!important;bottom:0!important;width:86vw!important;max-width:340px!important;background:#fff!important;z-index:2147483647!important;margin:0!important;padding:14px!important;border-radius:0 18px 18px 0!important;box-shadow:16px 0 40px rgba(7,20,40,.28)!important;overflow-y:auto!important;transform:none!important;visibility:visible!important;opacity:1!important}
.mv1626-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:4px 2px 14px!important;border-bottom:1px solid #e5e9f0!important;margin-bottom:10px!important}.mv1626-head b{display:block!important;font-size:20px!important;color:#071428!important}.mv1626-head small{display:block!important;margin-top:3px!important;font-size:10px!important;color:#677286!important}.mv1626-head button{width:38px!important;height:38px!important;min-width:38px!important;padding:0!important;border:0!important;border-radius:10px!important;background:#eef2f7!important;color:#071428!important;font-size:24px!important;text-align:center!important}
.mv1626-items{display:flex!important;flex-direction:column!important;gap:6px!important}.mv1626-items button{display:block!important;width:100%!important;min-height:44px!important;padding:10px 12px!important;border:0!important;border-radius:10px!important;background:#f5f7fa!important;color:#071428!important;font-size:13px!important;font-weight:700!important;text-align:left!important}.mv1626-items .mv1626-logout{margin-top:8px!important;background:#eef0f4!important}
.mv1626-lock{overflow:hidden!important}
@media(max-width:720px){#sideMenuV136,#sideMenuShadeV136,#sideMenuOpenV136,#movvantDrawerV1625,#movvantDrawerShadeV1625{display:none!important}.classic-module-nav{visibility:hidden!important;pointer-events:none!important}.header-menu,#topMenu{pointer-events:auto!important;position:relative!important;z-index:60!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.6 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.6: hard isolated mobile menu overlay ready');
