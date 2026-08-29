const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.21: definitive start handler in capture phase + inline required markers.
(function(){
  function clearField(el){if(!el)return;el.classList.remove('mv-required-v16221');const n=el.parentElement?.querySelector?.('.mv-required-msg-v16221[data-for="'+el.id+'"]');if(n)n.remove()}
  function mark(el,text){if(!el)return;clearField(el);el.classList.add('mv-required-v16221');const n=document.createElement('div');n.className='mv-required-msg-v16221';n.dataset.for=el.id;n.textContent=text||'Campo obrigatório';el.insertAdjacentElement('afterend',n);el.scrollIntoView?.({block:'center',behavior:'smooth'})}
  function validate(){
    [origem,destino,kmi,motivo,tipoUso,veiculo,local].filter(Boolean).forEach(clearField);
    let first=null;
    if(!destino?.value?.trim()){mark(destino,'Informe o destino');first=first||destino}
    if(kmi?.value===''){mark(kmi,'Informe o KM inicial');first=first||kmi}
    if(first){first.focus?.();return false}
    return true;
  }
  function usage(){return tipoUso?.value==='personal'?'personal':'work'}
  async function start(){
    if(activeTrip?.id)return msg('Já existe um deslocamento em andamento',true);
    if(!validate())return;
    const btn=btViagem,old=btn.textContent;btn.disabled=true;btn.textContent='Iniciando...';
    try{
      const payload={organization_id:org.id,user_id:ses.user.id,vehicle_id:veiculo?.value||null,location_id:local?.value||null,trip_date:dataViagem?.value||new Date().toISOString().slice(0,10),started_at:new Date().toISOString(),origin:origem?.value?.trim()||null,destination:destino.value.trim(),start_odometer:Number(kmi.value),usage_type:usage(),purpose:motivo?.value?.trim()||null,notes:obs?.value?.trim()||null,status:'in_progress'};
      const r=await sb.from('km_trips').insert(payload).select('*').single();
      if(r.error)throw r.error;
      activeTrip=r.data;
      const planned=Array.isArray(preTripStopsV127)?[...preTripStopsV127]:[];
      if(planned.length){const sr=await sb.from('km_stops').insert(planned.map((x,i)=>({trip_id:activeTrip.id,stop_order:i+1,place_name:x.place_name,notes:x.notes||null})));if(sr.error)msg('Deslocamento iniciado; as paradas não puderam ser gravadas: '+sr.error.message,true);else preTripStopsV127=[]}
      localStorage.removeItem('km_trip_draft');
      await refreshAll();render();if(typeof renderPreTripStopsV127==='function')renderPreTripStopsV127();msg('Deslocamento iniciado');
    }catch(e){msg('Não foi possível iniciar o deslocamento: '+(e?.message||String(e)),true)}finally{btn.disabled=false;btn.textContent=old}
  }
  // Capture phase blocks any legacy click listener that still requires a vehicle.
  btViagem.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();start()},true);
  btViagem.onclick=null;
  [destino,kmi].filter(Boolean).forEach(el=>{['input','change'].forEach(ev=>el.addEventListener(ev,()=>clearField(el),true))});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.21 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.21 inline validation exactly at missing field */
.mv-required-v16221{border:2px solid #d92d20!important;background:#fff7f6!important;box-shadow:0 0 0 3px rgba(217,45,32,.10)!important}
.mv-required-msg-v16221{display:block!important;margin:4px 2px 7px!important;color:#b42318!important;font-size:11px!important;font-weight:800!important;line-height:1.2!important}
`;
if(!s.includes('</style>'))throw new Error('v162.21 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.21: legacy vehicle start blocker bypassed; missing fields marked inline');
