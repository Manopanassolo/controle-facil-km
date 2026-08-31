const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.29: CSS-authoritative desktop shell. No runtime class toggling = no header flash.
(function(){
 const byId=id=>document.getElementById(id);
 function prepare(){
   const n=document.querySelector('#app>.nav');if(n){n.classList.add('mv-topmenu129');const brand=n.querySelector('.mv-sidebrand89');if(brand){brand.setAttribute('aria-hidden','true')}}
   const bar=byId('mvTopNavV16282');if(bar)bar.classList.add('mv-webhead129');
   document.querySelectorAll('#app [id^="p-"]').forEach(p=>p.classList.add('mv-canvas129'));
   document.body.classList.add('mv-shell-ready129');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepare,{once:true});else prepare();
 [0,80,250,700].forEach(ms=>setTimeout(prepare,ms));addEventListener('pageshow',prepare,true);
})();
`;
if(!s.includes('carga();'))throw new Error('v163.29 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.29: stable web header + full proportional canvas */
@media(min-width:900px){
 html,body{width:100%!important;height:100%!important;overflow:hidden!important}
 #mvTopNavV16282.mv-globalhead125,#mvTopNavV16282.mv-webhead129{display:grid!important;visibility:visible!important;opacity:1!important;transform:none!important;position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:2147483000!important;height:52px!important;min-height:52px!important;max-height:52px!important;width:100%!important;grid-template-columns:minmax(190px,240px) minmax(0,1fr) 42px!important;align-items:center!important;padding:5px clamp(16px,2vw,34px)!important;gap:12px!important;background:#082846!important;border:0!important;border-bottom:1px solid #153b61!important;box-shadow:0 1px 5px rgba(7,23,45,.16)!important;pointer-events:auto!important}
 #mvTopNavV16282 #mvMenuToggleV16282{display:none!important}
 #mvTopNavV16282 .mv-headerbrand127{display:flex!important;visibility:visible!important;grid-column:1!important;color:#fff!important}.mv-headerbrand127 strong{color:#fff!important}.mv-headerbrand127 small{color:#c8ff00!important}
 #mvTopNavV16282 .mv-headtitle125{display:block!important;visibility:visible!important;grid-column:2!important;justify-self:center!important;color:#dce9f6!important;font-size:12px!important}
 #mvTopNavV16282 .mv-notify125{display:block!important;visibility:visible!important;grid-column:3!important;justify-self:end!important;background:#123e78!important;color:#c8ff00!important;border-color:#2a578e!important}
 #app{position:relative!important;width:100vw!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;margin:0!important;padding:94px 0 0!important;background:#f3f6fa!important;overflow:hidden!important;box-sizing:border-box!important}
 #app>.nav,#app>.nav.mv-topmenu128,#app>.nav.mv-topmenu129{display:flex!important;visibility:visible!important;position:fixed!important;z-index:2147482000!important;top:52px!important;left:0!important;right:0!important;bottom:auto!important;width:100vw!important;height:42px!important;min-height:42px!important;max-height:42px!important;margin:0!important;padding:4px clamp(10px,1.5vw,26px)!important;transform:none!important;overflow:hidden!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;background:#fff!important;border:0!important;border-bottom:1px solid #dce3ec!important;box-sizing:border-box!important;pointer-events:auto!important}
 #app>.nav .mv-sidebrand89{display:none!important}
 #app>.nav .mv-sidelinks89{display:flex!important;flex:0 1 auto!important;min-width:0!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:clamp(1px,.25vw,5px)!important;overflow:hidden!important;padding:0!important;margin:0!important}
 #app>.nav .mv-sidelinks89>button{display:flex!important;align-items:center!important;justify-content:center!important;width:auto!important;height:32px!important;min-height:32px!important;max-height:32px!important;flex:0 1 auto!important;padding:4px clamp(5px,.55vw,10px)!important;margin:0!important;border-radius:6px!important;font-size:clamp(9px,.58vw,11px)!important;line-height:1!important;white-space:nowrap!important;color:#173653!important;background:transparent!important}
 #app>.nav .mv-sidelinks89>button.active,#app>.nav .mv-sidelinks89>button[aria-current="page"]{background:#0b76da!important;color:#fff!important}
 #app>.nav .mv-logout89{display:flex!important;width:auto!important;height:32px!important;min-height:32px!important;margin:0 0 0 5px!important;padding:4px 7px!important;font-size:10px!important;background:transparent!important;color:#526b82!important;border:0!important}
 #app [id^="p-"],#app [id^="p-"].mv-pagefit127,#app [id^="p-"].mv-canvas129{position:relative!important;width:100vw!important;max-width:100vw!important;height:calc(100dvh - 94px)!important;min-height:0!important;max-height:calc(100dvh - 94px)!important;margin:0!important;padding:clamp(10px,1.1vw,18px)!important;background:#f3f6fa!important;overflow:auto!important;box-sizing:border-box!important;scrollbar-width:thin!important}
 #app [id^="p-"]>*{max-width:none!important;box-sizing:border-box!important}
 #app [id^="p-"]>.w,#app [id^="p-"]>.wrap,#app [id^="p-"]>.container,#app [id^="p-"]>.card,#app [id^="p-"]>.panel,#app [id^="p-"]>.box{width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}
 #p-inicio{overflow:hidden!important}
 #mvHome88{width:100%!important;max-width:none!important;height:100%!important;max-height:100%!important;margin:0!important;overflow:hidden!important}
 #p-painel{display:flex!important;flex-direction:column!important;align-items:stretch!important}
 #p-painel>*{width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}
 body.mv-sidebar-collapsed89 #app{padding-left:0!important}body.mv-sidebar-collapsed89 #app>.nav{transform:none!important;pointer-events:auto!important}
}
`;
if(!s.includes('</style>'))throw new Error('v163.29 css anchor');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.29: stable CSS web shell and true viewport canvas installed');
