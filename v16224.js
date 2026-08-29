const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.24: distance_km is generated/read-only in Postgres; never write it when closing a trip.
(function(){
  document.addEventListener('click',async e=>{
    const close=e.target.closest?.('[data-mv-close-v16223]');
    if(!close)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
    if(!activeTrip?.id)return;
    close.disabled=true;const old=close.textContent;close.textContent='Encerrando...';
    try{
      const endKm=Number(activeTrip.start_odometer||0);
      const r=await sb.from('km_trips').update({status:'completed',ended_at:new Date().toISOString(),end_odometer:endKm}).eq('id',activeTrip.id).eq('user_id',ses.user.id).select('*').maybeSingle();
      if(r.error)throw r.error;
      activeTrip=null;await refreshAll();render();document.getElementById('novaViagem')?.classList.remove('hide');msg('Deslocamento de teste encerrado. Você já pode iniciar um novo.');
    }catch(err){msg('Não foi possível encerrar o teste atual: '+(err?.message||String(err)),true)}finally{close.disabled=false;close.textContent=old}
  },true);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.24 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.24: generated distance_km no longer written on test close');
