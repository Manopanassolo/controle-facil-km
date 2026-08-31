const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.91: one mobile header, calendar-first agenda, dashboard agenda preview.
(function(){
 const byId=id=>document.getElementById(id);
 const pad=n=>String(n).padStart(2,'0');
 function removeDuplicateTop(){
   const top=byId('mvTopNavV16282');if(!top)return;
   // On mobile the bottom dock is primary; keep only a compact page title row, no old back/home blocks.
   top.classList.add('mv-top91');
   const back=byId('mvBackV16282'),home=byId('mvHomeV16282');if(back)back.classList.add('mv-hide-mobile91');if(home)home.classList.add('mv-hide-mobile91');
 }
 function agendaItems(){
   const candidates=['agenda','agendamentos','appointments','scheduledTrips'];
   for(const k of candidates){try{const v=JSON.parse(localStorage.getItem(k)||'null');if(Array.isArray(v))return v}catch(_){}}
   return [];
 }
 function monthData(offset=0){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()+offset);return d}
 function renderCalendar(host,compact=false){
   if(!host)return;let off=Number(host.dataset.off||0),d=monthData(off),y=d.getFullYear(),m=d.getMonth(),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),today=new Date(),items=agendaItems();
   const names=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
   let html='<div class="mv-calhead91"><button type="button" data-cal91="prev">‹</button><strong>'+d.toLocaleDateString('pt-BR',{month:'long',year:'numeric'})+'</strong><button type="button" data-cal91="next">›</button></div><div class="mv-week91">'+names.map(x=>'<span>'+x+'</span>').join('')+'</div><div class="mv-days91">';
   for(let i=0;i<first;i++)html+='<span class="empty"></span>';
   for(let day=1;day<=days;day++){const iso=y+'-'+pad(m+1)+'-'+pad(day),has=items.some(x=>String(x.data||x.date||x.agData||'').slice(0,10)===iso),isToday=today.getFullYear()===y&&today.getMonth()===m&&today.getDate()===day;html+='<button type="button" class="'+(has?'has ':'')+(isToday?'today':'')+'" data-date91="'+iso+'"><b>'+day+'</b>'+(has?'<i></i>':'')+'</button>'}
   host.innerHTML=html+'</div>';
   host.querySelectorAll('[data-cal91]').forEach(b=>b.onclick=()=>{host.dataset.off=String(off+(b.dataset.cal91==='next'?1:-1));renderCalendar(host,compact)});
 }
 function dashboardAgenda(){
   const grid=document.querySelector('#mvHome88 .mv-homegrid88');if(!grid)return;let box=byId('mvDashAgenda91');if(!box){box=document.createElement('aside');box.id='mvDashAgenda91';box.className='mv-panel88 mv-dashagenda91';box.innerHTML='<div class="mv-paneltitle88"><div><h2>Agenda</h2><p>Compromissos programados</p></div><button type="button" data-mv88="agenda">Abrir agenda</button></div><div id="mvDashCal91" class="mv-calendar91 compact"></div>';grid.appendChild(box)}renderCalendar(byId('mvDashCal91'),true);
 }
 function agendaPage(){
   const p=byId('p-agenda');if(!p)return;let shell=byId('mvAgenda91');if(!shell){shell=document.createElement('div');shell.id='mvAgenda91';shell.innerHTML='<div class="mv-agenda-layout91"><section class="mv-agenda-calendarcard91"><div id="mvAgendaCal91" class="mv-calendar91"></div></section><aside class="mv-agenda-side91"><h3>Novo compromisso</h3><p>Cadastre uma visita, reunião ou percurso programado.</p><button type="button" id="mvAgendaNew91">＋ Novo compromisso</button><div id="mvAgendaSelected91"><b>Selecione um dia</b><span>Os compromissos da data aparecerão aqui.</span></div></aside></div>';const head=p.querySelector(':scope>.mv-pagehead87');head?head.insertAdjacentElement('afterend',shell):p.insertAdjacentElement('afterbegin',shell);byId('mvAgendaNew91').onclick=()=>{p.classList.add('mv-agenda-edit91');p.querySelector('.mv-agendaform90')?.scrollIntoView({behavior:'smooth',block:'start'})}}renderCalendar(byId('mvAgendaCal91'));
   p.querySelectorAll('[data-date91]').forEach(b=>b.onclick=()=>{const sel=byId('mvAgendaSelected91');if(sel)sel.innerHTML='<b>'+new Date(b.dataset.date91+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})+'</b><span>Nenhum compromisso carregado para esta data.</span>'});
 }
 function sync(){removeDuplicateTop();dashboardAgenda();agendaPage()}
 [0,120,400,900,1800].forEach(ms=>setTimeout(sync,ms));document.addEventListener('click',()=>setTimeout(sync,80),true);globalThis.mvCalendarV16291={sync};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.91 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.91 */
.mv-calendar91{border:1px solid #e1e6ed;border-radius:8px;background:#fff;padding:12px}.mv-calhead91{display:grid;grid-template-columns:34px 1fr 34px;align-items:center;gap:6px;margin-bottom:10px}.mv-calhead91 strong{text-align:center;text-transform:capitalize;font-size:13px;color:#21324a}.mv-calhead91 button{width:34px!important;height:32px!important;min-height:32px!important;padding:0!important;background:#f5f7fa!important;color:#30425b!important;border:1px solid #dfe5ed!important;border-radius:6px!important}.mv-week91,.mv-days91{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.mv-week91 span{text-align:center;font-size:9px;color:#8792a3;padding:3px}.mv-days91>button,.mv-days91>span{aspect-ratio:1;min-height:34px!important;padding:0!important;border-radius:6px!important;background:#fff!important;color:#27384f!important;border:1px solid transparent!important;display:grid;place-items:center;position:relative}.mv-days91>button:hover{background:#f3f7fd!important}.mv-days91>button.today{border-color:#0b66e4!important;color:#0b66e4!important}.mv-days91>button.has{background:#eef5ff!important}.mv-days91>button i{position:absolute;width:5px;height:5px;border-radius:50%;background:#0b66e4;bottom:3px}.mv-dashagenda91{grid-column:2}.mv-dashagenda91 .mv-calendar91{border:0;padding:0}.mv-dashagenda91 .mv-days91>button,.mv-dashagenda91 .mv-days91>span{min-height:27px!important;font-size:9px}.mv-agenda-layout91{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(240px,.65fr);gap:12px;max-width:1180px;margin:0 auto 12px}.mv-agenda-calendarcard91,.mv-agenda-side91{background:#fff;border:1px solid #e1e6ed;border-radius:8px;padding:14px}.mv-agenda-side91 h3{margin:0 0 4px;font-size:14px}.mv-agenda-side91 p{font-size:10px;color:#778397}.mv-agenda-side91>button{background:#0b66e4!important;border-radius:6px!important}.mv-agenda-side91 #mvAgendaSelected91{display:grid;gap:4px;margin-top:14px;padding-top:12px;border-top:1px solid #edf0f4}.mv-agenda-side91 #mvAgendaSelected91 b{font-size:11px;text-transform:capitalize}.mv-agenda-side91 #mvAgendaSelected91 span{font-size:10px;color:#8490a1}.mv-agenda90>.mv-agendaform90{display:none!important}.mv-agenda90.mv-agenda-edit91>.mv-agendaform90{display:block!important}
@media(min-width:900px){#mvHome88 .mv-homegrid88{grid-template-columns:minmax(0,1.6fr) minmax(300px,.72fr)!important}.mv-summary88{grid-column:2}.mv-recent88{grid-row:1 / span 2}.mv-dashagenda91{grid-column:2}}
@media(max-width:899px){#mvTopNavV16282.mv-top91{grid-template-columns:minmax(0,1fr)!important;height:42px!important;padding:7px 14px!important}#mvTopNavV16282.mv-top91 .mv-hide-mobile91{display:none!important}#mvTopNavV16282.mv-top91 #mvPageTitleV16282{grid-column:1!important;font-size:13px!important}.mv-agenda-layout91{grid-template-columns:1fr;margin:0 0 90px}.mv-agenda-side91{order:-1}.mv-dashagenda91{grid-column:auto}.mv-calendar91{padding:9px}.mv-days91>button,.mv-days91>span{min-height:38px!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.91 css anchor');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.91: single mobile topbar and calendar agenda installed');