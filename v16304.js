const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 function ready(){document.body.classList.add('mv-web131');const top=document.getElementById('mvTopNavV16282');if(top){top.classList.remove('hide');top.removeAttribute('aria-hidden')}const nav=document.querySelector('#app>.nav');if(nav){nav.classList.remove('hide');nav.removeAttribute('aria-hidden')}}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();[0,150,600].forEach(x=>setTimeout(ready,x));
})();`;
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.32: proportional framing rule for every desktop module */
@media(min-width:900px){
 html,body{width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important;background:#f4f7fb!important}
 body.mv-web131 #mvTopNavV16282{display:grid!important;visibility:visible!important;opacity:1!important;transform:none!important;position:fixed!important;inset:0 0 auto 0!important;z-index:2147483000!important;width:100%!important;height:56px!important;grid-template-columns:280px minmax(0,1fr) 48px!important;align-items:center!important;gap:16px!important;padding:6px clamp(22px,2.5vw,44px)!important;box-sizing:border-box!important;background:#082b50!important;border:0!important;border-bottom:1px solid #17446f!important;box-shadow:0 1px 5px rgba(8,32,58,.16)!important}
 body.mv-web131 #mvTopNavV16282 #mvMenuToggleV16282,body.mv-web131 #mvTopNavV16282 #mvBackV16282,body.mv-web131 #mvTopNavV16282 #mvHomeV16282{display:none!important}
 body.mv-web131 #mvTopNavV16282 .mv-headerbrand127{display:flex!important;visibility:visible!important;opacity:1!important;grid-column:1!important;align-items:center!important;gap:10px!important;color:#fff!important}.mv-web131 .mv-headerbrand127 strong{color:#fff!important;font-size:15px!important}.mv-web131 .mv-headerbrand127 small{display:block!important;color:#c8ff00!important;font-size:8px!important}.mv-web131 .mv-brandmark127{width:32px!important;height:32px!important;flex:0 0 32px!important}
 body.mv-web131 #mvTopNavV16282 .mv-headtitle125{display:block!important;visibility:visible!important;grid-column:2!important;justify-self:center!important;color:#d8e6f4!important;font-size:12px!important;font-weight:650!important}
 body.mv-web131 #mvTopNavV16282 .mv-notify125{display:grid!important;visibility:visible!important;grid-column:3!important;place-items:center!important;width:34px!important;height:34px!important;justify-self:end!important;background:#123f73!important;color:#c8ff00!important;border:1px solid #2c5b8c!important;border-radius:8px!important}
 body.mv-web131 #app{position:fixed!important;inset:0!important;width:100%!important;height:100dvh!important;max-width:none!important;margin:0!important;padding:102px 0 0!important;overflow:hidden!important;background:#f4f7fb!important;box-sizing:border-box!important}
 body.mv-web131 #app>.nav{display:flex!important;visibility:visible!important;opacity:1!important;transform:none!important;position:fixed!important;z-index:2147482000!important;top:56px!important;left:0!important;right:0!important;width:100%!important;height:46px!important;padding:6px clamp(20px,2.4vw,42px)!important;margin:0!important;box-sizing:border-box!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;background:#fff!important;border:0!important;border-bottom:1px solid #dce4ed!important}
 body.mv-web131 #app>.nav .mv-sidebrand89,body.mv-web131 #app>.nav .mv-logout89{display:none!important}
 body.mv-web131 #app>.nav .mv-sidelinks89{display:flex!important;width:100%!important;max-width:1360px!important;height:34px!important;align-items:center!important;justify-content:flex-start!important;gap:4px!important;padding:0!important;margin:0 auto!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important}.mv-web131 #app>.nav .mv-sidelinks89::-webkit-scrollbar{display:none!important}
 body.mv-web131 #app>.nav .mv-sidelinks89>button{display:flex!important;width:auto!important;height:32px!important;min-width:max-content!important;flex:0 0 auto!important;align-items:center!important;justify-content:center!important;padding:4px 10px!important;margin:0!important;border:0!important;border-radius:7px!important;background:transparent!important;color:#173a5c!important;font-size:10px!important;font-weight:650!important;white-space:nowrap!important}
 body.mv-web131 #app>.nav .mv-sidelinks89>button.active,body.mv-web131 #app>.nav .mv-sidelinks89>button[aria-current="page"]{background:#087be2!important;color:#fff!important}
 body.mv-web131 #app [id^="p-"]{position:absolute!important;inset:102px 0 0 0!important;width:100%!important;max-width:none!important;height:calc(100dvh - 102px)!important;margin:0!important;padding:14px clamp(20px,2.5vw,44px) 20px!important;box-sizing:border-box!important;background:#f4f7fb!important;overflow-y:auto!important;overflow-x:hidden!important}
 body.mv-web131 #app [id^="p-"]>*{max-width:none!important;box-sizing:border-box!important}
 body.mv-web131 #app [id^="p-"]>.w,body.mv-web131 #app [id^="p-"]>.wrap,body.mv-web131 #app [id^="p-"]>.container{width:100%!important;max-width:1380px!important;margin-left:auto!important;margin-right:auto!important}
 body.mv-web131 #p-inicio{overflow:hidden!important}body.mv-web131 #mvHome88{width:100%!important;max-width:1380px!important;height:100%!important;margin:0 auto!important;padding:0!important;overflow:hidden!important}
 body.mv-web131 #mvHome88 .mv-head88{min-height:48px!important;margin-bottom:8px!important}.mv-web131 #mvHome88 .mv-kpis88{min-height:76px!important}.mv-web131 #mvHome88 .mv-homegrid88{grid-template-columns:minmax(0,1.45fr) minmax(310px,.75fr)!important;gap:12px!important;height:calc(100% - 140px)!important;min-height:0!important}.mv-web131 #mvHome88 .mv-recent88,.mv-web131 #mvHome88 .mv-summary88{height:100%!important;min-height:0!important;overflow:hidden!important}.mv-web131 #mvHome88 .mv-summary88>*{max-height:100%!important}
 /* Global framing: large single widgets become cards in a logical grid rather than stretching to the viewport */
 body.mv-web131 #p-agenda>*,body.mv-web131 #p-viagem>*,body.mv-web131 #p-rotas>*,body.mv-web131 #p-painel>*{max-width:1380px!important;margin-left:auto!important;margin-right:auto!important}
 body.mv-web131 #p-agenda .card,body.mv-web131 #p-agenda .panel,body.mv-web131 #p-agenda .box{height:auto!important;max-height:620px!important;overflow:auto!important}
 body.mv-web131 #p-agenda table{font-size:12px!important}body.mv-web131 #p-agenda td,body.mv-web131 #p-agenda th{height:auto!important;min-height:0!important;padding:6px!important}
 body.mv-web131 #p-agenda [class*="calendar"],body.mv-web131 #p-agenda [id*="calendar"]{width:min(100%,860px)!important;max-width:860px!important;height:auto!important;max-height:600px!important}
 body.mv-web131 #p-viagem .card,body.mv-web131 #p-rotas .card{height:auto!important;min-height:0!important}
 body.mv-web131.mv-sidebar-collapsed89 #app{padding-left:0!important}body.mv-web131.mv-sidebar-collapsed89 #app>.nav{transform:none!important;pointer-events:auto!important}
}
`;
s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.32 proportional desktop framing installed');