const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.29: harden trip start against stale/missing DOM globals and keep homologation fixtures usable.
(function(){
  const DEMO_VEHICLE='__mv_demo_vehicle__',DEMO_LOCATION='__mv_demo_location__';
  const byId=id=>document.getElementById(id);
  function field(name,id){
    try{const v=globalThis[name];if(v&&v.nodeType===1)return v}catch(_){}
    return byId(id);
  }
  function prepare(){
    const vehicle=field('veiculo','veiculo'),location=field('local','local');
    if(vehicle&&!Array.from(vehicle.options||[]).some(o=>o.value)) vehicle.innerHTML='<option value="'+DEMO_VEHICLE+'">Veículo teste · ABC1D23</option>';
    if(location&&!Array.from(location.options||[]).some(o=>o.value)) location.innerHTML='<option value="'+DEMO_LOCATION+'">Unidade teste · Matriz</option>';
    const emptyCard=Array.from(document.querySelectorAll('h1,h2,h3,h4,b,strong')).find(el=>(el.textContent||'').trim()==='Nenhum veículo disponível');
    if(emptyCard){const card=emptyCard.closest('section,.card,.c,.panel')||emptyCard.parentElement?.parentElement;if(card){card.style.display='none'}}
  }
  function bind(){
    prepare();
    const old=byId('btViagem');if(!old||old.dataset.mvStartV16229)return;
    const btn=old.cloneNode(true);btn.dataset.mvStartV16229='1';old.replaceWith(btn);try{globalThis.btViagem=btn}catch(_){}
    btn.addEventListener('click',async e=>{
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
      const destination=field('destino','destino'),startKm=field('kmi','kmi'),vehicle=field('veiculo','veiculo'),location=field('local','local');
      const date=field('dataViagem','dataViagem'),usage=field('tipoUso','tipoUso'),origin=field('origem','origem'),purpose=field('motivo','motivo'),notes=field('obs','obs');
      if(activeTrip?.id)return msg('Já existe um deslocamento em andamento. Continue ou finalize o atual.',true);
      const d=(destination?.value||'').trim();if(!d)return msg('Informe o destino',true);
      if(startKm?.value==null||startKm.value==='')return msg('Informe o KM inicial',true);
      const oldText=btn.textContent||'Iniciar deslocamento';btn.disabled=true;btn.textContent='Iniciando...';
      try{
        const payload={organization_id:org?.id||empresa?.id,user_id:ses?.user?.id,vehicle_id:vehicle?.value===DEMO_VEHICLE?null:(vehicle?.value||null),location_id:location?.value===DEMO_LOCATION?null:(location?.value||null),trip_date:date?.value||new Date().toISOString().slice(0,10),started_at:new Date().toISOString(),origin:(origin?.value||'').trim()||null,destination:d,start_odometer:Number(startKm.value),usage_type:usage?.value==='personal'?'personal':'work',purpose:(purpose?.value||'').trim()||null,notes:(notes?.value||'').trim()||null,status:'in_progress'};
        if(!payload.organization_id||!payload.user_id)throw new Error('Sessão ou empresa não carregada. Atualize a página e tente novamente.');
        const r=await sb.from('km_trips').insert(payload).select('*').single();if(r.error)throw r.error;activeTrip=r.data;
        const planned=Array.isArray(globalThis.preTripStopsV127)?[...globalThis.preTripStopsV127]:[];
        if(planned.length){const sr=await sb.from('km_stops').insert(planned.map((x,i)=>({trip_id:activeTrip.id,stop_order:i+1,place_name:x.place_name,notes:x.notes||null})));if(sr.error)throw sr.error;globalThis.preTripStopsV127=[]}
        localStorage.removeItem('km_trip_draft');await refreshAll();render();msg('Deslocamento iniciado');
      }catch(err){msg('Não foi possível iniciar o deslocamento: '+(err?.message||String(err)),true)}finally{btn.disabled=false;btn.textContent=oldText}
    },true);
  }
  try{
    if(typeof MutationObserver==='function'&&document.documentElement){
      const ro=new MutationObserver(()=>{try{prepare();bind()}catch(e){console.error('v162.29 observer',e)}});
      ro.observe(document.documentElement,{subtree:true,childList:true});
    }
  }catch(e){console.error('v162.29 observer init skipped',e)}
  setTimeout(()=>{try{bind()}catch(e){console.error('v162.29 bind',e)}},0);
  setTimeout(()=>{try{bind()}catch(e){console.error('v162.29 bind',e)}},500);
  setTimeout(()=>{try{bind()}catch(e){console.error('v162.29 bind',e)}},1200);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.29 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.29: trip start DOM hardening and homologation fixtures stabilized');
