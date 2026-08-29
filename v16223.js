const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.23: homologation fixtures + safer mobile Places interaction.
(function(){
  const DEMO_VEHICLE='__mv_demo_vehicle__',DEMO_LOCATION='__mv_demo_location__';
  function hasRealOption(sel){return !!(sel&&Array.from(sel.options||[]).some(o=>o.value&&o.value!==DEMO_VEHICLE&&o.value!==DEMO_LOCATION))}
  function addDemoOptions(){
    if(veiculo&&!hasRealOption(veiculo)){
      veiculo.innerHTML='<option value="'+DEMO_VEHICLE+'">Veículo teste · ABC1D23</option>';
      veiculo.value=DEMO_VEHICLE;
    }
    if(local&&!hasRealOption(local)){
      local.innerHTML='<option value="'+DEMO_LOCATION+'">Unidade teste · Matriz</option>';
      local.value=DEMO_LOCATION;
    }
    document.querySelectorAll('h1,h2,h3,h4,b,strong').forEach(el=>{
      if((el.textContent||'').trim()==='Nenhum veículo disponível'){
        const card=el.closest('.c,.card,.panel,section,div');
        if(card&&!card.dataset.mvDemoReplaced){
          card.dataset.mvDemoReplaced='1';
          card.innerHTML='<div class="mv-demo-card-v16223"><b>Modo de homologação ativo</b><span>Veículo teste ABC1D23 e Unidade teste Matriz foram carregados apenas para validação. Eles não criam cadastro definitivo.</span></div>';
        }
      }
    });
  }
  const renderBase=render;
  render=function(){const r=renderBase();setTimeout(addDemoOptions,0);setTimeout(activeTools,30);return r};

  function activeTools(){
    const form=document.getElementById('novaViagem');if(!form)return;
    let box=document.getElementById('mvActiveTestV16223');
    if(activeTrip?.id){
      if(!box){
        box=document.createElement('div');box.id='mvActiveTestV16223';box.className='mv-active-test-v16223';
        box.innerHTML='<div><b>Existe um deslocamento de teste em andamento</b><span>Você pode continuar o atual ou encerrá-lo para iniciar um novo teste.</span></div><div class="mv-active-actions-v16223"><button type="button" data-mv-resume-v16223>Continuar atual</button><button type="button" class="sec" data-mv-close-v16223>Encerrar teste atual</button></div>';
        form.insertAdjacentElement('beforebegin',box);
      }
      box.classList.remove('hide');
    }else if(box)box.classList.add('hide');
  }
  document.addEventListener('click',async e=>{
    const resume=e.target.closest?.('[data-mv-resume-v16223]');
    if(resume){e.preventDefault();try{renderActive();}catch(_){};document.getElementById('viagemAtiva')?.classList.remove('hide');document.getElementById('novaViagem')?.classList.add('hide');document.getElementById('viagemAtiva')?.scrollIntoView?.({behavior:'smooth',block:'start'});return}
    const close=e.target.closest?.('[data-mv-close-v16223]');
    if(close){
      e.preventDefault();if(!activeTrip?.id)return;
      close.disabled=true;const old=close.textContent;close.textContent='Encerrando...';
      try{
        const endKm=Number(activeTrip.start_odometer||0);
        const r=await sb.from('km_trips').update({status:'completed',ended_at:new Date().toISOString(),end_odometer:endKm,distance_km:0}).eq('id',activeTrip.id).eq('user_id',ses.user.id).select('*').maybeSingle();
        if(r.error)throw r.error;
        activeTrip=null;await refreshAll();render();document.getElementById('novaViagem')?.classList.remove('hide');msg('Deslocamento de teste encerrado. Você já pode iniciar um novo.');
      }catch(err){msg('Não foi possível encerrar o teste atual: '+(err?.message||String(err)),true)}finally{close.disabled=false;close.textContent=old}
    }
  },true);

  // Replace the start button node to remove legacy capture listeners from v162.21.
  const oldStart=document.getElementById('btViagem');
  if(oldStart){
    const fresh=oldStart.cloneNode(true);oldStart.replaceWith(fresh);globalThis.btViagem=fresh;
    fresh.addEventListener('click',async e=>{
      e.preventDefault();e.stopPropagation();
      if(activeTrip?.id){activeTools();document.getElementById('mvActiveTestV16223')?.scrollIntoView?.({behavior:'smooth',block:'center'});return msg('Existe um deslocamento de teste em andamento. Continue ou encerre o teste atual.',true)}
      const d=destino?.value?.trim()||'';if(!d)return msg('Informe o destino',true);
      if(kmi?.value==='')return msg('Informe o KM inicial',true);
      const vehicleId=veiculo?.value===DEMO_VEHICLE?null:(veiculo?.value||null);
      const locationId=local?.value===DEMO_LOCATION?null:(local?.value||null);
      const btn=fresh,old=btn.textContent;btn.disabled=true;btn.textContent='Iniciando...';
      try{
        const payload={organization_id:org.id,user_id:ses.user.id,vehicle_id:vehicleId,location_id:locationId,trip_date:dataViagem?.value||new Date().toISOString().slice(0,10),started_at:new Date().toISOString(),origin:origem?.value?.trim()||null,destination:d,start_odometer:Number(kmi.value),usage_type:tipoUso?.value==='personal'?'personal':'work',purpose:motivo?.value?.trim()||null,notes:obs?.value?.trim()||null,status:'in_progress'};
        const r=await sb.from('km_trips').insert(payload).select('*').single();if(r.error)throw r.error;activeTrip=r.data;
        const planned=Array.isArray(preTripStopsV127)?[...preTripStopsV127]:[];
        if(planned.length){const sr=await sb.from('km_stops').insert(planned.map((x,i)=>({trip_id:activeTrip.id,stop_order:i+1,place_name:x.place_name,notes:x.notes||null})));if(!sr.error)preTripStopsV127=[]}
        localStorage.removeItem('km_trip_draft');await refreshAll();render();if(typeof renderPreTripStopsV127==='function')renderPreTripStopsV127();msg('Deslocamento de homologação iniciado');
      }catch(err){msg('Não foi possível iniciar o deslocamento: '+(err?.message||String(err)),true)}finally{btn.disabled=false;btn.textContent=old}
    },true);
  }

  // Mobile Places: convert immediate pointer-down selection into deliberate tap-on-release.
  let touch=null,shield=null;
  function protectClickThrough(){
    if(shield)shield.remove();shield=document.createElement('div');shield.className='mv-tap-shield-v16223';document.body.appendChild(shield);setTimeout(()=>{shield?.remove();shield=null},360);
  }
  function retrofit(root=document){
    const list=[];
    if(root?.matches?.('#mvPlacesV16217 [data-mv-place-v16217]'))list.push(root);
    root?.querySelectorAll?.('#mvPlacesV16217 [data-mv-place-v16217]').forEach(b=>list.push(b));
    list.forEach(b=>{if(b.dataset.mvSafeV16223)return;b.dataset.mvSafeV16223='1';b.dataset.mvPlaceSafeV16223=b.dataset.mvPlaceV16217;delete b.dataset.mvPlaceV16217});
  }
  retrofit();
  new MutationObserver(rs=>{for(const r of rs)for(const n of r.addedNodes)if(n.nodeType===1)retrofit(n)}).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('[data-mv-place-safe-v16223]');if(!b)return;touch={b,x:e.clientX,y:e.clientY,moved:false};},true);
  document.addEventListener('pointermove',e=>{if(!touch)return;if(Math.abs(e.clientX-touch.x)>8||Math.abs(e.clientY-touch.y)>8)touch.moved=true},true);
  document.addEventListener('pointercancel',()=>{touch=null},true);
  document.addEventListener('pointerup',e=>{
    if(!touch)return;const t=touch;touch=null;if(t.moved)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();protectClickThrough();
    t.b.dataset.mvPlaceV16217=t.b.dataset.mvPlaceSafeV16223;
    t.b.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
  },true);
  setTimeout(()=>{addDemoOptions();activeTools();retrofit()},900);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.23 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.23 homologation + safe mobile autocomplete */
.mv-demo-card-v16223,.mv-active-test-v16223{margin:10px 0;padding:12px 14px;border:1px solid #dfe7d0;border-radius:14px;background:#f8ffe6;color:#17324d}.mv-demo-card-v16223,.mv-active-test-v16223>div:first-child{display:grid;gap:3px}.mv-demo-card-v16223 b,.mv-active-test-v16223 b{font-size:13px}.mv-demo-card-v16223 span,.mv-active-test-v16223 span{font-size:11px;color:#667085}.mv-active-actions-v16223{display:flex;gap:8px;margin-top:10px}.mv-active-actions-v16223 button{flex:1}
#mvPlacesV16217{overflow-y:auto!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;max-height:min(46vh,330px)!important}
#mvPlacesV16217 button{touch-action:pan-y!important;user-select:none!important;-webkit-user-select:none!important;min-height:58px!important}
.mv-tap-shield-v16223{position:fixed;inset:0;z-index:2147483646;background:transparent;pointer-events:auto;touch-action:none}
@media(max-width:700px){#mvPlacesV16217{max-height:44vh!important}.mv-active-actions-v16223{flex-direction:column}}
`;
if(!s.includes('</style>'))throw new Error('v162.23 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.23: homologation fixtures, active-trip recovery and safer scrollable Places list');
