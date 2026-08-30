const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.38: capture-phase navigation for the two critical mobile actions.
(function(){
  const qs=new URLSearchParams(location.search);
  const synthetic=qs.get('mv_shell_test')==='1';
  function forcePage(page){
    const app=document.getElementById('app');
    const target=document.getElementById('p-'+page);
    if(!app||!target)return false;
    try{if(typeof show==='function')show(page)}catch(e){console.warn('v162.38 legacy show',page,e)}
    app.classList.remove('hide');app.hidden=false;
    app.querySelectorAll('[id^="p-"]').forEach(sec=>{
      if(sec===target){
        sec.classList.remove('hide');sec.hidden=false;
        sec.style.setProperty('display','block','important');
        sec.style.setProperty('visibility','visible','important');
        sec.style.setProperty('opacity','1','important');
      }else{
        sec.classList.add('hide');sec.hidden=false;
        sec.style.removeProperty('display');
        sec.style.removeProperty('visibility');
        sec.style.removeProperty('opacity');
      }
    });
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');
    document.body.classList.remove('km-menu-open','mv-lock-v1629');
    document.documentElement.classList.remove('mv-lock-v1629');
    setTimeout(()=>target.scrollIntoView({block:'start'}),0);
    return !target.classList.contains('hide');
  }
  function criticalClick(e){
    const bell=e.target.closest?.('#topBell');
    if(bell){
      e.preventDefault();e.stopImmediatePropagation();
      forcePage('notificacoes');return;
    }
    const jump=e.target.closest?.('[data-p-jump]');
    if(jump){
      const page=jump.getAttribute('data-p-jump');
      if(!page)return;
      e.preventDefault();e.stopImmediatePropagation();
      forcePage(page);return;
    }
  }
  document.addEventListener('click',criticalClick,true);
  document.addEventListener('pointerup',e=>{
    const el=e.target.closest?.('#topBell,[data-p-jump]');
    if(el)el.style.pointerEvents='auto';
  },true);
  function labelAgenda(){
    document.querySelectorAll('[data-p-jump="agenda"]').forEach(b=>{
      if(/Nova viagem/i.test(b.textContent||''))b.textContent='＋ Agendar viagem';
    });
  }
  [80,400,1200].forEach(ms=>setTimeout(labelAgenda,ms));
  if(synthetic){
    setTimeout(()=>{
      document.getElementById('auth')?.classList.add('hide');
      document.getElementById('app')?.classList.remove('hide');
      const homeOk=forcePage('inicio');
      const tripBtn=document.querySelector('#p-inicio [data-p-jump="viagem"]');
      tripBtn?.click();
      const trip=document.getElementById('p-viagem');
      const tripOk=!!trip&&!trip.classList.contains('hide')&&getComputedStyle(trip).display!=='none';
      forcePage('inicio');
      document.getElementById('topBell')?.click();
      const notes=document.getElementById('p-notificacoes');
      const noteOk=!!notes&&!notes.classList.contains('hide')&&getComputedStyle(notes).display!=='none';
      forcePage('inicio');
      const agendaBtn=[...document.querySelectorAll('#p-inicio [data-p-jump="agenda"]')][0];
      agendaBtn?.click();
      const agenda=document.getElementById('p-agenda');
      const agendaOk=!!agenda&&!agenda.classList.contains('hide')&&getComputedStyle(agenda).display!=='none';
      document.documentElement.dataset.mvShellTest=homeOk?'pass':'fail';
      document.documentElement.dataset.mvButtonsTest=(tripOk&&noteOk&&agendaOk)?'pass':'fail';
      document.documentElement.dataset.mvTripTest=tripOk?'pass':'fail';
      document.documentElement.dataset.mvBellTest=noteOk?'pass':'fail';
      document.documentElement.dataset.mvAgendaTest=agendaOk?'pass':'fail';
    },260);
  }
})();
`;
if(!s.includes('carga();'))throw new Error('v162.38 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.38: critical trip, notifications and agenda navigation hardened');
