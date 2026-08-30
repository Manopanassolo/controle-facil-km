const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.88.2: real-click page fallback and unconstrained desktop canvas.
(function(){
 const byId=id=>document.getElementById(id);
 const valid=p=>!!p&&!!byId('p-'+p);
 function visible(p){return valid(p)&&!byId('p-'+p).classList.contains('hide')}
 function forcePage(p){
   if(!valid(p))return false;
   document.querySelectorAll('#app [id^="p-"]').forEach(x=>x.classList.add('hide'));
   byId('p-'+p).classList.remove('hide');
   document.body.dataset.mvPage=p;
   try{localStorage.setItem('mv_last_page_v16282',p)}catch(_){}
   try{
     const u=new URL(location.href);u.hash='p='+encodeURIComponent(p);
     history.replaceState({...(history.state||{}),mvPage:p,mvVersion:'162.88.2'},'',u.pathname+u.search+u.hash)
   }catch(_){}
   document.querySelectorAll('#app>.nav [data-p]').forEach(b=>{
     const on=b.dataset.p===p;b.classList.toggle('mv-current-v16282',on);b.classList.toggle('mv-navactive87',on);
     if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')
   });
   document.querySelectorAll('#mvBottomDock85 [data-mv-dock]').forEach(b=>b.classList.toggle('active',b.dataset.mvDock===p));
   if(innerWidth<900){globalThis.mvNavigationV16282?.closeMenu?.()}
   return true
 }
 function authoritativeGo(p){
   if(!valid(p))return;
   try{globalThis.mvNavigationV16282?.navigate?.(p)}catch(_){}
   queueMicrotask(()=>{if(!visible(p)||document.body.dataset.mvPage!==p)forcePage(p)});
   setTimeout(()=>{if(!visible(p)||document.body.dataset.mvPage!==p)forcePage(p)},50);
   setTimeout(()=>{if(!visible(p)||document.body.dataset.mvPage!==p)forcePage(p)},180)
 }
 document.addEventListener('click',e=>{
   const b=e.target?.closest?.('#app>.nav [data-p],#mvBottomDock85 [data-mv-dock]');if(!b)return;
   const p=b.dataset.p||b.dataset.mvDock;if(!p||p==='menu')return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();authoritativeGo(p)
 },true);
 function stretch(){
   const desktop=innerWidth>=900;document.body.classList.toggle('mv-wide88',desktop);
   if(desktop){
     const p=byId('p-inicio'),h=byId('mvHome88');
     if(p){p.style.setProperty('max-width','none','important');p.style.setProperty('width','100%','important')}
     if(h){h.style.setProperty('max-width','none','important');h.style.setProperty('width','100%','important')}
   }
 }
 [0,100,350,900,1800].forEach(ms=>setTimeout(stretch,ms));addEventListener('resize',()=>requestAnimationFrame(stretch));
 globalThis.mvNavigationAuthorityV162882={go:authoritativeGo,forcePage,stretch};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.88.2 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.88.2 true landscape canvas */
@media(min-width:900px){
 html,body{width:100%!important;max-width:none!important;overflow-x:hidden!important}
 body.mv-wide88>.w,body.mv-wide88 .w{width:100%!important;max-width:none!important;margin:0!important;padding:0!important}
 body.mv-wide88 #app{width:100%!important;max-width:none!important;margin:0!important;box-sizing:border-box!important;padding-left:205px!important}
 body.mv-wide88 #app>section{width:100%!important;max-width:none!important;margin:0!important;box-sizing:border-box!important}
 body.mv-wide88 #p-inicio{width:100%!important;max-width:none!important;padding:0!important}
 body.mv-wide88 #mvHome88{width:100%!important;max-width:none!important;box-sizing:border-box!important;padding-left:24px!important;padding-right:24px!important}
 body.mv-wide88 .mv-homegrid88{width:100%!important;grid-template-columns:minmax(0,2fr) minmax(320px,.75fr)!important}
 body.mv-wide88 .mv-kpis88{width:100%!important}
}
`;
if(!s.includes('</style>'))throw new Error('v162.88.2 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.88.2: authoritative page clicks and full-width desktop installed');