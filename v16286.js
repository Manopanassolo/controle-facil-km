const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.88.3: window capture is the first and final navigation authority.
(function(){
 const byId=id=>document.getElementById(id);
 const exists=p=>!!p&&!!byId('p-'+p);
 function activate(p){
   if(!exists(p))return;
   try{globalThis.mvNavigationV16282?.navigate?.(p)}catch(_){}
   const apply=()=>{
     if(!exists(p))return;
     document.querySelectorAll('#app [id^="p-"]').forEach(x=>x.classList.toggle('hide',x.id!=='p-'+p));
     document.body.dataset.mvPage=p;
     try{localStorage.setItem('mv_last_page_v16282',p)}catch(_){}
     try{const u=new URL(location.href);u.hash='p='+encodeURIComponent(p);history.replaceState({...(history.state||{}),mvPage:p,mvVersion:'162.88.3'},'',u.pathname+u.search+u.hash)}catch(_){}
     document.querySelectorAll('#app>.nav [data-p]').forEach(b=>{const on=b.dataset.p===p;b.classList.toggle('mv-current-v16282',on);b.classList.toggle('mv-navactive87',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
     document.querySelectorAll('#mvBottomDock85 [data-mv-dock]').forEach(b=>b.classList.toggle('active',b.dataset.mvDock===p));
     if(innerWidth<900)globalThis.mvNavigationV16282?.closeMenu?.()
   };
   apply();setTimeout(apply,40);setTimeout(apply,160)
 }
 window.addEventListener('click',e=>{
   const t=e.target?.closest?.('#mvMenuToggleV16282,#mvBackV16282,#mvHomeV16282,#mvBottomDock85 [data-mv-dock],#app>.nav [data-p],[data-p-jump]');if(!t)return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
   if(t.id==='mvMenuToggleV16282'||t.dataset.mvDock==='menu'){
     document.body.classList.contains('mv-menu-open-v16282')?globalThis.mvNavigationV16282?.closeMenu?.():globalThis.mvNavigationV16282?.openMenu?.();return
   }
   if(t.id==='mvBackV16282'){globalThis.mvNavigationV16282?.back?.();return}
   if(t.id==='mvHomeV16282'){activate('inicio');return}
   activate(t.dataset.p||t.dataset.pJump||t.dataset.mvDock)
 },true);
 globalThis.mvWindowNavigationV162883={activate};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.88.3 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.88.3 desktop viewport authority */
@media(min-width:900px){
 body.mv-desktop88,body.mv-wide88{width:100vw!important;max-width:100vw!important;margin:0!important;padding:0!important}
 body.mv-desktop88>.w,body.mv-wide88>.w,body.mv-desktop88 .w,body.mv-wide88 .w{width:100vw!important;min-width:100vw!important;max-width:100vw!important;margin:0!important;padding:0!important;box-sizing:border-box!important}
 body.mv-desktop88 #app,body.mv-wide88 #app{width:100vw!important;min-width:100vw!important;max-width:100vw!important;margin:0!important;padding-left:205px!important;box-sizing:border-box!important}
 body.mv-desktop88 #p-inicio,body.mv-wide88 #p-inicio{width:calc(100vw - 205px)!important;min-width:calc(100vw - 205px)!important;max-width:calc(100vw - 205px)!important;margin:0!important;padding:0!important;box-sizing:border-box!important}
 body.mv-desktop88 #mvHome88,body.mv-wide88 #mvHome88{width:calc(100vw - 205px)!important;min-width:calc(100vw - 205px)!important;max-width:calc(100vw - 205px)!important;margin:0!important;padding:18px 24px 34px!important;box-sizing:border-box!important}
 body.mv-desktop88 .mv-homegrid88,body.mv-wide88 .mv-homegrid88{width:100%!important;min-width:0!important;grid-template-columns:minmax(0,2fr) minmax(320px,.8fr)!important}
}
`;
if(!s.includes('</style>'))throw new Error('v162.88.3 css anchor not found');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.88.3: window click authority and viewport desktop width installed');