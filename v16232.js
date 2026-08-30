const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.32: guided multi-step trip flow with back/next navigation and compact information per stage.
(function(){
  let step=1;
  const maxStep=4;
  const $=id=>document.getElementById(id);
  function text(id){return ($(id)?.value||'').trim()}
  function setDisplay(el,on,display=''){
    if(!el)return;
    if(on){if(el.dataset.mvPrevDisplayV16232!==undefined){el.style.display=el.dataset.mvPrevDisplayV16232;delete el.dataset.mvPrevDisplayV16232}else el.style.display=display}
    else {if(el.dataset.mvPrevDisplayV16232===undefined)el.dataset.mvPrevDisplayV16232=el.style.display||'';el.style.display='none'}
  }
  function directContainer(el){
    const root=$('novaViagem');if(!el||!root)return null;
    let x=el;while(x.parentElement&&x.parentElement!==root)x=x.parentElement;return x;
  }
  function hideAllBase(){
    ['veiculo','local','dataViagem','motivo','tipoUso','origem','destino','kmi','obs','btViagem'].forEach(id=>setDisplay($(id),false));
    const my=$('btMinhaOrigem');setDisplay(my,false);
    ['directRouteStackV127','routePlannerV131','routePlanResultsV131','routeMapWrapV133'].forEach(id=>setDisplay($(id),false));
  }
  function showField(id){const el=$(id);if(el)setDisplay(el,true)}
  function showContainerOf(id){const el=$(id),c=directContainer(el);if(c)setDisplay(c,true)}
  function stepTitle(){return ['','Contexto','Rota','Detalhes','Confirmar'][step]}
  function summary(){
    const vehicle=$('veiculo'),location=$('local'),usage=$('tipoUso');
    const v=vehicle?.selectedOptions?.[0]?.textContent?.trim()||'Sem veículo';
    const l=location?.selectedOptions?.[0]?.textContent?.trim()||'Sem unidade';
    const u=usage?.selectedOptions?.[0]?.textContent?.trim()||'Profissional';
    const stops=(globalThis.preTripStopsV127||[]).map(x=>x?.place_name).filter(Boolean);
    const box=$('mvTripSummaryV16232');if(!box)return;
    box.innerHTML='<div><b>Data</b><span>'+(text('dataViagem')||'Hoje')+'</span></div><div><b>Uso</b><span>'+u+'</span></div><div><b>Veículo</b><span>'+v+'</span></div><div><b>Unidade</b><span>'+l+'</span></div><div><b>Origem</b><span>'+(text('origem')||'Não informada')+'</span></div>'+(stops.length?stops.map((x,i)=>'<div><b>Parada '+(i+1)+'</b><span>'+x+'</span></div>').join(''):'')+'<div><b>Destino</b><span>'+(text('destino')||'Não informado')+'</span></div><div><b>KM inicial</b><span>'+(text('kmi')||'Não informado')+'</span></div><div><b>Motivo</b><span>'+(text('motivo')||'Não informado')+'</span></div>';
  }
  function validateForward(){
    if(step===2&&!text('destino')){try{msg('Informe o destino para avançar',true)}catch(_){};$('destino')?.focus();return false}
    if(step===3&&!text('kmi')){try{msg('Informe o KM inicial para avançar',true)}catch(_){};$('kmi')?.focus();return false}
    return true;
  }
  function renderStep(){
    const root=$('novaViagem');if(!root)return;
    hideAllBase();
    // First hide the original top-level form rows/controls that contain wizard fields.
    Array.from(root.children).forEach(ch=>{if(ch.id==='mvTripWizardV16232'||ch.tagName==='H2')return;const contains=['veiculo','local','dataViagem','motivo','tipoUso','origem','destino','kmi','obs','btViagem'].some(id=>ch.contains?.($(id)));if(contains)setDisplay(ch,false)});
    if(step===1){
      showContainerOf('veiculo');showContainerOf('dataViagem');
      ['veiculo','local','dataViagem','tipoUso'].forEach(showField);
    }else if(step===2){
      showContainerOf('origem');['origem','destino','btMinhaOrigem'].forEach(showField);
      ['directRouteStackV127','routePlannerV131','routePlanResultsV131','routeMapWrapV133'].forEach(id=>setDisplay($(id),true));
    }else if(step===3){
      showContainerOf('dataViagem');showField('motivo');showField('kmi');showField('obs');
    }else{
      summary();showField('btViagem');showContainerOf('btViagem');
    }
    const title=$('mvTripStepTitleV16232'),counter=$('mvTripStepCounterV16232'),bar=$('mvTripProgressBarV16232');
    if(title)title.textContent=stepTitle();if(counter)counter.textContent='Etapa '+step+' de '+maxStep;if(bar)bar.style.width=(step/maxStep*100)+'%';
    const back=$('mvTripBackV16232'),next=$('mvTripNextV16232'),sum=$('mvTripSummaryV16232');
    if(back)back.style.visibility=step===1?'hidden':'visible';if(next)next.style.display=step===maxStep?'none':'block';if(sum)sum.style.display=step===maxStep?'grid':'none';
    root.dataset.mvTripStep=String(step);
  }
  function ensure(){
    const root=$('novaViagem');if(!root)return;
    let w=$('mvTripWizardV16232');
    if(!w){
      w=document.createElement('div');w.id='mvTripWizardV16232';w.className='mv-trip-wizard-v16232';
      w.innerHTML='<div class="mv-wizard-head-v16232"><div><span id="mvTripStepCounterV16232">Etapa 1 de 4</span><b id="mvTripStepTitleV16232">Contexto</b></div><div class="mv-wizard-track-v16232"><i id="mvTripProgressBarV16232"></i></div></div><div id="mvTripSummaryV16232" class="mv-trip-summary-v16232"></div><div class="mv-wizard-actions-v16232"><button type="button" id="mvTripBackV16232" class="sec">← Voltar</button><button type="button" id="mvTripNextV16232">Avançar →</button></div>';
      const h=root.querySelector('h2');if(h)h.insertAdjacentElement('afterend',w);else root.prepend(w);
      $('mvTripBackV16232').onclick=()=>{step=Math.max(1,step-1);renderStep();root.scrollIntoView({behavior:'smooth',block:'start'})};
      $('mvTripNextV16232').onclick=()=>{if(!validateForward())return;step=Math.min(maxStep,step+1);renderStep();root.scrollIntoView({behavior:'smooth',block:'start'})};
      root.addEventListener('input',()=>{if(step===4)summary()});root.addEventListener('change',()=>{if(step===4)summary()});
    }
    renderStep();
  }
  const oldRender=typeof render==='function'?render:null;
  if(oldRender){render=function(){const r=oldRender.apply(this,arguments);setTimeout(()=>{try{ensure()}catch(e){console.error('v162.32 wizard',e)}},0);return r}}
  setTimeout(()=>{try{ensure()}catch(e){console.error('v162.32 wizard init',e)}},500);
  setTimeout(()=>{try{ensure()}catch(e){console.error('v162.32 wizard init',e)}},1500);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.32 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.32 guided trip wizard */
.mv-trip-wizard-v16232{margin:8px 0 14px;padding:12px;border:1px solid #dfe5ee;border-radius:14px;background:#f8fafc}.mv-wizard-head-v16232{display:grid;gap:8px}.mv-wizard-head-v16232>div:first-child{display:flex;justify-content:space-between;gap:10px;align-items:center}.mv-wizard-head-v16232 span{font-size:10.5px;color:#667085}.mv-wizard-head-v16232 b{font-size:13px;color:#17324d}.mv-wizard-track-v16232{height:6px;background:#e4e9f0;border-radius:999px;overflow:hidden}.mv-wizard-track-v16232 i{display:block;height:100%;width:25%;background:#173b78;border-radius:999px;transition:width .18s ease}.mv-wizard-actions-v16232{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.mv-wizard-actions-v16232 button{min-height:42px!important}.mv-trip-summary-v16232{display:none;gap:6px;margin:10px 0;padding:10px;border:1px solid #e1e6ef;border-radius:12px;background:#fff}.mv-trip-summary-v16232>div{display:grid;grid-template-columns:76px 1fr;gap:8px}.mv-trip-summary-v16232 b{font-size:10px;color:#17324d}.mv-trip-summary-v16232 span{font-size:11px;color:#475467;word-break:break-word}#novaViagem[data-mv-trip-step="1"] .mv-wizard-actions-v16232,#novaViagem[data-mv-trip-step="2"] .mv-wizard-actions-v16232,#novaViagem[data-mv-trip-step="3"] .mv-wizard-actions-v16232{position:sticky;bottom:8px;z-index:8;background:#f8fafc;padding-top:6px}
@media(max-width:700px){.mv-trip-wizard-v16232{padding:10px}.mv-wizard-actions-v16232{grid-template-columns:1fr 1fr}.mv-wizard-head-v16232 b{font-size:12px}}
`;
if(!s.includes('</style>'))throw new Error('v162.32 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.32: guided four-step trip flow with back/next navigation ready');
