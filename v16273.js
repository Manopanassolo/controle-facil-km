const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.73: advanced route-planner workspace — suggested routes + custom itinerary editor.
(function(){
  const byId=id=>document.getElementById(id);
  const esc=v=>String(v||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const clean=arr=>(arr||[]).map(x=>typeof x==='string'?x:String(x?.place_name||'')).map(x=>x.trim()).filter(Boolean);
  function points(){
    const origin=(byId('origem')?.value||'').trim(),destination=(byId('destino')?.value||'').trim();
    let stops=[];try{stops=clean(globalThis.mvRouteStopsV16270?.())}catch(_){}
    const round=!!byId('routeRoundTripV132')?.checked;
    return {origin,destination,stops,round};
  }
  function ensureToolbar(box){
    if(!box||box.querySelector('#mvPlannerModesV16273'))return;
    const cards=[...box.querySelectorAll('.mv-route72')];if(!cards.length)return;
    const toolbar=document.createElement('div');toolbar.id='mvPlannerModesV16273';toolbar.className='mv-planner-modes73';toolbar.innerHTML='<button type="button" class="active" data-mode73="suggested">🛣️ Rotas sugeridas</button><button type="button" data-mode73="custom">🧩 Montar minha rota</button>';
    box.insertBefore(toolbar,box.firstChild);
    const hint=document.createElement('div');hint.id='mvPlannerHintV16273';hint.className='mv-planner-hint73';hint.innerHTML='<b>Escolha rápida</b><span>Selecione uma das rotas calculadas pelo Google ou monte o percurso por trechos.</span>';
    toolbar.insertAdjacentElement('afterend',hint);
    const custom=document.createElement('section');custom.id='mvCustomPlannerV16273';custom.className='mv-custom73 hide';box.insertBefore(custom,box.querySelector('#routeMapWrapV133'));
    const setMode=mode=>{
      toolbar.querySelectorAll('[data-mode73]').forEach(b=>b.classList.toggle('active',b.dataset.mode73===mode));
      custom.classList.toggle('hide',mode!=='custom');
      cards.forEach(c=>c.classList.toggle('mv-suggested-hidden73',mode==='custom'));
      hint.innerHTML=mode==='custom'?'<b>Monte o percurso</b><span>Organize as paradas e escolha qual trecho deseja personalizar. O retorno pode usar um caminho diferente da ida.</span>':'<b>Escolha rápida</b><span>Selecione uma das rotas calculadas pelo Google. Km, tempo e pedágios representam o percurso completo.</span>';
      if(mode==='custom')renderCustom(custom);
    };
    toolbar.querySelectorAll('[data-mode73]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode73));
    setMode('suggested');
  }
  function renderCustom(custom){
    const p=points(),nodes=[{kind:'origin',label:'Origem',value:p.origin},...p.stops.map((x,i)=>({kind:'stop',index:i,label:'Parada '+(i+1),value:x})),{kind:'destination',label:'Destino',value:p.destination}];
    if(p.round)nodes.push({kind:'return',label:'Retorno',value:p.origin});
    const rows=nodes.map((n,i)=>{
      const letter=n.kind==='origin'?'A':n.kind==='destination'?'D':n.kind==='return'?'R':String(i);
      const controls=n.kind==='stop'?'<span class="mv-order73"><button type="button" data-up73="'+n.index+'" aria-label="Subir parada">↑</button><button type="button" data-down73="'+n.index+'" aria-label="Descer parada">↓</button></span>':'';
      return '<div class="mv-point73" data-kind73="'+n.kind+'"><i>'+letter+'</i><div><b>'+esc(n.label)+'</b><span>'+esc(n.value||'Não informado')+'</span></div>'+controls+'</div>';
    }).join('');
    const segments=[];for(let i=0;i<nodes.length-1;i++)segments.push({from:nodes[i],to:nodes[i+1],i});
    custom.innerHTML='<div class="mv-custom-head73"><div><b>Minha rota</b><span>Defina a sequência e personalize cada trecho.</span></div><button type="button" id="mvRecalcCustom73">Recalcular</button></div><div class="mv-points73">'+rows+'</div><div class="mv-segments-title73"><b>Trechos do percurso</b><span>Toque em um trecho para trabalhar nele separadamente.</span></div><div class="mv-segments73">'+segments.map((sg,i)=>'<button type="button" data-segment73="'+i+'"><span>Trecho '+(i+1)+'</span><b>'+esc(sg.from.value)+' → '+esc(sg.to.value)+'</b><small>'+(sg.to.kind==='return'?'Retorno — pode usar caminho diferente':'Escolher caminho deste trecho')+'</small></button>').join('')+'</div><div id="mvSegmentEditor73" class="mv-segment-editor73"><b>Selecione um trecho</b><span>Depois poderemos aplicar uma das rotas sugeridas somente a esse trecho ou desenhar um caminho próprio no mapa.</span></div>';
    const move=(idx,delta)=>{try{const arr=clean(globalThis.mvPreTripStopsV16270||globalThis.mvRouteStopsV16270?.()||[]);const j=idx+delta;if(idx<0||j<0||idx>=arr.length||j>=arr.length)return;[arr[idx],arr[j]]=[arr[j],arr[idx]];globalThis.mvPreTripStopsV16270=arr;globalThis.mvChosenStopOrderV16270=[...arr];const list=byId('preTripStopsListV127');if(list){const bs=[...list.querySelectorAll('.pre-stop-row-v127 b')];if(bs.length===arr.length)bs.forEach((b,k)=>b.textContent=arr[k])}renderCustom(custom)}catch(_){}};
    custom.querySelectorAll('[data-up73]').forEach(b=>b.onclick=()=>move(Number(b.dataset.up73),-1));custom.querySelectorAll('[data-down73]').forEach(b=>b.onclick=()=>move(Number(b.dataset.down73),1));
    custom.querySelectorAll('[data-segment73]').forEach(b=>b.onclick=()=>{custom.querySelectorAll('[data-segment73]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');const sg=segments[Number(b.dataset.segment73)],ed=byId('mvSegmentEditor73');if(ed)ed.innerHTML='<b>Trecho '+(sg.i+1)+' selecionado</b><span>'+esc(sg.from.value)+' → '+esc(sg.to.value)+'</span><div class="mv-segment-actions73"><button type="button" id="mvUseSuggested73">Usar rota sugerida</button><button type="button" id="mvOpenSegmentMap73">Abrir trecho no mapa</button></div><small>'+(sg.to.kind==='return'?'Você poderá escolher um retorno diferente do trajeto de ida.':'Este trecho poderá ser personalizado sem alterar os demais.')+'</small>';const open=byId('mvOpenSegmentMap73');if(open)open.onclick=()=>window.open('https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(sg.from.value)+'&destination='+encodeURIComponent(sg.to.value)+'&travelmode=driving','_blank');const use=byId('mvUseSuggested73');if(use)use.onclick=()=>{document.querySelector('[data-mode73="suggested"]')?.click();boxFirstRoute()}});
    const rec=byId('mvRecalcCustom73');if(rec)rec.onclick=()=>{const btn=byId('mvPlanRouteV16272');if(btn)btn.click()};
  }
  function boxFirstRoute(){const box=byId('routePlanResultsV131');box?.querySelector('.mv-route72')?.click()}
  function decorate(){if(globalThis.mvStableRouteControllerV16277)return;const box=byId('routePlanResultsV131');if(!box)return;if(box.querySelector('.mv-route72'))ensureToolbar(box)}
  [0,250,600,1200,2400].forEach(ms=>setTimeout(decorate,ms));
  new MutationObserver(()=>requestAnimationFrame(decorate)).observe(document.documentElement,{subtree:true,childList:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.73 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.73 advanced route planner formatting */
.mv-planner-modes73{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin:0 0 10px!important;position:sticky!important;top:0!important;z-index:4!important;background:#fff!important;padding:4px 0!important}
.mv-planner-modes73 button{min-height:44px!important;border:1px solid #cad4e3!important;background:#fff!important;color:#173052!important;border-radius:10px!important;font-weight:800!important;font-size:13px!important}
.mv-planner-modes73 button.active{background:#1767cf!important;border-color:#1767cf!important;color:#fff!important}
.mv-planner-hint73{padding:11px 12px!important;background:#f5f8fc!important;border:1px solid #dce5f0!important;border-radius:10px!important;margin-bottom:10px!important}.mv-planner-hint73 b,.mv-planner-hint73 span{display:block!important}.mv-planner-hint73 b{font-size:13px!important;color:#173052!important;margin-bottom:3px!important}.mv-planner-hint73 span{font-size:11px!important;color:#667085!important;line-height:1.35!important}
.mv-suggested-hidden73{display:none!important}.mv-custom73{display:block!important;background:#fff!important;border:1px solid #dce5f0!important;border-radius:14px!important;padding:12px!important;margin:0 0 12px!important}.mv-custom73.hide{display:none!important}
.mv-custom-head73{display:flex!important;justify-content:space-between!important;gap:10px!important;align-items:center!important;margin-bottom:10px!important}.mv-custom-head73>div b,.mv-custom-head73>div span{display:block!important}.mv-custom-head73>div b{font-size:16px!important;color:#14233d!important}.mv-custom-head73>div span{font-size:11px!important;color:#667085!important;margin-top:2px!important}.mv-custom-head73>button{border:0!important;background:#1767cf!important;color:#fff!important;border-radius:8px!important;padding:9px 11px!important;font-weight:800!important}
.mv-points73{display:flex!important;flex-direction:column!important;gap:0!important}.mv-point73{display:grid!important;grid-template-columns:28px 1fr auto!important;gap:8px!important;align-items:center!important;min-height:54px!important;position:relative!important}.mv-point73:not(:last-child):after{content:''!important;position:absolute!important;left:13px!important;top:38px!important;bottom:-16px!important;border-left:2px dotted #aab9cc!important}.mv-point73>i{width:28px!important;height:28px!important;border-radius:50%!important;background:#e9f1fc!important;color:#1767cf!important;font-style:normal!important;font-weight:900!important;display:flex!important;align-items:center!important;justify-content:center!important;z-index:1!important}.mv-point73>div b,.mv-point73>div span{display:block!important}.mv-point73>div b{font-size:11px!important;color:#667085!important}.mv-point73>div span{font-size:12px!important;font-weight:700!important;color:#14233d!important;line-height:1.3!important}.mv-order73{display:flex!important;gap:4px!important}.mv-order73 button{width:30px!important;height:30px!important;border:1px solid #d5deea!important;background:#fff!important;border-radius:7px!important;font-weight:900!important;color:#173052!important}
.mv-segments-title73{margin:14px 0 7px!important}.mv-segments-title73 b,.mv-segments-title73 span{display:block!important}.mv-segments-title73 b{font-size:13px!important;color:#14233d!important}.mv-segments-title73 span{font-size:10px!important;color:#667085!important;margin-top:2px!important}
.mv-segments73{display:flex!important;flex-direction:column!important;gap:7px!important}.mv-segments73>button{width:100%!important;text-align:left!important;background:#f7f9fc!important;border:1px solid #dce5f0!important;border-radius:9px!important;padding:10px!important;color:#14233d!important}.mv-segments73>button.selected{background:#e9f2ff!important;border-color:#1767cf!important}.mv-segments73 span,.mv-segments73 b,.mv-segments73 small{display:block!important}.mv-segments73 span{font-size:10px!important;color:#1767cf!important;font-weight:900!important}.mv-segments73 b{font-size:11px!important;margin:2px 0!important;line-height:1.35!important}.mv-segments73 small{font-size:10px!important;color:#667085!important}
.mv-segment-editor73{margin-top:9px!important;padding:11px!important;border:1px dashed #b7c7da!important;border-radius:9px!important;background:#fbfcfe!important}.mv-segment-editor73>b,.mv-segment-editor73>span,.mv-segment-editor73>small{display:block!important}.mv-segment-editor73>b{font-size:13px!important;color:#14233d!important}.mv-segment-editor73>span,.mv-segment-editor73>small{font-size:10px!important;color:#667085!important;line-height:1.35!important;margin-top:3px!important}.mv-segment-actions73{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important;margin-top:8px!important}.mv-segment-actions73 button{min-height:38px!important;border-radius:8px!important;border:1px solid #1767cf!important;background:#fff!important;color:#1767cf!important;font-weight:800!important;font-size:11px!important}
`;
if(!s.includes('</style>'))throw new Error('v162.73 css anchor not found');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.73: advanced route planner workspace formatted');
