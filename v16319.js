const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const css=`
/* v163.48: Novo percurso single-surface guard — prevents legacy/new shell overlap flicker */
body.mv-route-exclusive #app>section:not(#p-viagem){display:none!important;visibility:hidden!important;pointer-events:none!important}
body.mv-route-exclusive #p-viagem{display:block!important;visibility:visible!important;opacity:1!important;transform:none!important;animation:none!important;transition:none!important;isolation:isolate}
body.mv-route-exclusive #p-viagem *{animation:none!important}
body.mv-route-exclusive #novaViagem{opacity:1!important;visibility:visible!important;transform:none!important;transition:none!important}
`;
if(!s.includes('</style>'))throw new Error('v163.48 style anchor not found');
s=s.replace('</style>',css+'\n</style>');
const runtime=`<script id="mvRouteSurface148">
(function(){
 const ROUTE='viagem';
 function visiblePage(){
  const v=[...document.querySelectorAll('#app>section[id^="p-"]')].find(x=>!x.classList.contains('hide')&&getComputedStyle(x).display!=='none');
  return document.body.dataset.mvPage||globalThis.mvNavigationV16282?.page||v?.id?.replace(/^p-/,'')||'';
 }
 function apply(page){
  const on=page===ROUTE;
  document.body.classList.toggle('mv-route-exclusive',on);
  if(on){
   const route=document.getElementById('p-viagem');
   if(route){route.classList.remove('hide');route.setAttribute('aria-hidden','false')}
   document.querySelectorAll('#app>section[id^="p-"]:not(#p-viagem)').forEach(x=>x.setAttribute('aria-hidden','true'));
  }else{
   document.querySelectorAll('#app>section[id^="p-"]').forEach(x=>x.removeAttribute('aria-hidden'));
  }
 }
 function sync(){apply(visiblePage());document.documentElement.dataset.mvRouteSurface='163.48'}
 document.addEventListener('click',e=>{
  const b=e.target?.closest?.('[data-p],[data-p-jump],[data-mv-dock]');
  if(!b)return;
  const p=b.dataset.p||b.dataset.pJump||b.dataset.mvDock||'';
  apply(p);
  setTimeout(sync,0);setTimeout(sync,80);
 },true);
 addEventListener('popstate',()=>setTimeout(sync,0));
 addEventListener('pageshow',sync,true);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
 globalThis.mvRouteSurfaceV16348={sync,apply};
})();
</script>`;
if(!s.includes('</body>'))throw new Error('v163.48 body anchor not found');
s=s.replace('</body>',runtime+'\n</body>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.48 Novo percurso surface stabilized');
