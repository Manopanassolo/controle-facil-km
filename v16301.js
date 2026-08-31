const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.25: authoritative single active module + fixed thin global header + adaptive desktop canvas.
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
   document.body.dataset.mvSinglePage125=current;
 }
 function wrapNav(){
   const api=globalThis.mvNavigationV16282;if(!api||api.__mv125)return false;
   ['navigate','home','back'].forEach(k=>{const orig=api[k];if(typeof orig!=='function')return;api[k]=function(...args){const r=orig.apply(api,args);requestAnimationFrame(syncPages);setTimeout(syncPages,40);return r}});
   api.__mv125=true;return true;
 }
 function force(el,key,val){el.style.setProperty(key,val,'important')}
 function ensureHeader(){
   const bar=byId('mvTopNavV16282');if(!bar)return false;
   bar.removeAttribute('aria-hidden');bar.classList.remove('hide');bar.classList.add('mv-globalhead125');
   [['display','grid'],['visibility','visible'],['position','fixed'],['top','0'],['left','0'],['right','0'],['width','100%'],['height',innerWidth<900?'50px':'52px'],['min-height',innerWidth<900?'50px':'52px'],['max-height',innerWidth<900?'50px':'52px'],['margin','0'],['overflow','visible'],['pointer-events','auto'],['opacity','1']].forEach(([k,v])=>force(bar,k,v));
   let notify=byId('mvNotifyV16321');
   if(!notify){notify=document.createElement('button');notify.type='button';notify.id='mvNotifyV16321';notify.className='mv-notify125';notify.setAttribute('aria-label','Notificações');notify.innerHTML='🔔';notify.onclick=()=>globalThis.mvNavigationV16282?.navigate?.('notificacoes');bar.appendChild(notify)}
   const title=byId('mvPageTitleV16282');if(title){title.classList.add('mv-headtitle125');title.style.removeProperty('display');title.style.removeProperty('visibility')}
   const menu=byId('mvMenuToggleV16282');if(menu){menu.removeAttribute('aria-hidden');menu.classList.remove('hide');force(menu,'display','block');force(menu,'visibility','visible');force(menu,'pointer-events','auto');menu.setAttribute('aria-label','Abrir ou recolher menu principal')}
   return true;
 }
 function sync(){wrapNav();syncPages();ensureHeader();document.body.classList.toggle('mv-web125',innerWidth>=900)}
 document.addEventListener('click',e=>{if(e.target?.closest?.('[data-p],[data-p-jump],[data-mv-dock],[data-mv88],#mvBackV16282,#mvHomeV16282,#mvNotifyV16321'))setTimeout(()=>{syncPages();ensureHeader()},0)},true);
 addEventListener('hashchange',()=>setTimeout(()=>{syncPages();ensureHeader()},0));addEventListener('popstate',()=>setTimeout(()=>{syncPages();ensureHeader()},0));addEventListener('pageshow',sync,true);addEventListener('resize',()=>requestAnimationFrame(sync));
 [0,50,120,260,500,900,1500,2600,4200].forEach(ms=>setTimeout(sync,ms));
 globalThis.mvWebLayoutV16325={sync,syncPages,ensureHeader};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.25 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.25 fixed global header and viewport-adaptive desktop modules */
#mvTopNavV16282.mv-globalhead125{display:grid!important;visibility:visible!important;position:fixed!important;z-index:2147483000!important;top:0!important;left:0!important;right:0!important;width:100%!important;height:52px!important;min-height:52px!important;max-height:52px!important;box-sizing:border-box!important;margin:0!important;padding:6px 12px!important;border:0!important;border-bottom:1px solid #173e72!important;border-radius:0!important;background:#0b2d5d!important;box-shadow:0 2px 10px rgba(7,23,45,.18)!important;grid-template-columns:40px minmax(0,1fr) 40px!important;gap:8px!important;align-items:center!important;overflow:visible!important;opacity:1!important;pointer-events:auto!important}
#mvTopNavV16282.mv-globalhead125 #mvMenuToggleV16282{display:block!important;visibility:visible!important;grid-column:1!important;width:38px!important;height:38px!important;min-height:38px!important;border-radius:8px!important;font-size:20px!important;pointer-events:auto!important}
#mvTopNavV16282.mv-globalhead125 #mvBackV16282,#mvTopNavV16282.mv-globalhead125 #mvHomeV16282{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;opacity:0!important;pointer-events:none!important}
#mvTopNavV16282.mv-globalhead125 .mv-headtitle125{grid-column:2!important;justify-self:start!important;padding:0!important;font-size:13px!important;font-weight:700!important;color:#fff!important;letter-spacing:.01em!important}
#mvTopNavV16282.mv-globalhead125 .mv-notify125{display:block!important;visibility:visible!important;grid-column:3!important;width:38px!important;height:38px!important;min-height:38px!important;padding:0!important;border-radius:8px!important;font-size:17px!important;background:#123e78!important;color:#c8ff00!important;border:1px solid #2a578e!important}
@media(min-width:900px){
 html,body{height:100%!important;overflow:hidden!important}
 body.mv-web125 #app{position:relative!important;height:100dvh!important;min-height:100dvh!important;padding-top:52px!important;padding-left:205px!important;width:100%!important;max-width:none!important;box-sizing:border-box!important;overflow:hidden!important}
 body.mv-web125 #app>.nav{position:fixed!important;left:0!important;top:52px!important;bottom:0!important;width:205px!important;height:auto!important;max-height:none!important;overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:none!important;-ms-overflow-style:none!important;padding:12px 8px 10px!important;box-sizing:border-box!important}
 body.mv-web125 #app>.nav::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}
 body.mv-web125 #app>.nav .mv-sidebrand89{display:grid!important;visibility:visible!important;height:auto!important;min-height:62px!important;max-height:none!important;margin:0 2px 12px!important;padding:11px 10px 12px!important;border-bottom:1px solid #193553!important;overflow:visible!important;pointer-events:auto!important}
 body.mv-web125 #app>.nav .mv-sidelinks89{padding-top:2px!important}
 body.mv-web125 #app [id^="p-"]{width:100%!important;max-width:none!important;margin:0!important;box-sizing:border-box!important;height:calc(100dvh - 52px)!important;min-height:0!important;max-height:calc(100dvh - 52px)!important;padding:12px 16px 14px!important;overflow:auto!important;scrollbar-width:thin!important}
 body.mv-web125 #p-inicio{overflow:hidden!important;padding:10px 14px 12px!important}
 body.mv-web125 #mvHome88{height:100%!important;min-height:0!important;max-height:100%!important;overflow:hidden!important}
 body.mv-web125 #mvHome88>.mv-grid88,body.mv-web125 #mvHome88 .mv-grid88{height:calc(100% - 56px)!important;min-height:0!important;align-content:stretch!important;grid-auto-rows:minmax(0,1fr)!important}
 body.mv-web125 #mvHome88 .mv-card88,body.mv-web125 #mvHome88 .card{min-height:0!important;overflow:hidden!important}
 body.mv-web125 #app [id^="p-"]:not(#p-inicio)>.card,body.mv-web125 #app [id^="p-"]:not(#p-inicio)>.box,body.mv-web125 #app [id^="p-"]:not(#p-inicio)>.panel{max-width:none!important;width:100%!important;box-sizing:border-box!important}
 body.mv-web125.mv-sidebar-collapsed89 #app{padding-left:0!important}
 body.mv-web125.mv-sidebar-collapsed89 #app>.nav{transform:translateX(-105%)!important}
}
@media(max-width:899px){
 #mvTopNavV16282.mv-globalhead125{height:50px!important;min-height:50px!important;max-height:50px!important;padding:5px 9px!important;grid-template-columns:38px minmax(0,1fr) 38px!important}
 #mvTopNavV16282.mv-globalhead125 .mv-headtitle125{font-size:12px!important}
 #app{padding-top:50px!important}
 #app>.nav{top:58px!important;max-height:calc(100dvh - 70px)!important}
}
`;
if(!s.includes('</style>'))throw new Error('v163.25 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.25: authoritative fixed header forced visible');
