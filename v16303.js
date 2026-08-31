const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.28: desktop horizontal navigation shell; mobile keeps drawer/dock.
(function(){
 const nav=()=>document.querySelector('#app>.nav');
 function desktop(){return innerWidth>=900}
 function sync(){
   document.body.classList.toggle('mv-horizontal128',desktop());
   const n=nav();if(!n)return;
   if(desktop()){
     n.classList.add('mv-topmenu128');n.style.removeProperty('--mv-item127');
     const brand=n.querySelector('.mv-sidebrand89');if(brand)brand.style.setProperty('display','none','important');
   }else n.classList.remove('mv-topmenu128');
 }
 [0,80,220,600,1200,2400].forEach(ms=>setTimeout(sync,ms));
 addEventListener('resize',()=>requestAnimationFrame(sync));addEventListener('pageshow',sync,true);
})();
`;
if(!s.includes('carga();'))throw new Error('v163.28 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.28 web navigation like modern analytics workspace */
@media(min-width:900px){
 body.mv-horizontal128 #mvTopNavV16282.mv-globalhead125{height:48px!important;min-height:48px!important;max-height:48px!important;grid-template-columns:44px 230px minmax(0,1fr) 44px!important;background:#fff!important;border-bottom:1px solid #dce3ec!important;box-shadow:none!important;padding:4px 18px!important}
 body.mv-horizontal128 #mvTopNavV16282 #mvMenuToggleV16282{display:none!important}
 body.mv-horizontal128 #mvTopNavV16282 .mv-headerbrand127{grid-column:2!important;color:#12304f!important}.mv-horizontal128 #mvTopNavV16282 .mv-headerbrand127 strong{color:#12304f!important}.mv-horizontal128 #mvTopNavV16282 .mv-headerbrand127 small{color:#55728e!important}
 body.mv-horizontal128 #mvTopNavV16282 .mv-headtitle125{grid-column:3!important;color:#4a6076!important;justify-self:center!important}
 body.mv-horizontal128 #mvTopNavV16282 .mv-notify125{grid-column:4!important;background:#f4f7fb!important;color:#0c67d9!important;border-color:#d8e2ee!important}
 body.mv-horizontal128 #app{padding-left:0!important;padding-top:88px!important;height:100dvh!important;background:#f3f6fa!important}
 body.mv-horizontal128 #app>.nav.mv-topmenu128{position:fixed!important;z-index:2147482000!important;left:0!important;right:0!important;top:48px!important;bottom:auto!important;width:100%!important;height:40px!important;min-height:40px!important;max-height:40px!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;padding:3px 18px!important;background:#fff!important;border-bottom:1px solid #dce3ec!important;transform:none!important;box-sizing:border-box!important}
 body.mv-horizontal128 #app>.nav.mv-topmenu128 .mv-sidelinks89{display:flex!important;flex:0 1 auto!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:3px!important;overflow:hidden!important;padding:0!important;min-width:0!important}
 body.mv-horizontal128 #app>.nav.mv-topmenu128 .mv-sidelinks89>button{width:auto!important;height:32px!important;min-height:32px!important;max-height:32px!important;flex:0 1 auto!important;padding:5px 9px!important;margin:0!important;border-radius:6px!important;font-size:10px!important;white-space:nowrap!important;color:#173653!important;background:transparent!important}
 body.mv-horizontal128 #app>.nav.mv-topmenu128 .mv-sidelinks89>button.active,body.mv-horizontal128 #app>.nav.mv-topmenu128 .mv-sidelinks89>button[aria-current="page"]{background:#1684e8!important;color:#fff!important}
 body.mv-horizontal128 #app>.nav.mv-topmenu128 .mv-logout89{width:auto!important;height:32px!important;min-height:32px!important;margin:0 0 0 6px!important;padding:5px 9px!important;font-size:10px!important;background:transparent!important;color:#526b82!important;border:0!important}
 body.mv-horizontal128 #app [id^="p-"].mv-pagefit127{height:calc(100dvh - 88px)!important;max-height:calc(100dvh - 88px)!important;padding:12px 14px 14px!important;background:#f3f6fa!important}
 body.mv-horizontal128 #p-inicio{padding:10px 12px 12px!important}
 body.mv-horizontal128.mv-sidebar-collapsed89 #app{padding-left:0!important}
 body.mv-horizontal128.mv-sidebar-collapsed89 #app>.nav{transform:none!important;pointer-events:auto!important}
}
`;
if(!s.includes('</style>'))throw new Error('v163.28 css anchor');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.28: horizontal desktop navigation installed');
