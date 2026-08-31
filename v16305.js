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
/* v163.33 desktop visibility + proportional agenda refinements */
@media(min-width:900px){
 #mvDesktopHeader132{z-index:2147483647!important;background:#082b50!important;display:grid!important;visibility:visible!important;opacity:1!important}
 #mvDesktopNav132{z-index:2147483646!important}
 body.mv-web132 #app [id^="p-"]:not(.hide):not([hidden]){display:block!important;visibility:visible!important;opacity:1!important}
 body.mv-web132 #p-agenda .agenda-calendar,body.mv-web132 #p-agenda .mini-calendar,body.mv-web132 #p-agenda [class*="calendar"]{width:min(100%,820px)!important;max-width:820px!important;margin-left:auto!important;margin-right:auto!important;gap:4px!important;padding:12px!important}
 body.mv-web132 #p-agenda .agenda-calendar .day,body.mv-web132 #p-agenda .mini-calendar span,body.mv-web132 #p-agenda [class*="calendar"] .day{min-height:46px!important;height:46px!important;max-height:46px!important;padding:4px!important;border-radius:6px!important;font-size:11px!important;line-height:1!important;display:grid!important;place-items:center!important}
 body.mv-web132 #p-agenda .calendar-head,body.mv-web132 #p-agenda .agenda-foot{margin:10px 0!important}
 body.mv-web132 #p-agenda>.c,body.mv-web132 #p-agenda>.card,body.mv-web132 #p-agenda>.panel{max-width:1180px!important}
 body.mv-web132 #p-viagem:not(.hide){display:block!important;visibility:visible!important;opacity:1!important}
 body.mv-web132 #p-viagem>*{max-width:1180px!important;margin-left:auto!important;margin-right:auto!important}
 body.mv-web132 #p-painel>*{max-width:1180px!important}
}
`;
s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.33 desktop visibility and compact agenda installed');