const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.84: save planned trips to Agenda and use progressive disclosure for a cleaner UI.
(function(){
  const byId=id=>document.getElementById(id);
  const esc=v=>String(v||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  function routePlan(){try{return globalThis.mvActiveRouteV16283?.selectedPlan?.()||null}catch{return null}}
  function ensureSaveButton(){
    const start=byId('mvStartTripV16267');if(!start)return;
    let save=byId('mvSaveScheduledTripV16284');
    if(!save){
      save=document.createElement('button');save.type='button';save.id='mvSaveScheduledTripV16284';save.className='sec mv-save84';save.innerHTML='💾 Salvar viagem agendada';
      start.insertAdjacentElement('beforebegin',save);
      save.addEventListener('click',async e=>{
        e.preventDefault();
        const origin=(byId('origem')?.value||'').trim(),destination=(byId('destino')?.value||'').trim(),date=byId('dataViagem')?.value||new Date().toISOString().slice(0,10),purpose=(byId('motivo')?.value||'').trim(),notes=(byId('obs')?.value||'').trim();
        if(!destination){if(typeof msg==='function')msg('Informe o destino antes de salvar a viagem.',true);return}
        const p=routePlan();
        if(byId('agData'))byId('agData').value=date;
        if(byId('agHora')&&!byId('agHora').value)byId('agHora').value='08:00';
        if(byId('agOrigem'))byId('agOrigem').value=origin;
        if(byId('agDestino'))byId('agDestino').value=destination;
        if(byId('agMotivo'))byId('agMotivo').value=purpose;
        const summary=[];
        if(p?.distanceMeters)summary.push('Distância prevista: '+(Number(p.distanceMeters)/1000).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+' km');
        if(Number(p?.toll||0)>0)summary.push('Pedágio previsto: R$ '+Number(p.toll).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}));
        const full=[notes,...summary].filter(Boolean).join(' · ');
        if(byId('agObs'))byId('agObs').value=full;
        const ag=byId('btAgenda');
        if(!ag){if(typeof msg==='function')msg('Agenda ainda não está disponível.',true);return}
        save.disabled=true;const old=save.innerHTML;save.textContent='Salvando...';
        try{
          ag.click();
          setTimeout(()=>{try{globalThis.mvNavigationV16282?.navigate?.('agenda')}catch(_){try{show('agenda')}catch(__){}}},120);
          if(typeof msg==='function')msg('Viagem salva na agenda. Ela ainda não foi iniciada.');
        }finally{setTimeout(()=>{save.disabled=false;save.innerHTML=old},400)}
      });
    }
    let hint=byId('mvPlanActionsHint84');if(!hint){hint=document.createElement('div');hint.id='mvPlanActionsHint84';hint.className='mv-plan-hint84';hint.innerHTML='<b>O que deseja fazer?</b><span>Salve para usar depois ou inicie somente quando começar o percurso.</span>';save.insertAdjacentElement('beforebegin',hint)}
  }
  function wrapSection(firstId,lastId,title,icon,open=false){
    const first=byId(firstId),last=byId(lastId);if(!first||!last||first.closest('.mv-fold84'))return;
    let start=first.previousElementSibling;if(start?.tagName==='H3')first=start;
    const box=document.createElement('details');box.className='mv-fold84';box.open=!!open;
    const sum=document.createElement('summary');sum.innerHTML='<span>'+icon+'</span><b>'+esc(title)+'</b><small>Toque para '+(open?'recolher':'abrir')+'</small>';box.appendChild(sum);
    first.parentNode.insertBefore(box,first);
    let node=first,stop=last.nextSibling;while(node&&node!==stop){const next=node.nextSibling;box.appendChild(node);node=next}
  }
  function cleanActive(){
    const card=byId('viagemAtiva');if(!card||card.classList.contains('hide'))return;
    wrapSection('paradaNome','listaParadas','Paradas durante o percurso','📍');
    wrapSection('tipoDesp','listaDespesas','Despesas adicionais','💳');
    wrapSection('despComprovante','listaComprovantes','Comprovantes','📎');
    const kmf=byId('kmf'),final=byId('btFinalizar');if(kmf&&final&&!kmf.closest('.mv-fold84'))wrapSection('kmf','btFinalizar','Encerrar percurso','✓',false);
  }
  function polishPages(){
    document.querySelectorAll('#app section>.c').forEach(c=>c.classList.add('mv-surface84'));
    document.querySelectorAll('#app section h2').forEach(h=>h.classList.add('mv-title84'));
    document.querySelectorAll('#app section .row').forEach(r=>r.classList.add('mv-row84'));
  }
  function sync(){ensureSaveButton();cleanActive();polishPages()}
  [0,180,500,1100,2200].forEach(ms=>setTimeout(sync,ms));
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-p], [data-p-jump], #mvStartTripV16267'))setTimeout(sync,80)},true);
  globalThis.mvCleanUiV16284={sync};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.84 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.84 clean progressive interface */
#app{--mv-blue:#0b2d5d;--mv-primary:#1767cf;--mv-lime:#c8ff00;--mv-line:#dbe5f0;--mv-soft:#f5f8fc;--mv-muted:#66758a}
.mv-surface84{border:1px solid var(--mv-line)!important;border-radius:16px!important;box-shadow:0 5px 18px #0b2d5d0a!important;background:#fff!important}.mv-title84{color:#102a4d!important;font-size:22px!important;margin-top:2px!important}.mv-row84{border-color:#e1e8f1!important;background:#fbfcfe!important}
.mv-plan-hint84{display:grid;gap:3px;margin:14px 0 8px;padding:11px 12px;border-radius:12px;background:#f2f7fd;border:1px solid #d8e6f5;color:#183a62}.mv-plan-hint84 span{font-size:12px;color:#63758a}.mv-save84{width:100%!important;margin-top:6px!important;min-height:46px!important;background:#fff!important;color:#1767cf!important;border:1.5px solid #1767cf!important;font-weight:800!important}
.mv-fold84{border:1px solid #dbe5f0;border-radius:14px;background:#fff;margin:10px 0;overflow:hidden}.mv-fold84>summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:7px;padding:13px 14px;color:#15365e}.mv-fold84>summary::-webkit-details-marker{display:none}.mv-fold84>summary>span{font-size:18px}.mv-fold84>summary>b{font-size:14px}.mv-fold84>summary>small{font-size:11px;color:#718096}.mv-fold84[open]>summary{border-bottom:1px solid #e5ebf2;background:#f8fbff}.mv-fold84[open]>summary small{font-size:0}.mv-fold84[open]>summary small:after{content:'Toque para recolher';font-size:11px}.mv-fold84>*:not(summary){margin-left:12px!important;margin-right:12px!important}.mv-fold84>h3{display:none}.mv-fold84>.sep{display:none}.mv-fold84>button{width:calc(100% - 24px)!important;margin-bottom:12px!important}
#viagemAtiva{display:block}#viagemAtiva>.mv-active-route-summary-v16283{margin-bottom:10px!important}
@media(max-width:700px){.mv-surface84{padding:13px!important}.mv-title84{font-size:20px!important}.mv-fold84>summary{grid-template-columns:26px 1fr;}.mv-fold84>summary small{grid-column:2}.mv-plan-hint84{margin-top:10px}}
`;
if(!s.includes('</style>'))throw new Error('v162.84 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.84: scheduled-trip save action and progressive disclosure UI installed');
