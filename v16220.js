const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.20: explicit required-field validation + correct DB usage_type mapping.
(function(){
  function clearRequired(){document.querySelectorAll('.mv-required-v16220').forEach(el=>el.classList.remove('mv-required-v16220'));document.querySelectorAll('.mv-required-msg-v16220').forEach(el=>el.remove())}
  function markRequired(el,text){if(!el)return;el.classList.add('mv-required-v16220');let m=document.createElement('div');m.className='mv-required-msg-v16220';m.textContent=text||'Campo obrigatório';el.insertAdjacentElement('afterend',m)}
  function validate(){clearRequired();let ok=true;const d=destino?.value?.trim()||'';if(!d){markRequired(destino,'Informe o destino');ok=false}return ok}
  function dbUsage(v){return v==='personal'?'personal':'work'}
  async function startTripV16220(){
    if(activeTrip?.id)return msg('Já existe um deslocamento em andamento',true);
    if(!validate()){msg('Preencha os campos destacados em vermelho',true);return}
    const payload={organization_id:org.id,user_id:ses.user.id,vehicle_id:veiculo?.value||null,location_id:local?.value||null,trip_date:dataViagem?.value||new Date().toISOString().slice(0,10),started_at:new Date().toISOString(),origin:origem?.value?.trim()||null,destination:destino.value.trim(),start_odometer:Number(kmi?.value||0),usage_type:dbUsage(tipoUso?.value),purpose:motivo?.value?.trim()||null,notes:obs?.value?.trim()||null,status:'in_progress'};
    const btn=btViagem;const old=btn.textContent;btn.disabled=true;btn.textContent='Iniciando...';
    try{
      const r=await sb.from('km_trips').insert(payload).select('*').single();
      if(r.error)throw r.error;
      activeTrip=r.data;
      const planned=Array.isArray(preTripStopsV127)?[...preTripStopsV127]:[];
      if(planned.length){const sr=await sb.from('km_stops').insert(planned.map((x,i)=>({trip_id:activeTrip.id,stop_order:i+1,place_name:x.place_name,notes:x.notes||null})));if(sr.error)msg('Deslocamento iniciado; as paradas não puderam ser gravadas: '+sr.error.message,true);else preTripStopsV127=[]}
      await refreshActive();renderActive();if(typeof renderPreTripStopsV127==='function')renderPreTripStopsV127();clearRequired();msg('Deslocamento iniciado');
    }catch(e){msg('Não foi possível iniciar o deslocamento: '+(e?.message||String(e)),true)}finally{btn.disabled=false;btn.textContent=old}
  }
  btViagem.onclick=startTripV16220;
  [destino,origem,motivo,kmi].filter(Boolean).forEach(el=>el.addEventListener('input',()=>{el.classList.remove('mv-required-v16220');el.nextElementSibling?.classList?.contains('mv-required-msg-v16220')&&el.nextElementSibling.remove()}));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.20 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.20 required fields */
.mv-required-v16220{border:2px solid #d92d20!important;background:#fff7f6!important;box-shadow:0 0 0 3px rgba(217,45,32,.08)!important}.mv-required-msg-v16220{margin:4px 2px 0;color:#b42318!important;font-size:11px!important;font-weight:700!important}
`;
if(!s.includes('</style>'))throw new Error('v162.20 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.20: required trip fields highlighted and usage_type normalized');