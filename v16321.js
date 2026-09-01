const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.50: canonical trip lifecycle + compact expense selector.
(function(){
  const byId=id=>document.getElementById(id);
  const DEMO_VEHICLE='__mv_demo_vehicle__',DEMO_LOCATION='__mv_demo_location__';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function field(name,id){try{const x=globalThis[name];if(x&&x.nodeType===1)return x}catch(_){}return byId(id)}
  function lifecycleToast(kind,title,detail){
    let box=byId('mvTripLifecycleToast16350');
    if(!box){box=document.createElement('div');box.id='mvTripLifecycleToast16350';box.setAttribute('role','status');box.setAttribute('aria-live','polite');document.body.appendChild(box)}
    box.className='mv-trip-toast16350 '+kind;box.innerHTML='<b>'+title+'</b><span>'+detail+'</span>';box.classList.add('show');
    clearTimeout(box._hideTimer);box._hideTimer=setTimeout(()=>box.classList.remove('show'),5200);
  }
  function setLifecycle(state,detail){
    document.body.dataset.mvTripLifecycle=state;
    let box=byId('mvTripState16350');
    const card=byId('viagemAtiva');
    if(!card)return;
    if(!box){box=document.createElement('div');box.id='mvTripState16350';box.className='mv-trip-state16350';const cab=byId('ativaCab');(cab||card.firstElementChild)?.insertAdjacentElement('afterend',box)}
    const active=state==='active',finishing=state==='finishing';
    box.className='mv-trip-state16350 '+state;
    box.innerHTML='<span class="dot"></span><div><b>'+(active?'Percurso em andamento':finishing?'Finalizando percurso':'Percurso')+'</b><small>'+String(detail||'').replace(/</g,'&lt;')+'</small></div>';
  }
  function persistActive(){try{if(activeTrip?.id)localStorage.setItem('mv_active_trip_16350',JSON.stringify({id:activeTrip.id,started_at:activeTrip.started_at||new Date().toISOString(),destination:activeTrip.destination||''}));else localStorage.removeItem('mv_active_trip_16350')}catch(_){}}
  function finishBanner(){
    let data=null;try{data=JSON.parse(sessionStorage.getItem('mv_trip_completed_16350')||'null')}catch(_){}
    if(!data)return;
    const p=byId('p-historico');if(!p)return;
    let b=byId('mvTripCompletedBanner16350');if(!b){b=document.createElement('div');b.id='mvTripCompletedBanner16350';b.className='mv-trip-completed16350';p.insertAdjacentElement('afterbegin',b)}
    b.innerHTML='<strong>✓ Percurso finalizado e salvo</strong><span>'+String(data.detail||'O registro já está disponível no Histórico.').replace(/</g,'&lt;')+'</span><button type="button" aria-label="Fechar">×</button>';
    b.querySelector('button').onclick=()=>{b.remove();sessionStorage.removeItem('mv_trip_completed_16350')};
  }
  function expenseUi(){
    const q=byId('expenseQuickV135'),sel=byId('tipoDesp');if(q)q.style.setProperty('display','none','important');if(!sel)return;
    sel.classList.add('mv-expense-select16350');
    const row=sel.closest('.r')||sel.parentElement;if(row)row.classList.add('mv-expense-select-row16350');
    if(!byId('mvExpenseSelectHint16350')){const h=document.createElement('div');h.id='mvExpenseSelectHint16350';h.className='mv-expense-hint16350';h.innerHTML='<span>▾</span><div><b>Categoria da despesa</b><small>Toque na barra para escolher combustível, pedágio, estacionamento, alimentação, hospedagem, manutenção ou outros.</small></div>';row?.insertAdjacentElement('beforebegin',h)}
  }
  function canonicalStart(){
    const old=byId('btViagem');if(!old||old.dataset.mvStart16350)return;
    const btn=old.cloneNode(true);btn.dataset.mvStart16350='1';old.replaceWith(btn);try{globalThis.btViagem=btn}catch(_){}
    btn.addEventListener('click',async e=>{
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
      if(activeTrip?.id)return msg('Já existe um percurso em andamento. Finalize-o antes de iniciar outro.',true);
      const vehicle=field('veiculo','veiculo'),location=field('local','local'),date=field('dataViagem','dataViagem'),origin=field('origem','origem'),destination=field('destino','destino'),startKm=field('kmi','kmi'),usage=field('tipoUso','tipoUso'),purpose=field('motivo','motivo'),notes=field('obs','obs');
      const dest=(destination?.value||'').trim(),orig=(origin?.value||'').trim();
      if(!dest)return msg('Informe o destino',true);if(startKm?.value==null||String(startKm.value).trim()==='')return msg('Informe o KM inicial',true);if(Number(startKm.value)<0)return msg('Informe um KM inicial válido',true);
      const orgId=org?.id||empresa?.id,userId=ses?.user?.id;if(!orgId||!userId)return msg('Sessão ou empresa não carregada. Atualize a página e tente novamente.',true);
      const oldText=btn.textContent||'Iniciar percurso';btn.disabled=true;btn.textContent='Iniciando percurso…';
      lifecycleToast('working','Iniciando percurso','Salvando o início do deslocamento…');
      try{
        const payload={organization_id:orgId,user_id:userId,vehicle_id:vehicle?.value===DEMO_VEHICLE?null:(vehicle?.value||null),location_id:location?.value===DEMO_LOCATION?null:(location?.value||null),trip_date:date?.value||new Date().toISOString().slice(0,10),started_at:new Date().toISOString(),origin:orig||null,destination:dest,start_odometer:Number(startKm.value),usage_type:usage?.value==='personal'?'personal':'work',purpose:(purpose?.value||'').trim()||null,notes:(notes?.value||'').trim()||null,status:'in_progress'};
        const r=await sb.from('km_trips').insert(payload).select('*').single();if(r.error)throw r.error;if(!r.data?.id)throw new Error('O servidor não confirmou o início do percurso');
        activeTrip=r.data;persistActive();document.body.dataset.mvTripState='active';
        setLifecycle('active','Iniciado agora · '+dest);btn.textContent='✓ Percurso iniciado';
        try{renderActive();byId('viagemAtiva')?.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){}
        lifecycleToast('success','✓ Percurso iniciado','O deslocamento está em andamento e já foi salvo.');msg('Percurso iniciado e salvo');
        const planned=Array.isArray(globalThis.preTripStopsV127)?[...globalThis.preTripStopsV127]:[];
        if(planned.length){
          const sr=await sb.from('km_stops').insert(planned.map((x,i)=>({trip_id:activeTrip.id,stop_order:i+1,place_name:x.place_name,notes:x.notes||null})));
          if(sr.error){console.warn('v163.50 planned stops',sr.error);lifecycleToast('warn','Percurso iniciado','As paradas serão sincronizadas novamente.')}else globalThis.preTripStopsV127=[];
        }
        try{localStorage.removeItem('km_trip_draft')}catch(_){}
        setTimeout(async()=>{try{await refreshActive();renderActive();expenseUi();setLifecycle('active','Em andamento · '+dest)}catch(err){console.warn('v163.50 active refresh',err)}},40);
        setTimeout(async()=>{try{await refreshAll();render();finishBanner()}catch(err){console.warn('v163.50 background refresh',err)}},700);
        await sleep(650);btn.textContent=oldText;
      }catch(err){lifecycleToast('error','Não foi possível iniciar',err?.message||String(err));msg('Não foi possível iniciar o percurso: '+(err?.message||String(err)),true);btn.textContent=oldText}
      finally{btn.disabled=false}
    },true);
  }
  function canonicalFinish(){
    const old=byId('btFinalizar');if(!old||old.dataset.mvFinish16350)return;
    const btn=old.cloneNode(true);btn.dataset.mvFinish16350='1';old.replaceWith(btn);try{globalThis.btFinalizar=btn}catch(_){}
    btn.addEventListener('click',async e=>{
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
      if(!activeTrip?.id)return msg('Nenhum percurso em andamento',true);
      const endField=field('kmf','kmf'),noteField=field('obsFinal','obsFinal');if(endField?.value==null||String(endField.value).trim()==='')return msg('Informe o KM final',true);
      const id=activeTrip.id,start=Number(activeTrip.start_odometer||0),end=Number(endField.value);if(end<start)return msg('O KM final não pode ser menor que o KM inicial',true);
      const oldText=btn.textContent||'Finalizar deslocamento';btn.disabled=true;btn.textContent='Finalizando…';setLifecycle('finishing','Confirmando o encerramento no servidor…');lifecycleToast('working','Finalizando percurso','Confirmando o registro…');
      try{
        const now=new Date().toISOString();
        const r=await sb.from('km_trips').update({end_odometer:end,ended_at:now,status:'completed',notes:(noteField?.value||'').trim()||activeTrip.notes||null}).eq('id',id).select('id,status,start_odometer,end_odometer,ended_at,destination').maybeSingle();if(r.error)throw r.error;
        let confirmed=r.data;if(!confirmed||confirmed.status!=='completed'){const q=await sb.from('km_trips').select('id,status,start_odometer,end_odometer,ended_at,destination').eq('id',id).maybeSingle();if(q.error)throw q.error;confirmed=q.data}
        if(!confirmed||confirmed.status!=='completed')throw new Error('O servidor não confirmou a finalização');
        const distance=Math.max(0,Number(confirmed.end_odometer||end)-Number(confirmed.start_odometer||start));
        activeTrip=null;persistActive();document.body.dataset.mvTripState='completed';if(endField)endField.value='';if(noteField)noteField.value='';
        const detail='Finalizado às '+new Date(confirmed.ended_at||now).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})+' · '+distance.toLocaleString('pt-BR',{maximumFractionDigits:1})+' km · salvo no Histórico.';
        try{sessionStorage.setItem('mv_trip_completed_16350',JSON.stringify({id,detail,at:now}))}catch(_){}
        btn.textContent='✓ Finalizado';lifecycleToast('success','✓ Percurso finalizado',detail);msg('Percurso finalizado e confirmado no Histórico');
        // Secondary operational consolidation must not block user confirmation.
        setTimeout(async()=>{try{if(globalThis.activeRouteExecutionV141&&typeof globalThis.v141FinishExecution==='function')await globalThis.v141FinishExecution()}catch(err){console.warn('v163.50 route execution finalize',err)}},0);
        setTimeout(async()=>{try{await refreshAll();render();if(typeof renderHistory==='function')renderHistory();if(typeof show==='function')show('historico');finishBanner()}catch(err){console.warn('v163.50 post finish refresh',err)}},250);
        await sleep(900);
      }catch(err){setLifecycle('active','Finalização não confirmada · o percurso continua aberto.');lifecycleToast('error','Finalização não confirmada',err?.message||String(err));msg('Não foi possível finalizar o percurso: '+(err?.message||String(err)),true);btn.textContent=oldText}
      finally{btn.disabled=false;if(btn.textContent==='✓ Finalizado')setTimeout(()=>{btn.textContent=oldText},1200)}
    },true);
  }
  function sync(){expenseUi();canonicalStart();canonicalFinish();finishBanner();if(activeTrip?.id){persistActive();setLifecycle('active','Em andamento · '+(activeTrip.destination||'percurso ativo'))}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
  [80,300,900,1800,3200].forEach(ms=>setTimeout(sync,ms));
  addEventListener('pageshow',sync,true);
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-p],[data-mv-dock],[data-mvroute]'))setTimeout(sync,80)},true);
  globalThis.mvTripLifecycleV16350={sync,expenseUi};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.50 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.50 trip lifecycle + expense UX */
#expenseQuickV135{display:none!important}.mv-expense-select-row16350{margin-top:6px!important}.mv-expense-select16350{width:100%!important;min-height:52px!important;border:1px solid #cfd7e3!important;border-radius:10px!important;background:#fff!important;padding:0 46px 0 14px!important;font-size:14px!important;font-weight:750!important;color:#28364b!important;box-shadow:none!important}.mv-expense-hint16350{display:flex;gap:10px;align-items:center;margin:3px 0 6px;padding:10px 12px;border:1px solid #e0e6ee;border-radius:10px;background:#f8fafc}.mv-expense-hint16350>span{display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:#eaf2ff;color:#1767cf;font-weight:900}.mv-expense-hint16350 b,.mv-expense-hint16350 small{display:block}.mv-expense-hint16350 b{font-size:12px;color:#26354a}.mv-expense-hint16350 small{font-size:10px;color:#758195;margin-top:2px;line-height:1.35}
.mv-trip-state16350{display:flex;align-items:center;gap:10px;margin:10px 0;padding:10px 12px;border:1px solid #cfe2d7;border-radius:10px;background:#f4fbf6}.mv-trip-state16350 .dot{width:10px;height:10px;border-radius:50%;background:#1e9e55;box-shadow:0 0 0 5px #1e9e5520}.mv-trip-state16350 b,.mv-trip-state16350 small{display:block}.mv-trip-state16350 b{font-size:12px;color:#1d5034}.mv-trip-state16350 small{font-size:10px;color:#607568;margin-top:2px}.mv-trip-state16350.finishing{border-color:#cfe0f8;background:#f4f8fe}.mv-trip-state16350.finishing .dot{background:#1767cf;box-shadow:0 0 0 5px #1767cf20}.mv-trip-state16350.finishing b{color:#164b8e}
.mv-trip-toast16350{position:fixed;left:50%;top:16px;transform:translate(-50%,-18px);z-index:99999;width:min(92vw,520px);padding:13px 15px;border-radius:12px;background:#102b4d;color:#fff;box-shadow:0 14px 38px #0003;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease}.mv-trip-toast16350.show{opacity:1;transform:translate(-50%,0)}.mv-trip-toast16350 b,.mv-trip-toast16350 span{display:block}.mv-trip-toast16350 b{font-size:14px}.mv-trip-toast16350 span{font-size:11px;margin-top:3px;opacity:.9}.mv-trip-toast16350.success{background:#11643a}.mv-trip-toast16350.error{background:#a12626}.mv-trip-toast16350.warn{background:#8b5b00}
.mv-trip-completed16350{display:grid;grid-template-columns:1fr auto;gap:4px 12px;align-items:center;margin:10px 0 14px;padding:13px 14px;border:1px solid #bfe0cb;border-radius:12px;background:#f1fbf4}.mv-trip-completed16350 strong{color:#17603a;font-size:13px}.mv-trip-completed16350 span{grid-column:1/2;color:#5d7164;font-size:10.5px}.mv-trip-completed16350 button{grid-column:2;grid-row:1/3;width:32px!important;min-height:32px!important;padding:0!important;border-radius:8px!important;background:#fff!important;color:#547060!important;border:1px solid #d5e6da!important}
@media(max-width:700px){.mv-trip-toast16350{top:10px}.mv-expense-select16350{font-size:15px!important}.mv-expense-hint16350 small{font-size:10.5px}.mv-trip-completed16350{margin-left:4px;margin-right:4px}}
`;
if(!s.includes('</style>'))throw new Error('v163.50 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.50 trip lifecycle and compact expense selector installed');
