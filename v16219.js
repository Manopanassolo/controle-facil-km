const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.19: allow direct trips without vehicle/location when no records exist.
(function(){
  const baseStart=btViagem.onclick;
  async function startWithoutFleet(){
    if(activeTrip?.id)return msg('Já existe um deslocamento em andamento',true);
    const d=destino?.value?.trim()||'';
    if(!d)return msg('Informe o destino',true);
    const tripDate=dataViagem?.value||new Date().toISOString().slice(0,10);
    const usage=tipoUso?.value||'personal';
    const payload={
      organization_id:org.id,
      user_id:ses.user.id,
      vehicle_id:null,
      location_id:null,
      trip_date:tripDate,
      started_at:new Date().toISOString(),
      origin:origem?.value?.trim()||null,
      destination:d,
      start_odometer:Number(kmi?.value||0),
      usage_type:usage,
      purpose:motivo?.value?.trim()||null,
      notes:obs?.value?.trim()||null,
      status:'in_progress'
    };
    const r=await sb.from('km_trips').insert(payload).select('*').single();
    if(r.error)return msg('Não foi possível iniciar o deslocamento: '+r.error.message,true);
    activeTrip=r.data;
    const planned=Array.isArray(preTripStopsV127)?[...preTripStopsV127]:[];
    if(planned.length){
      const sr=await sb.from('km_stops').insert(planned.map((x,i)=>({trip_id:activeTrip.id,stop_order:i+1,place_name:x.place_name,notes:x.notes||null})));
      if(sr.error)msg('Deslocamento iniciado; as paradas não puderam ser gravadas: '+sr.error.message,true);
      else preTripStopsV127=[];
    }
    await refreshActive();
    renderActive();
    if(typeof renderPreTripStopsV127==='function')renderPreTripStopsV127();
    msg('Deslocamento iniciado sem veículo/unidade. Você pode cadastrá-los depois.');
  }
  btViagem.onclick=async()=>{
    const noVehicle=!veiculo?.value;
    const noLocation=!local?.value;
    if(noVehicle||noLocation)return startWithoutFleet();
    return baseStart();
  };
  function fleetHint(){
    const form=document.getElementById('novaViagem');if(!form)return;
    let h=document.getElementById('mvFleetHintV16219');
    if(!h){h=document.createElement('div');h.id='mvFleetHintV16219';h.className='mv-fleet-hint-v16219';const row=veiculo?.closest?.('.r');(row||form.firstElementChild)?.insertAdjacentElement('afterend',h)}
    const noVehicle=!veiculo?.value,noLocation=!local?.value;
    h.classList.toggle('hide',!(noVehicle||noLocation));
    if(noVehicle||noLocation)h.innerHTML='<b>Cadastro opcional</b><span>Você pode iniciar este deslocamento sem veículo e sem unidade. Esses dados podem ser cadastrados depois.</span>';
  }
  const renderBase=render;render=function(){const r=renderBase();setTimeout(fleetHint,0);return r};
  setTimeout(fleetHint,900);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.19 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.19 optional fleet/location */
.mv-fleet-hint-v16219{margin:8px 0 10px;padding:10px 12px;border:1px solid #dfe7d0;border-radius:12px;background:#f8ffe6;color:#17324d;display:grid;gap:2px}.mv-fleet-hint-v16219 b{font-size:12px}.mv-fleet-hint-v16219 span{font-size:11px;color:#667085}
`;
if(!s.includes('</style>'))throw new Error('v162.19 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.19: trips can start without vehicle/location');
