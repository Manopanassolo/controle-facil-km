const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.30 base navigation authority: page visibility only; desktop shell left to latest web layout.
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
 function ensureMobileHeader(){
   if(innerWidth>=900)return;
   const bar=byId('mvTopNavV16282');if(!bar)return;
   bar.removeAttribute('aria-hidden');bar.classList.remove('hide');bar.classList.add('mv-globalhead125');
   let notify=byId('mvNotifyV16321');
   if(!notify){notify=document.createElement('button');notify.type='button';notify.id='mvNotifyV16321';notify.className='mv-notify125';notify.setAttribute('aria-label','Notificações');notify.innerHTML='🔔';notify.onclick=()=>globalThis.mvNavigationV16282?.navigate?.('notificacoes');bar.appendChild(notify)}
   const title=byId('mvPageTitleV16282');if(title)title.classList.add('mv-headtitle125');
 }
 function sync(){wrapNav();syncPages();ensureMobileHeader()}
 document.addEventListener('click',e=>{if(e.target?.closest?.('[data-p],[data-p-jump],[data-mv-dock],[data-mv88],#mvBackV16282,#mvHomeV16282,#mvNotifyV16321'))setTimeout(syncPages,0)},true);
 addEventListener('hashchange',()=>setTimeout(syncPages,0));addEventListener('popstate',()=>setTimeout(syncPages,0));addEventListener('pageshow',sync,true);addEventListener('resize',()=>requestAnimationFrame(sync));
 [0,80,220,600,1200].forEach(ms=>setTimeout(sync,ms));
 globalThis.mvWebLayoutV16325={sync,syncPages};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.30 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.30 mobile header only; desktop shell intentionally delegated to v16303 */
@media(max-width:899px){
 #mvTopNavV16282.mv-globalhead125{display:grid!important;visibility:visible!important;position:fixed!important;z-index:2147483000!important;top:0!important;left:0!important;right:0!important;width:100%!important;height:50px!important;min-height:50px!important;max-height:50px!important;margin:0!important;padding:5px 9px!important;background:#0b2d5d!important;border:0!important;border-bottom:1px solid #173e72!important;grid-template-columns:38px minmax(0,1fr) 38px!important;gap:8px!important;align-items:center!important;opacity:1!important;pointer-events:auto!important}
 #mvTopNavV16282.mv-globalhead125 #mvMenuToggleV16282{display:block!important;visibility:visible!important;grid-column:1!important}
 #mvTopNavV16282.mv-globalhead125 .mv-headtitle125{grid-column:2!important;color:#fff!important;font-size:12px!important}
 #mvTopNavV16282.mv-globalhead125 .mv-notify125{display:block!important;grid-column:3!important;background:#123e78!important;color:#c8ff00!important}
 #app{padding-top:50px!important}
 #app>.nav{top:58px!important;max-height:calc(100dvh - 70px)!important}
}
`;
if(!s.includes('</style>'))throw new Error('v163.30 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.30: obsolete desktop shell authority removed');
