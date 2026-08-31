const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.27: continuous navy shell, header brand, no sidebar scroll and proportional web modules.
(function(){
 const byId=id=>document.getElementById(id);
 function installBrand(){
   const bar=byId('mvTopNavV16282');if(!bar)return;
   let brand=byId('mvHeaderBrand127');
   if(!brand){brand=document.createElement('div');brand.id='mvHeaderBrand127';brand.className='mv-headerbrand127';brand.innerHTML='<span class="mv-brandmark127">M</span><span><strong>Movvant</strong><small>Inteligência comercial em campo</small></span>';const title=byId('mvPageTitleV16282');bar.insertBefore(brand,title||bar.children[1]||null)}
   const side=bar.ownerDocument.querySelector('#app>.nav .mv-sidebrand89');if(side){side.style.setProperty('display','none','important');side.setAttribute('aria-hidden','true')}
 }
 function compactNav(){
   const nav=document.querySelector('#app>.nav');if(!nav)return;
   nav.classList.add('mv-navfit127');
   const links=nav.querySelector('.mv-sidelinks89');if(!links)return;
   const available=Math.max(360,innerHeight-52-72);
   const count=Math.max(1,links.querySelectorAll(':scope>button').length);
   const h=Math.max(24,Math.min(35,Math.floor((available-70)/count)));
   nav.style.setProperty('--mv-item127',h+'px');
 }
 function normalizePages(){
   if(innerWidth<900)return;
   document.querySelectorAll('#app [id^="p-"]').forEach(p=>{p.classList.add('mv-pagefit127')});
 }
 function sync(){installBrand();compactNav();normalizePages();document.body.classList.add('mv-shell127')}
 [0,60,160,350,800,1500,2800].forEach(ms=>setTimeout(sync,ms));
 addEventListener('resize',()=>requestAnimationFrame(sync));addEventListener('pageshow',sync,true);
 globalThis.mvShellV16327={sync};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.27 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.27 continuous navy shell + proportional viewport */
#mvTopNavV16282.mv-globalhead125{background:#082846!important;border-bottom-color:#153b61!important;grid-template-columns:44px 220px minmax(0,1fr) 44px!important;padding:5px max(14px,calc((100vw - 1500px)/2 + 14px)) 5px 12px!important;gap:10px!important}
#mvTopNavV16282 .mv-headerbrand127{grid-column:2!important;display:flex!important;align-items:center!important;gap:8px!important;min-width:0!important;color:#fff!important}.mv-brandmark127{display:grid!important;place-items:center!important;width:29px!important;height:29px!important;flex:0 0 29px!important;border-radius:50%!important;background:#fff!important;color:#0d4ea6!important;font-weight:850!important;font-size:13px!important}.mv-headerbrand127>span:last-child{display:grid!important;line-height:1.05!important}.mv-headerbrand127 strong{font-size:14px!important;color:#fff!important}.mv-headerbrand127 small{margin-top:3px!important;font-size:8px!important;color:#c8ff00!important;white-space:nowrap!important}
#mvTopNavV16282.mv-globalhead125 .mv-headtitle125{grid-column:3!important;justify-self:start!important;color:#dbe8f6!important;font-size:12px!important;font-weight:650!important}
#mvTopNavV16282.mv-globalhead125 .mv-notify125{grid-column:4!important;justify-self:end!important}
@media(min-width:900px){
 body.mv-shell127 #app{padding-left:205px!important}
 body.mv-shell127 #app>.nav{top:52px!important;bottom:0!important;height:calc(100dvh - 52px)!important;overflow:hidden!important;background:#082846!important;padding:8px 8px 8px!important;display:flex!important;flex-direction:column!important}
 body.mv-shell127 #app>.nav .mv-sidebrand89{display:none!important}
 body.mv-shell127 #app>.nav .mv-sidelinks89{flex:1 1 auto!important;min-height:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;gap:2px!important;padding:0 2px!important;justify-content:flex-start!important}
 body.mv-shell127 #app>.nav .mv-sidelinks89>button{height:var(--mv-item127,31px)!important;min-height:var(--mv-item127,31px)!important;max-height:var(--mv-item127,31px)!important;padding:3px 10px!important;margin:0!important;font-size:11px!important;line-height:1!important;border-radius:5px!important}
 body.mv-shell127 #app>.nav .mv-logout89{height:31px!important;min-height:31px!important;margin:4px 2px 0!important;padding:4px 10px!important;font-size:11px!important}
 body.mv-shell127 #app [id^="p-"].mv-pagefit127{height:calc(100dvh - 52px)!important;max-height:calc(100dvh - 52px)!important;width:100%!important;max-width:none!important;padding:12px 16px!important;overflow:hidden!important}
 body.mv-shell127 #app [id^="p-"].mv-pagefit127>.w,body.mv-shell127 #app [id^="p-"].mv-pagefit127>.wrap,body.mv-shell127 #app [id^="p-"].mv-pagefit127>.container,body.mv-shell127 #app [id^="p-"].mv-pagefit127>.card,body.mv-shell127 #app [id^="p-"].mv-pagefit127>.panel,body.mv-shell127 #app [id^="p-"].mv-pagefit127>.box{width:100%!important;max-width:none!important;box-sizing:border-box!important}
 body.mv-shell127 #app [id^="p-"].mv-pagefit127>*{max-width:none!important}
 body.mv-shell127 #p-painel{display:flex!important;flex-direction:column!important;align-items:stretch!important}
 body.mv-shell127 #p-painel>*{width:100%!important;max-width:none!important}
 body.mv-shell127.mv-sidebar-collapsed89 #app{padding-left:0!important}
}
@media(max-width:899px){
 #mvTopNavV16282.mv-globalhead125{grid-template-columns:40px minmax(0,1fr) 40px!important;padding:5px 9px!important}.mv-headerbrand127{grid-column:2!important;justify-self:start!important}.mv-headerbrand127 small{display:none!important}#mvTopNavV16282.mv-globalhead125 .mv-headtitle125{display:none!important}#mvTopNavV16282.mv-globalhead125 .mv-notify125{grid-column:3!important}
}
`;
if(!s.includes('</style>'))throw new Error('v163.27 css anchor');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.27: continuous header/sidebar and viewport fit installed');
