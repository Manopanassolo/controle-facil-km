const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 function ready(){
  document.body.classList.add('mv-web131');
  const top=document.getElementById('mvTopNavV16282');
  if(top){top.classList.remove('hide');top.removeAttribute('aria-hidden');}
  const nav=document.querySelector('#app>.nav');
  if(nav){nav.classList.remove('hide');nav.removeAttribute('aria-hidden');}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
 setTimeout(ready,0);setTimeout(ready,150);setTimeout(ready,600);
})();
`;
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.31 visual candidate - one desktop shell, no sidebar */
@media(min-width:900px){
 html,body{width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important;background:#f4f7fb!important}
 body.mv-web131 #mvTopNavV16282{display:grid!important;visibility:visible!important;opacity:1!important;transform:none!important;position:fixed!important;inset:0 0 auto 0!important;z-index:2147483000!important;width:100%!important;height:54px!important;min-height:54px!important;max-height:54px!important;grid-template-columns:250px minmax(0,1fr) 42px!important;align-items:center!important;gap:16px!important;padding:5px clamp(20px,2.3vw,42px)!important;box-sizing:border-box!important;background:#082b50!important;border:0!important;border-bottom:1px solid #17446f!important;box-shadow:0 1px 4px rgba(8,32,58,.14)!important}
 body.mv-web131 #mvTopNavV16282 #mvMenuToggleV16282,body.mv-web131 #mvTopNavV16282 #mvBackV16282,body.mv-web131 #mvTopNavV16282 #mvHomeV16282{display:none!important}
 body.mv-web131 #mvTopNavV16282 .mv-headerbrand127{display:flex!important;grid-column:1!important;align-items:center!important;gap:9px!important;color:#fff!important}.mv-web131 .mv-headerbrand127 strong{color:#fff!important;font-size:14px!important}.mv-web131 .mv-headerbrand127 small{display:block!important;color:#c8ff00!important;font-size:8px!important;margin-top:2px!important}.mv-web131 .mv-brandmark127{width:30px!important;height:30px!important;flex:0 0 30px!important}
 body.mv-web131 #mvTopNavV16282 .mv-headtitle125{display:block!important;grid-column:2!important;justify-self:center!important;color:#d8e6f4!important;font-size:12px!important;font-weight:650!important}
 body.mv-web131 #mvTopNavV16282 .mv-notify125{display:grid!important;grid-column:3!important;place-items:center!important;width:34px!important;height:34px!important;min-height:34px!important;justify-self:end!important;background:#123f73!important;color:#c8ff00!important;border:1px solid #2c5b8c!important;border-radius:7px!important}
 body.mv-web131 #app{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;max-width:none!important;margin:0!important;padding:98px 0 0!important;overflow:hidden!important;background:#f4f7fb!important;box-sizing:border-box!important}
 body.mv-web131 #app>.nav{display:flex!important;visibility:visible!important;opacity:1!important;transform:none!important;position:fixed!important;z-index:2147482000!important;top:54px!important;left:0!important;right:0!important;bottom:auto!important;width:100%!important;height:44px!important;min-height:44px!important;max-height:44px!important;padding:5px clamp(16px,2vw,36px)!important;margin:0!important;box-sizing:border-box!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;background:#fff!important;border:0!important;border-bottom:1px solid #dce4ed!important;box-shadow:none!important}
 body.mv-web131 #app>.nav .mv-sidebrand89{display:none!important}
 body.mv-web131 #app>.nav .mv-sidelinks89{display:flex!important;flex:0 1 auto!important;min-width:0!important;max-width:calc(100vw - 90px)!important;height:34px!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:3px!important;padding:0!important;margin:0!important;overflow:hidden!important}
 body.mv-web131 #app>.nav .mv-sidelinks89>button{display:flex!important;width:auto!important;height:32px!important;min-height:32px!important;max-height:32px!important;flex:0 1 auto!important;align-items:center!important;justify-content:center!important;padding:4px clamp(6px,.55vw,11px)!important;margin:0!important;border:0!important;border-radius:6px!important;background:transparent!important;color:#173a5c!important;font-size:clamp(9px,.62vw,11px)!important;font-weight:600!important;line-height:1!important;white-space:nowrap!important}
 body.mv-web131 #app>.nav .mv-sidelinks89>button.active,body.mv-web131 #app>.nav .mv-sidelinks89>button[aria-current="page"]{background:#087be2!important;color:#fff!important}
 body.mv-web131 #app>.nav .mv-logout89{display:none!important}
 body.mv-web131 #app [id^="p-"]{position:absolute!important;inset:98px 0 0 0!important;width:100%!important;max-width:none!important;height:calc(100dvh - 98px)!important;max-height:calc(100dvh - 98px)!important;margin:0!important;padding:12px clamp(18px,2vw,36px) 16px!important;box-sizing:border-box!important;background:#f4f7fb!important;overflow:auto!important;overflow-x:hidden!important}
 body.mv-web131 #app [id^="p-"]>*{max-width:none!important;box-sizing:border-box!important}
 body.mv-web131 #app [id^="p-"]>.w,body.mv-web131 #app [id^="p-"]>.wrap,body.mv-web131 #app [id^="p-"]>.container,body.mv-web131 #app [id^="p-"]>.card,body.mv-web131 #app [id^="p-"]>.panel,body.mv-web131 #app [id^="p-"]>.box{width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}
 body.mv-web131 #p-inicio{overflow:hidden!important}
 body.mv-web131 #mvHome88{width:100%!important;max-width:none!important;height:100%!important;max-height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important}
 body.mv-web131 #mvHome88 .mv-head88{min-height:50px!important;margin-bottom:9px!important}.mv-web131 #mvHome88 .mv-kpis88{min-height:82px!important}.mv-web131 #mvHome88 .mv-homegrid88{grid-template-columns:minmax(0,1.65fr) minmax(340px,.85fr)!important;gap:12px!important;min-height:0!important;height:calc(100% - 150px)!important}.mv-web131 #mvHome88 .mv-recent88,.mv-web131 #mvHome88 .mv-summary88{min-height:0!important;height:100%!important}.mv-web131 #mvHome88 .mv-empty88{min-height:0!important}
 body.mv-web131 #p-painel{display:flex!important;flex-direction:column!important;align-items:stretch!important}.mv-web131 #p-painel>*{width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}
 body.mv-web131 #p-agenda,body.mv-web131 #p-viagem,body.mv-web131 #p-rotas{padding-top:12px!important}
 body.mv-web131.mv-sidebar-collapsed89 #app{padding-left:0!important}body.mv-web131.mv-sidebar-collapsed89 #app>.nav{transform:none!important;pointer-events:auto!important}
}
`;
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.31 visual candidate installed');