const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.53: close schedule -> active trip -> completed history lifecycle.
(function(){
  const byId=id=>document.getElementById(id);
  let linking=false,lastLinked='';
  const norm=v=>String(v||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/\\s+/g,' ').trim();
  function ensureScheduleTime(){
    const save=byId('mvSaveScheduledTripV16284');if(!save||byId('mvScheduleTime16353'))return;
    const wrap=document.createElement('label');wrap.id='mvScheduleTimeWrap16353';wrap.className='mv-schedule-time16353';wrap.innerHTML='<span>Horário do agendamento</span><input id="mvScheduleTime16353" type="time" value="08:00" aria-label="Horário do agendamento">';save.insertAdjacentElement('beforebegin',wrap);
    // v163.52 reads agHora; expose the chosen time through the same DOM contract without showing the old Agenda form.
    let proxy=byId('agHora');if(!proxy){proxy=document.createElement('input');proxy.id='agHora';proxy.type='time';proxy.hidden=true;document.body.appendChild(proxy)}
    const input=byId('mvScheduleTime16353');proxy.value=input.value;input.addEventListener('input',()=>proxy.value=input.value);
  }
  async function linkActiveToSchedule(){
    if(linking||!activeTrip?.id||lastLinked===activeTrip.id||!ses?.user?.id)return;
    linking=true;
    try{
      const existing=await sb.from('km_scheduled_trips').select('id,trip_id,status,scheduled_at,origin,destination').eq('trip_id',activeTrip.id).limit(1);
      if(existing.data?.length){lastLinked=activeTrip.id;return}
      const started=new Date(activeTrip.started_at||Date.now()),from=new Date(started.getTime()-36*3600000).toISOString(),to=new Date(started.getTime()+36*3600000).toISOString();
      const q=await sb.from('km_scheduled_trips').select('id,trip_id,status,scheduled_at,origin,destination').eq('user_id',ses.user.id).is('trip_id',null).gte('scheduled_at',from).lte('scheduled_at',to).order('scheduled_at',{ascending:true});
      if(q.error)throw q.error;
      const dest=norm(activeTrip.destination),orig=norm(activeTrip.origin);
      const candidates=(q.data||[]).filter(x=>norm(x.destination)===dest).map(x=>({x,score:Math.abs(new Date(x.scheduled_at)-started)+(orig&&norm(x.origin)===orig?0:6*3600000)})).sort((a,b)=>a.score-b.score);
      const best=candidates[0]?.x;if(!best)return;
      const up=await sb.from('km_scheduled_trips').update({trip_id:activeTrip.id,status:'done',updated_at:new Date().toISOString()}).eq('id',best.id).is('trip_id',null).select('id,trip_id,status').maybeSingle();
      if(up.error)throw up.error;if(up.data?.trip_id===activeTrip.id){lastLinked=activeTrip.id;try{sessionStorage.setItem('mv_linked_schedule_16353',best.id)}catch(_){};if(typeof v138LoadAgenda==='function')v138LoadAgenda().catch?.(()=>{});console.log('Movvant v163.53 scheduled trip linked',best.id,activeTrip.id)}
    }catch(e){console.warn('v163.53 schedule link',e)}finally{linking=false}
  }
  async function enhanceCompletedSummary(){
    let data=null;try{data=JSON.parse(sessionStorage.getItem('mv_trip_completed_16350')||'null')}catch(_){}if(!data?.id)return;
    const box=byId('mvCompletedSummary16352');if(!box||box.dataset.mvEnhanced16353===data.id)return;
    try{
      const [tr,ex,st]=await Promise.all([
        sb.from('km_trips').select('id,trip_date,started_at,ended_at,origin,destination,start_odometer,end_odometer,status,purpose').eq('id',data.id).maybeSingle(),
        sb.from('km_expenses').select('expense_type,amount').eq('trip_id',data.id),
        sb.from('km_stops').select('place_name,stop_order').eq('trip_id',data.id).order('stop_order')
      ]);
      const t=tr.data;if(!t)return;const expenses=(ex.data||[]).reduce((n,x)=>n+Number(x.amount||0),0),distance=Math.max(0,Number(t.end_odometer||0)-Number(t.start_odometer||0)),stops=st.data||[];
      box.dataset.mvEnhanced16353=data.id;
      let grid=box.querySelector('.mv-completed-grid16353');if(!grid){grid=document.createElement('div');grid.className='mv-completed-grid16353';box.appendChild(grid)}
      grid.innerHTML='<div><small>Origem</small><b>'+String(t.origin||'—').replace(/</g,'&lt;')+'</b></div><div><small>Destino</small><b>'+String(t.destination||'—').replace(/</g,'&lt;')+'</b></div><div><small>KM realizado</small><b>'+distance.toLocaleString('pt-BR',{maximumFractionDigits:1})+' km</b></div><div><small>Despesas</small><b>R$ '+expenses.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'</b></div><div><small>Paradas</small><b>'+stops.length+'</b></div><div><small>Status</small><b>Finalizado</b></div>';
      const linked=await sb.from('km_scheduled_trips').select('id,status,google_calendar_sync_status').eq('trip_id',data.id).limit(1);const row=linked.data?.[0];if(row){const tag=document.createElement('div');tag.className='mv-completed-link16353';tag.textContent='✓ Vinculado ao agendamento'+(row.google_calendar_sync_status==='synced'?' e ao Google Agenda':'');box.appendChild(tag)}
    }catch(e){console.warn('v163.53 summary enhancement',e)}
  }
  function sync(){ensureScheduleTime();if(activeTrip?.id)linkActiveToSchedule();enhanceCompletedSummary()}
  if(document.body)new MutationObserver(()=>{if(document.body.dataset.mvTripState==='active')linkActiveToSchedule();if(document.body.dataset.mvTripState==='completed')setTimeout(enhanceCompletedSummary,300)}).observe(document.body,{attributes:true,attributeFilter:['data-mv-trip-state']});
  [0,150,500,1200,2400].forEach(ms=>setTimeout(sync,ms));
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-p],#btViagem,#btFinalizar,#mvSaveScheduledTripV16284'))setTimeout(sync,180)},true);
  addEventListener('pageshow',()=>setTimeout(sync,100),true);
  document.documentElement.dataset.mvScheduleLifecycle='163.53';
  globalThis.mvScheduleLifecycleV16353={sync,linkActiveToSchedule,enhanceCompletedSummary};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.53 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
.mv-schedule-time16353{display:grid;gap:5px;margin:8px 0}.mv-schedule-time16353 span{font-size:11px;font-weight:750;color:#44536a}.mv-schedule-time16353 input{min-height:44px!important;border:1px solid #d8dee8!important;border-radius:8px!important;background:#fff!important;padding:8px 11px!important;font-size:14px!important}
.mv-completed-summary16352{flex-wrap:wrap}.mv-completed-grid16353{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:5px}.mv-completed-grid16353>div{padding:9px 10px;border:1px solid #d7eadf;border-radius:8px;background:#fff}.mv-completed-grid16353 small,.mv-completed-grid16353 b{display:block}.mv-completed-grid16353 small{font-size:9px;color:#708178}.mv-completed-grid16353 b{font-size:11px;color:#244936;margin-top:3px}.mv-completed-link16353{width:100%;font-size:10px;font-weight:750;color:#1c7145;margin-top:2px}@media(max-width:700px){.mv-completed-grid16353{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
if(!s.includes('</style>'))throw new Error('v163.53 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.53 schedule-to-trip lifecycle and enriched completion summary installed');
