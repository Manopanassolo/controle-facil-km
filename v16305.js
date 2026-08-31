const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 function fix(){
  if(innerWidth<900)return;
  document.body.classList.add('mv-web133');
  document.querySelectorAll('#app [id^="p-"]').forEach(p=>{if(!p.classList.contains('hide')&&!p.hidden){p.style.setProperty('display','block','important');p.style.setProperty('visibility','visible','important');p.style.setProperty('opacity','1','important')}});
 }
 [0,60,180,500,1000].forEach(ms=>setTimeout(fix,ms));addEventListener('hashchange',()=>setTimeout(fix,20));addEventListener('pageshow',fix,true);
})();`;
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.34 proportional agenda + dashboard refinement */
@media(min-width:900px){
 #mvDesktopHeader132{display:grid!important;visibility:visible!important;opacity:1!important;background:#082b50!important}
 body.mv-web132 #app [id^="p-"]:not(.hide):not([hidden]){display:block!important;visibility:visible!important;opacity:1!important}
 body.mv-web132 #p-agenda>.c,body.mv-web132 #p-agenda>.card,body.mv-web132 #p-agenda>.panel{max-width:1180px!important}
 body.mv-web132 #p-agenda .mv-agenda-layout91{display:grid!important;grid-template-columns:minmax(0,820px) minmax(250px,320px)!important;gap:18px!important;align-items:start!important;justify-content:center!important}
 body.mv-web132 #p-agenda .mv-agenda-calendarcard91,body.mv-web132 #p-agenda .agenda-calendar-card{width:100%!important;max-width:820px!important;padding:14px!important;margin:0!important}
 body.mv-web132 #p-agenda .mv-calendar91,body.mv-web132 #p-agenda .agenda-calendar{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:4px!important;width:100%!important;max-width:790px!important;margin:0 auto!important}
 body.mv-web132 #p-agenda .mv-calendar91>* ,body.mv-web132 #p-agenda .agenda-calendar>*{min-height:38px!important;height:38px!important;max-height:38px!important;box-sizing:border-box!important}
 body.mv-web132 #p-agenda .mv-calendar91 button,body.mv-web132 #p-agenda .agenda-calendar button{min-height:38px!important;height:38px!important;max-height:38px!important;padding:3px!important;border-radius:6px!important;background:#f7f9fc!important;color:#173a5c!important;font-size:10px!important;box-shadow:none!important}
 body.mv-web132 #p-agenda .mv-calendar91 button.today,body.mv-web132 #p-agenda .agenda-calendar button.today{background:#e6f0ff!important;color:#0759e6!important;outline:1px solid #75a7ea!important}body.mv-web132 #p-agenda .mv-calendar91 button.selected,body.mv-web132 #p-agenda .agenda-calendar button.selected{background:#087be2!important;color:#fff!important}
 body.mv-web132 #p-agenda .mv-calendar91 .dow,body.mv-web132 #p-agenda .agenda-calendar .dow{min-height:24px!important;height:24px!important;max-height:24px!important;padding:4px 0!important;font-size:9px!important}
 body.mv-web132 #p-agenda .mv-agenda-side91{max-width:320px!important;width:100%!important}body.mv-web132 #p-agenda .calendar-head,body.mv-web132 #p-agenda .agenda-foot,body.mv-web132 #p-agenda .agenda-calendar-head,body.mv-web132 #p-agenda .agenda-calendar-foot{margin:8px 0!important}
 body.mv-web132 #mvHome88 .mv-summary88{overflow:auto!important;padding-right:2px!important}body.mv-web132 #mvHome88 .mv-dashagenda93,body.mv-web132 #mvHome88 [id*="Agenda"]{max-height:360px!important;overflow:hidden!important}body.mv-web132 #mvHome88 .mv-calendar91{gap:3px!important}body.mv-web132 #mvHome88 .mv-calendar91>*{min-height:31px!important;height:31px!important;max-height:31px!important}body.mv-web132 #mvHome88 .mv-calendar91 button{min-height:31px!important;height:31px!important;max-height:31px!important;padding:2px!important;border-radius:5px!important;font-size:9px!important;background:#f5f8fc!important;color:#173a5c!important}
 body.mv-web132 #p-viagem:not(.hide){display:block!important;visibility:visible!important;opacity:1!important}body.mv-web132 #p-viagem>*{max-width:1180px!important;margin-left:auto!important;margin-right:auto!important}body.mv-web132 #p-viagem #novaViagem{max-width:820px!important;margin-left:auto!important;margin-right:auto!important}
 body.mv-web132 #p-painel>*{max-width:1180px!important}body.mv-web132 #p-painel .c{height:auto!important;min-height:0!important}
}
`;
s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.34 compact proportional modules installed');