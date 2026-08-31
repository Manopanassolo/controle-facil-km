const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.98: structural reference recovery — one shell, reliable trip entry, reference-first trip/agenda layout.
(function(){
 const byId=id=>document.getElementById(id);
 const hide=el=>{if(!el)return;el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');el.style.setProperty('pointer-events','none','important');el.setAttribute('aria-hidden','true')};
 function removeDuplicateShell(){
   hide(byId('mvTopNavV16282'));
   document.querySelectorAll('body *').forEach(el=>{
     if(el.id==='auth'||el.closest('#auth')||el.id==='mvBottomDock85'||el.closest('#mvBottomDock85')||el.matches('#app>.nav,#app>.nav *'))return;
     const t=(el.textContent||'').replace(/\s+/g,' ').trim();
     if(!t)return;
     let cs;try{cs=getComputedStyle(el)}catch(_){return}
     const r=el.getBoundingClientRect();
     const topShell=(cs.position==='fixed'||cs.position==='sticky')&&r.top<=4&&r.height>20&&r.height<100&&(/Movvant/i.test(t)||/USU.RIO/i.test(t));
     const duplicateBrand=/^Movvant\s+Inteligência comercial em campo/i.test(t)&&r.height<130;
     if(topShell||duplicateBrand)hide(el);
   });
   document.body.classList.add('mv-ref98');
 }
 function showPage(p){
   try{globalThis.mvNavigationV16282?.navigate?.(p)}catch(_){}
   document.body.dataset.mvPage=p;document.body.dataset.mvRoute=p;
   document.querySelectorAll('#app>section[id^="p-"]').forEach(sec=>{const on=sec.id==='p-'+p;sec.classList.toggle('hide',!on);sec.style.setProperty('display',on?'block':'none','important')});
   try{history.replaceState(null,'','#p='+p)}catch(_){}
   if(p==='viagem'){const sec=byId('p-viagem');sec?.classList.remove('hide');const form=byId('novaViagem');if(form){form.classList.remove('hide');form.style.setProperty('display','block','important')}}
 }
 window.addEventListener('click',e=>{
   const t=e.target?.closest?.('[data-mv88="viagem"],#mvBottomDock85 [data-mv-dock="viagem"],[data-p="viagem"],[data-p-jump="viagem"]');
   if(!t)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();showPage('viagem');
 },true);
 function tripReference(){
   const p=byId('p-viagem'),form=byId('novaViagem');if(!p||!form)return;
   p.classList.add('mv-trip-page98');form.classList.add('mv-trip-ref98');
   let head=byId('mvTripRefHead98');if(!head){head=document.createElement('div');head.id='mvTripRefHead98';head.innerHTML='<h1>Agendar viagem</h1><p>Programe o deslocamento agora e confirme a realização depois.</p>';form.insertAdjacentElement('afterbegin',head)}
   let info=byId('mvTripInfo98');if(!info){info=document.createElement('div');info.id='mvTripInfo98';info.innerHTML='<b>Viagem programada</b><span>Esta viagem ficará na Agenda. KM e despesas só serão contabilizados depois que você confirmar que ela realmente aconteceu. Você pode deixar a quilometragem em branco agora.</span>';head.insertAdjacentElement('afterend',info)}
   const fold=byId('mvRouteFold93');if(fold){fold.open=false;fold.classList.add('mv-route-ref98')}
 }
 function agendaReference(){
   const p=byId('p-agenda'),shell=byId('mvAgenda91');if(!p||!shell)return;
   p.classList.add('mv-agenda-ref98');
   let intro=byId('mvAgendaIntro98');if(!intro){intro=document.createElement('div');intro.id='mvAgendaIntro98';intro.innerHTML='<div><span>AGENDA</span><h1>Viagens programadas</h1><p>Agendamentos não alteram KM ou despesas até você confirmar que a viagem foi realizada.</p></div>';shell.insertAdjacentElement('afterbegin',intro)}
   const layout=shell.querySelector('.mv-agenda-layout91');layout?.classList.add('mv-agenda-calendar-only98');
   const side=shell.querySelector('.mv-agenda-side91');if(side)hide(side);
   byId('mvAgendaMonthList93')?.classList.add('mv-agenda-month-ref98');
 }
 function dashboardReference(){
   const h=byId('mvHome88');if(!h)return;h.classList.add('mv-home-ref98');
   byId('mvDashAgenda91')?.classList.add('mv-dash-agenda-ref98');
 }
 function sync(){removeDuplicateShell();tripReference();agendaReference();dashboardReference()}
 [0,80,180,400,800,1400,2600].forEach(ms=>setTimeout(sync,ms));
 document.addEventListener('click',()=>setTimeout(sync,40),true);
 globalThis.mvReferenceAuthorityV16298={sync,showPage};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.98 startup anchor');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.98 reference-first structural UI */
#mvTopNavV16282{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;pointer-events:none!important}
body.mv-ref98{background:#f5f7fb!important}body.mv-ref98 #app{padding-top:0!important}
#mvTripRefHead98{padding:2px 2px 10px}#mvTripRefHead98 h1{margin:0;font-size:24px;line-height:1.15;color:#17233a}#mvTripRefHead98 p{margin:5px 0 0;font-size:11px;color:#7c8798}
#mvTripInfo98{display:grid;gap:4px;margin:0 0 14px;padding:12px 14px;border:1px solid #f4cf63;border-radius:9px;background:#fff8dc;color:#665010}#mvTripInfo98 b{font-size:11px}#mvTripInfo98 span{font-size:10px;line-height:1.45}
.mv-trip-ref98{max-width:720px!important;margin:0 auto 100px!important;background:#fff!important;border:1px solid #e2e7ee!important;box-shadow:0 4px 16px #10213a0a!important;padding:18px!important}.mv-trip-ref98 .mv-route-ref98{margin:12px 0 14px!important;background:#fbfcff!important;border:1px dashed #c9d4e3!important}.mv-trip-ref98 .mv-route-ref98>summary{min-height:62px!important}.mv-trip-ref98 input,.mv-trip-ref98 select,.mv-trip-ref98 textarea{background:#fff!important;border:1px solid #d8e0ea!important;border-radius:8px!important}
#mvAgendaIntro98{max-width:1180px;margin:0 auto 10px;padding:16px 18px;background:#fff;border:1px solid #e1e6ed;border-radius:9px}#mvAgendaIntro98 span{font-size:9px;font-weight:800;letter-spacing:.12em;color:#6e7c91}#mvAgendaIntro98 h1{margin:4px 0 3px;font-size:20px;color:#17233a}#mvAgendaIntro98 p{margin:0;font-size:10px;color:#7b8798}.mv-agenda-calendar-only98{display:block!important;max-width:1180px!important}.mv-agenda-calendar-only98 .mv-agenda-calendarcard91{width:100%!important;padding:18px!important}.mv-agenda-calendar-only98 .mv-calendar91{border:0!important}.mv-agenda-month-ref98{max-width:1180px!important;margin-top:10px!important}.mv-agenda-month-ref98 .mv-agenda-monthhead93 b{font-size:16px!important}.mv-agenda-entry93{min-height:68px!important}
.mv-home-ref98 .mv-dash-agenda-ref98{display:block!important}.mv-home-ref98 .mv-dash-agenda-ref98 .mv-calendar91{background:#fff!important}
@media(max-width:899px){body.mv-ref98 #app{padding-top:0!important}.mv-trip-page98{padding-top:8px!important}.mv-trip-ref98{margin:0 10px 92px!important;padding:14px!important}#mvTripRefHead98 h1{font-size:21px}#mvAgendaIntro98{margin:10px 10px 8px;padding:14px}.mv-agenda-calendar-only98{margin:0 10px 10px!important}.mv-agenda-calendar-only98 .mv-agenda-calendarcard91{padding:12px!important}.mv-agenda-month-ref98{margin:0 10px 92px!important}#mvBottomDock85{display:grid!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.98 css anchor');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.98: reference-first shell, trip and agenda structurally enforced');
