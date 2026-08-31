const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.93: recover the clean legacy UX — route planning collapsed; agenda calendar + monthly commitments.
(function(){
 const byId=id=>document.getElementById(id);
 function moveInto(parent,node){if(parent&&node&&node.parentElement!==parent)parent.appendChild(node)}
 function cleanTrip(){
   const form=byId('novaViagem');if(!form)return;
   form.classList.add('mv-trip-clean93');
   let details=byId('mvRouteFold93');
   if(!details){
     details=document.createElement('details');details.id='mvRouteFold93';details.className='mv-route-fold93';
     details.innerHTML='<summary><span class="mv-route-icon93">⌖</span><span><b>Planejar rota</b><small>Origem, destino, paradas, alternativas e mapa</small></span><i>＋</i></summary><div id="mvRouteFoldBody93" class="mv-route-fold-body93"></div>';
     const date=byId('dataViagem')?.closest('.r')||byId('motivo')?.closest('.r');
     date?.insertAdjacentElement('afterend',details);
     details.addEventListener('toggle',()=>{details.querySelector('summary i').textContent=details.open?'−':'＋';if(details.open)setTimeout(()=>globalThis.mvNativeLeafletControllerV16279?.invalidate?.(),120)});
   }
   const body=byId('mvRouteFoldBody93');
   const routeNodes=[];
   const origin=byId('origem'),dest=byId('destino');
   const orow=origin?.closest('.r');if(orow)routeNodes.push(orow);
   ['preTripStopsV127','routeBuilderV125','mvPlanRouteV16272','routePlanResultsV131','routeMapWrapV133'].forEach(id=>{const n=byId(id);if(n)routeNodes.push(n)});
   // Route controls created by successive route patches often share these classes.
   form.querySelectorAll('.route-planner,.route-plan,.pre-trip-stops-v127,.route-builder-v125,.mv-route-plan62,.mv-route-results,.route-map-wrap').forEach(n=>routeNodes.push(n));
   [...new Set(routeNodes)].forEach(n=>{if(n&&!details.contains(n))moveInto(body,n)});
   // Keep the route planner compact by default; do not close it once the user opened it.
   if(!details.dataset.mvInit93){details.open=false;details.dataset.mvInit93='1'}
 }
 function agendaList(){
   const shell=byId('mvAgenda91'),list=byId('agendaLista');if(!shell||!list)return;
   let wrap=byId('mvAgendaMonthList93');if(!wrap){wrap=document.createElement('section');wrap.id='mvAgendaMonthList93';wrap.className='mv-agenda-month93';wrap.innerHTML='<div class="mv-agenda-monthhead93"><div><b>Compromissos do mês</b><span>Viagens e compromissos programados</span></div><button type="button" id="mvAgendaNewTop93">＋ Nova viagem</button></div><div id="mvAgendaListSlot93"></div>';shell.appendChild(wrap);byId('mvAgendaNewTop93').onclick=()=>{const p=byId('p-agenda');p?.classList.add('mv-agenda-edit91');p?.querySelector('.mv-agendaform90')?.scrollIntoView({behavior:'smooth',block:'start'})}}
   moveInto(byId('mvAgendaListSlot93'),list);list.classList.add('mv-agenda-list93');
   list.querySelectorAll(':scope>.row').forEach(row=>row.classList.add('mv-agenda-entry93'));
 }
 function agendaTop(){
   const p=byId('p-agenda');if(!p)return;
   const side=p.querySelector('.mv-agenda-side91');if(side){side.classList.add('mv-agenda-sidecompact93');const b=byId('mvAgendaNew91');if(b)b.textContent='＋ Nova viagem'}
   const cal=byId('mvAgendaCal91');if(cal)cal.classList.add('mv-agenda-maincal93');
 }
 function dashboard(){
   const home=byId('mvHome88'),cal=byId('mvDashCal91');if(!home||!cal)return;
   byId('mvDashAgenda91')?.classList.add('mv-dashagenda93');
 }
 function sync(){cleanTrip();agendaTop();agendaList();dashboard()}
 [0,100,300,700,1400,2600].forEach(ms=>setTimeout(sync,ms));
 document.addEventListener('click',()=>setTimeout(sync,80),true);
 globalThis.mvReferenceV16293={sync};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.93 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.93 legacy-clean reference fidelity */
.mv-trip-clean93{max-width:760px!important;padding:18px!important;border-radius:10px!important}.mv-trip-clean93>.r{gap:12px!important}.mv-trip-clean93 input,.mv-trip-clean93 select,.mv-trip-clean93 textarea{min-height:48px!important;border-radius:8px!important}.mv-trip-clean93 textarea{min-height:100px!important}.mv-route-fold93{margin:14px 0!important;border:1px dashed #ccd6e4!important;border-radius:10px!important;background:#fbfcfe!important;overflow:hidden!important}.mv-route-fold93>summary{list-style:none;display:grid!important;grid-template-columns:44px minmax(0,1fr) 28px!important;gap:10px!important;align-items:center!important;padding:13px 14px!important;cursor:pointer!important}.mv-route-fold93>summary::-webkit-details-marker{display:none}.mv-route-icon93{width:38px;height:38px;border-radius:9px;background:#eef2fa;color:#173b7a;display:grid;place-items:center;font-size:18px}.mv-route-fold93>summary span:nth-child(2){display:grid;gap:2px}.mv-route-fold93>summary b{font-size:13px;color:#1d2e49}.mv-route-fold93>summary small{font-size:9px;color:#7e899a}.mv-route-fold93>summary i{font-style:normal;font-size:22px;font-weight:800;color:#173b7a;text-align:center}.mv-route-fold-body93{padding:0 14px 14px;border-top:1px solid #edf0f4}.mv-route-fold93:not([open]) .mv-route-fold-body93{display:none!important}.mv-route-fold-body93>.r{margin-top:12px!important}.mv-route-fold-body93 #routePlanResultsV131,.mv-route-fold-body93 #routeMapWrapV133{margin-top:10px!important}
.mv-agenda-layout91{grid-template-columns:minmax(0,1fr) 250px!important}.mv-agenda-calendarcard91{padding:16px!important}.mv-agenda-maincal93{border:0!important;padding:0!important}.mv-agenda-sidecompact93{align-self:start!important}.mv-agenda-sidecompact93 #mvAgendaSelected91{margin-top:10px!important}.mv-agenda-month93{max-width:1180px;margin:0 auto 90px;background:#fff;border:1px solid #e1e6ed;border-radius:8px;padding:16px}.mv-agenda-monthhead93{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}.mv-agenda-monthhead93>div{display:grid;gap:2px}.mv-agenda-monthhead93 b{font-size:14px;color:#1c2c45}.mv-agenda-monthhead93 span{font-size:9px;color:#7b8797}.mv-agenda-monthhead93 button{width:auto!important;min-height:36px!important;padding:0 12px!important;background:#fff!important;color:#173b7a!important;border:1px solid #173b7a!important;border-radius:7px!important;font-size:10px!important}.mv-agenda-list93{display:grid!important;gap:0!important}.mv-agenda-entry93{border:0!important;border-bottom:1px solid #edf0f4!important;border-radius:0!important;margin:0!important;padding:13px 10px!important;background:#fff!important}.mv-agenda-entry93:last-child{border-bottom:0!important}.mv-agenda-entry93 .actions{margin-top:8px!important}.mv-agenda-entry93 .actions button{min-height:32px!important;font-size:9px!important;border-radius:6px!important}.mv-dashagenda93 .mv-calendar91{background:transparent!important}
@media(max-width:899px){.mv-trip-clean93{margin:0 10px 90px!important;padding:14px!important}.mv-trip-clean93>.r{grid-template-columns:1fr!important}.mv-route-fold93{margin:12px 0!important}.mv-route-fold93>summary{grid-template-columns:40px minmax(0,1fr) 26px!important;padding:11px!important}.mv-route-icon93{width:36px;height:36px}.mv-agenda-layout91{grid-template-columns:1fr!important;margin:0 10px 12px!important}.mv-agenda-sidecompact93{order:2!important}.mv-agenda-calendarcard91{order:1!important;padding:12px!important}.mv-agenda-month93{margin:0 10px 90px!important;padding:12px!important}.mv-agenda-monthhead93{align-items:flex-end}.mv-agenda-monthhead93 button{min-height:38px!important}.mv-agenda-entry93{padding:12px 4px!important}.mv-agenda-entry93 .actions{display:grid!important;grid-template-columns:1fr 1fr!important}.mv-agenda-entry93 .actions button{width:100%!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.93 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.93: clean collapsed trip planner and detailed agenda commitments installed');