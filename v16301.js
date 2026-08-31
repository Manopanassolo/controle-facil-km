const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.18: authoritative single active module + full web canvas + scrollbar-free desktop sidebar.
(function(){
 const byId=id=>document.getElementById(id);
 function currentPage(){return globalThis.mvNavigationV16282?.page||document.body.dataset.mvPage||'inicio'}
 function syncPages(){
   const current=currentPage();
   document.querySelectorAll('#app [id^="p-"]').forEach(page=>{
     const name=page.id.slice(2),on=name===current;
     if(on){page.style.removeProperty('display');page.style.removeProperty('visibility');page.style.removeProperty('position');page.removeAttribute('aria-hidden');page.classList.remove('hide')}
     else{page.style.setProperty('display','none','important');page.style.setProperty('visibility','hidden','important');page.setAttribute('aria-hidden','true')}
   });
   document.body.dataset.mvSinglePage118=current;
 }
 function wrapNav(){
   const api=globalThis.mvNavigationV16282;if(!api||api.__mv118)return false;
   ['navigate','home','back'].forEach(k=>{const orig=api[k];if(typeof orig!=='function')return;api[k]=function(...args){const r=orig.apply(api,args);requestAnimationFrame(syncPages);setTimeout(syncPages,40);return r}});
   api.__mv118=true;return true;
 }
 function sync(){wrapNav();syncPages();document.body.classList.toggle('mv-web118',innerWidth>=900)}
 document.addEventListener('click',e=>{if(e.target?.closest?.('[data-p],[data-p-jump],[data-mv-dock],[data-mv88],#mvBackV16282,#mvHomeV16282'))setTimeout(syncPages,0)},true);
 addEventListener('hashchange',()=>setTimeout(syncPages,0));addEventListener('popstate',()=>setTimeout(syncPages,0));addEventListener('pageshow',sync,true);addEventListener('resize',()=>requestAnimationFrame(sync));
 [0,100,300,700,1400,2600].forEach(ms=>setTimeout(sync,ms));
 globalThis.mvWebLayoutV16318={sync,syncPages};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.18 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.18 desktop modules fill the work area and sidebar scroll chrome is hidden */
@media(min-width:900px){
 body.mv-web118 #app{padding-left:205px!important;width:100%!important;max-width:none!important;box-sizing:border-box!important}
 body.mv-web118 #app [id^="p-"]{width:100%!important;max-width:none!important;margin:0!important;box-sizing:border-box!important;min-height:calc(100vh - 12px)!important}
 body.mv-web118 #app [id^="p-"]>.card,body.mv-web118 #app [id^="p-"]>.box,body.mv-web118 #app [id^="p-"]>.panel{max-width:none!important;width:100%!important;box-sizing:border-box!important}
 body.mv-web118 #app>.nav{overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:none!important;-ms-overflow-style:none!important;padding-right:8px!important}
 body.mv-web118 #app>.nav::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}
 body.mv-web118 #app>.nav{overscroll-behavior:contain!important}
 body.mv-web118 #app [id^="p-"]:not(#p-inicio){padding:16px 18px 28px!important}
}
`;
if(!s.includes('</style>'))throw new Error('v163.18 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.18: single active web module and elegant desktop sidebar installed');
