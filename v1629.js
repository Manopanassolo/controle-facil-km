const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.9 clean mobile menu built on top of the stable shell only
(function(){
  function closeMenu(){
    const ov=document.getElementById('mvMenuV1629');
    if(ov)ov.classList.remove('open');
    document.documentElement.classList.remove('mv-lock-v1629');
    document.body.classList.remove('mv-lock-v1629');
  }
  function buildMenu(){
    let ov=document.getElementById('mvMenuV1629');
    if(ov)return ov;
    ov=document.createElement('div');
    ov.id='mvMenuV1629';
    ov.innerHTML='<aside class="mv-panel-v1629"><div class="mv-head-v1629"><div><b>Movvant</b><small>Inteligência comercial em campo</small></div><button id="mvCloseV1629" type="button" aria-label="Fechar menu">×</button></div><div id="mvItemsV1629" class="mv-items-v1629"></div></aside>';
    document.body.appendChild(ov);
    ov.addEventListener('click',e=>{if(e.target===ov)closeMenu()});
    document.getElementById('mvCloseV1629').onclick=closeMenu;
    const src=document.getElementById('sideMenuV136')||document.querySelector('.classic-module-nav');
    const buttons=src?[...src.querySelectorAll('[data-p]')]:[...document.querySelectorAll('[data-p]')];
    const seen=new Set(),items=document.getElementById('mvItemsV1629');
    items.innerHTML=buttons.filter(b=>{const p=b.dataset.p;if(!p||seen.has(p))return false;seen.add(p);return true}).map(b=>'<button type="button" data-page="'+b.dataset.p+'">'+(b.textContent||b.dataset.p).trim()+'</button>').join('')+'<button type="button" data-logout="1" class="mv-logout-v1629">Sair</button>';
    items.onclick=e=>{
      const p=e.target.closest?.('[data-page]')?.dataset.page;
      if(p&&typeof show==='function'){show(p);closeMenu();return;}
      if(e.target.closest?.('[data-logout]')){closeMenu();document.getElementById('sair')?.click();}
    };
    return ov;
  }
  function openMenu(e){
    if(e){e.preventDefault();e.stopPropagation();}
    const ov=buildMenu();
    ov.classList.add('open');
    document.documentElement.classList.add('mv-lock-v1629');
    document.body.classList.add('mv-lock-v1629');
  }
  function bind(){
    buildMenu();
    const old=document.getElementById('topMenu');
    if(!old)return;
    const b=old.cloneNode(true);
    b.id='topMenu';
    b.classList.add('mv-menu-trigger-v1629');
    old.replaceWith(b);
    b.onclick=openMenu;
    b.onpointerup=null;
    b.ontouchend=null;
    b.setAttribute('aria-controls','mvMenuV1629');
  }
  const baseRender=render;
  render=function(){const r=baseRender();setTimeout(bind,0);return r;};
  setTimeout(bind,50);
  setTimeout(bind,700);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.9 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.9 clean isolated menu */
#mvMenuV1629{display:none!important;position:fixed!important;inset:0!important;background:rgba(7,20,40,.50)!important;z-index:2147483646!important}
#mvMenuV1629.open{display:block!important}
.mv-panel-v1629{position:absolute!important;left:0!important;top:0!important;bottom:0!important;width:min(86vw,340px)!important;background:#fff!important;padding:16px!important;overflow-y:auto!important;border-radius:0 18px 18px 0!important;box-shadow:16px 0 40px rgba(7,20,40,.28)!important}
.mv-head-v1629{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:4px 2px 14px!important;border-bottom:1px solid #e5e9f0!important;margin-bottom:10px!important;color:#071428!important}.mv-head-v1629 b{display:block!important;font-size:20px!important}.mv-head-v1629 small{display:block!important;margin-top:3px!important;font-size:10px!important;color:#677286!important}.mv-head-v1629 button{width:40px!important;height:40px!important;min-width:40px!important;padding:0!important;border:0!important;border-radius:10px!important;background:#eef2f7!important;color:#071428!important;font-size:24px!important}
.mv-items-v1629{display:flex!important;flex-direction:column!important;gap:6px!important}.mv-items-v1629 button{display:block!important;width:100%!important;min-height:46px!important;padding:11px 13px!important;border:0!important;border-radius:10px!important;background:#103d7d!important;color:#fff!important;font-size:13px!important;font-weight:700!important;text-align:left!important}.mv-items-v1629 .mv-logout-v1629{margin-top:8px!important;background:#eef0f4!important;color:#071428!important}.mv-lock-v1629{overflow:hidden!important}
@media(max-width:720px){#sideMenuV136,#sideMenuShadeV136,#sideMenuOpenV136{display:none!important}.classic-module-nav{visibility:hidden!important;pointer-events:none!important;position:absolute!important;left:-9999px!important}.mv-menu-trigger-v1629,#topMenu{pointer-events:auto!important;position:relative!important;z-index:100!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.9 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.9: clean menu rebuilt without v162.2-v162.8 legacy patches');
