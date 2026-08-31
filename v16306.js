const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 function arrange(){
  if(innerWidth<900)return;
  const p=document.getElementById('p-agenda');if(!p)return;
  const shell=document.getElementById('mvAgenda91');
  const layout=p.querySelector('.mv-agenda-layout91');
  const month=document.getElementById('mvAgendaMonthList93');
  if(layout){layout.classList.add('mv-agenda-workspace135')}
  if(month){month.classList.add('mv-agenda-month135')}
  const cal=document.getElementById('mvAgendaCal91')||p.querySelector('.agenda-calendar');if(cal)cal.classList.add('mv-calendar-compact135');
  const dash=document.getElementById('mvDashAgenda91');if(dash)dash.classList.add('mv-dashagenda135');
 }
 [0,100,300,800,1600].forEach(ms=>setTimeout(arrange,ms));document.addEventListener('click',()=>setTimeout(arrange,60),true);addEventListener('pageshow',arrange,true);
})();`;
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.35 agenda workspace: compact calendar + side actions + commitments below */
@media(min-width:900px){
 body.mv-web132 #p-agenda{padding-top:12px!important}
 body.mv-web132 #p-agenda .mv-agenda-workspace135{display:grid!important;grid-template-columns:minmax(560px,760px) minmax(260px,330px)!important;gap:18px!important;align-items:start!important;justify-content:center!important;width:100%!important;max-width:1120px!important;margin:0 auto 14px!important}
 body.mv-web132 #p-agenda .mv-agenda-calendarcard91{width:100%!important;max-width:760px!important;padding:14px 16px!important;margin:0!important;border-radius:10px!important;box-sizing:border-box!important}
 body.mv-web132 #p-agenda .mv-agenda-side91{width:100%!important;max-width:330px!important;min-height:0!important;padding:14px!important;border-radius:10px!important;box-sizing:border-box!important}
 body.mv-web132 #p-agenda .mv-calendar-compact135{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:5px!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;background:transparent!important}
 body.mv-web132 #p-agenda .mv-calendar-compact135>*{min-width:0!important;min-height:34px!important;height:34px!important;max-height:34px!important;margin:0!important;padding:0!important;box-sizing:border-box!important}
 body.mv-web132 #p-agenda .mv-calendar-compact135 button{display:grid!important;place-items:center!important;min-height:34px!important;height:34px!important;max-height:34px!important;padding:2px!important;border-radius:6px!important;background:#f5f8fc!important;color:#173a5c!important;border:1px solid #edf1f6!important;font-size:10px!important;line-height:1!important;box-shadow:none!important}
 body.mv-web132 #p-agenda .mv-calendar-compact135 .dow{display:grid!important;place-items:center!important;height:22px!important;min-height:22px!important;max-height:22px!important;color:#7a8797!important;font-size:9px!important;font-weight:800!important}
 body.mv-web132 #p-agenda .mv-calendar-compact135 .empty{height:34px!important;min-height:34px!important;max-height:34px!important}
 body.mv-web132 #p-agenda .mv-calendar-compact135 button.today{background:#e9f2ff!important;color:#0759e6!important;border-color:#9bc0f2!important;outline:0!important}body.mv-web132 #p-agenda .mv-calendar-compact135 button.selected{background:#087be2!important;color:#fff!important;border-color:#087be2!important}
 body.mv-web132 #p-agenda .mv-agenda-month135{width:100%!important;max-width:1120px!important;margin:0 auto 24px!important;padding:14px 16px!important;border-radius:10px!important;box-sizing:border-box!important}
 body.mv-web132 #p-agenda .mv-agenda-monthhead93{margin-bottom:6px!important}body.mv-web132 #p-agenda .mv-agenda-entry93{padding:10px 8px!important}
 body.mv-web132 #p-agenda .agenda-calendar-card:not(.mv-agenda-calendarcard91){display:none!important}
 body.mv-web132 #mvHome88 .mv-summary88{overflow:hidden!important}body.mv-web132 #mvHome88 .mv-dashagenda135{max-height:310px!important;overflow:hidden!important}body.mv-web132 #mvHome88 .mv-dashagenda135 .mv-calendar91{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:3px!important}body.mv-web132 #mvHome88 .mv-dashagenda135 .mv-calendar91>*{min-height:27px!important;height:27px!important;max-height:27px!important;margin:0!important;box-sizing:border-box!important}body.mv-web132 #mvHome88 .mv-dashagenda135 .mv-calendar91 button{min-height:27px!important;height:27px!important;max-height:27px!important;padding:1px!important;font-size:8px!important;border-radius:4px!important}body.mv-web132 #mvHome88 .mv-dashagenda135 .mv-calendar91 .dow{height:19px!important;min-height:19px!important;max-height:19px!important;font-size:8px!important}
 body.mv-web132 #mvHome88 .mv-homegrid88{height:calc(100% - 132px)!important}body.mv-web132 #mvHome88 .mv-summary88{padding-bottom:10px!important}
}
`;
s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.35 agenda workspace and dashboard mini calendar installed');