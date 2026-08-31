const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.09: unified safe autocomplete with deterministic two-tap confirmation for origin, stop and destination.
(function(){
  const routeIds=new Set(['origem','destino','preTripStopNameV127']);
  let active=null,timer=0,items=[],selectedIndex=-1;
  function isField(el){return !!(el&&routeIds.has(el.id)&&el.closest?.('#p-viagem'))}
  function currentTarget(){const f=document.activeElement;return isField(f)?f:(isField(active)?active:null)}
  function portal(){let p=document.getElementById('mvRouteChoicesV16263');if(!p){p=document.createElement('div');p.id='mvRouteChoicesV16263';p.className='hide';document.body.appendChild(p)}return p}
  function suppressLegacy(){
    ['mvRouteChoicesV16261','mvPlacesV16248','mvNativePlacesV16260'].forEach(id=>{const p=document.getElementById(id);if(p){p.classList.add('hide');p.style.setProperty('display','none','important');p.style.setProperty('pointer-events','none','important')}});
  }
  function close(){const p=portal();p.classList.add('hide');p.innerHTML='';items=[];selectedIndex=-1}
  function position(input){const p=portal(),r=input.getBoundingClientRect();p.style.left=Math.max(8,r.left)+'px';p.style.top=Math.min(innerHeight-180,r.bottom+8)+'px';p.style.width=Math.min(Math.max(r.width,280),innerWidth-16)+'px'}
  function esc(v){return String(v||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
  function render(arr,input){items=Array.isArray(arr)?arr:[];selectedIndex=-1;if(!items.length){close();return}const p=portal();p.innerHTML=items.map((x,i)=>'<button type="button" data-mv-choice63="'+i+'"><b>'+esc(x.mainText||x.text)+'</b><span>'+esc(x.secondaryText||'')+'</span><em>Toque para selecionar</em></button>').join('')+'<div class="mv-route-google-v16263">Resultados fornecidos pelo Google</div>';position(input);p.classList.remove('hide')}
  async function search(input){const q=input.value.trim();if(q.length<2){close();return}try{const r=await fetch('/api/places?q='+encodeURIComponent(q),{cache:'no-store'});const j=await r.json().catch(()=>({items:[]}));if(active===input&&input.value.trim()===q)render(j.items||[],input)}catch(_){close()}}
  function onInput(el){active=el;suppressLegacy();clearTimeout(timer);timer=setTimeout(()=>search(el),280)}
  function choiceText(b,x){const main=b?.querySelector('b')?.textContent?.trim()||x?.mainText||x?.text||'';const secondary=b?.querySelector('span')?.textContent?.trim()||x?.secondaryText||'';return x?.text||[main,secondary].filter(Boolean).join(' - ')}
  function confirmSelection(index,b){
    const x=items[index],target=currentTarget();if(!target)return;
    const value=choiceText(b,x);if(!value)return;
    clearTimeout(timer);
    target.value=value;target.dataset.placeId=x?.placeId||'';
    target.dispatchEvent(new Event('change',{bubbles:true}));close();target.focus({preventScroll:true});active=target;
  }
  function handleChoice(b,e){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
    const idx=Number(b.dataset.mvChoice63);if(!Number.isInteger(idx))return;
    const p=portal();
    // The DOM selected state is authoritative. This survives delayed searches/re-renders better than a stale closure index.
    if(b.classList.contains('mv-selected-v16263')){confirmSelection(idx,b);return}
    clearTimeout(timer);selectedIndex=idx;
    p.querySelectorAll('button[data-mv-choice63]').forEach((btn,i)=>{const sel=i===idx;btn.classList.toggle('mv-selected-v16263',sel);const em=btn.querySelector('em');if(em)em.textContent=sel?'Selecionado — toque novamente para confirmar':'Toque para selecionar'});
    b.scrollIntoView({block:'nearest'});
  }
  function stopPoint(){return document.querySelector('#directRouteStackV127 .route-point-v126.stops')}
  function toggleStop(e){
    const t=e.target?.closest?.('#mvStopToggleV16262');if(!t)return false;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
    const point=stopPoint();if(!point)return true;
    point.classList.add('mv-stop-v16262');point.classList.toggle('mv-stop-open-v16262');
    const open=point.classList.contains('mv-stop-open-v16262');const label=t.querySelector('b');if(label)label.textContent=open?'Fechar':'Adicionar parada';
    if(open)setTimeout(()=>{const f=document.getElementById('preTripStopNameV127');if(f){active=f;f.focus({preventScroll:true})}},40);
    return true;
  }
  function addStop(e){const b=e.target?.closest?.('#preTripStopAddV127');if(!b)return false;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();if(typeof addPreTripStopV127==='function')addPreTripStopV127();return true}
  document.addEventListener('click',e=>{if(toggleStop(e))return;if(addStop(e))return},true);
  document.addEventListener('keydown',e=>{if(e.target?.id==='preTripStopNameV127'&&e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();if(typeof addPreTripStopV127==='function')addPreTripStopV127()}},true);
  for(const type of ['pointerdown','touchstart','click'])window.addEventListener(type,e=>{if(!isField(e.target))return;active=e.target;suppressLegacy();e.stopImmediatePropagation()},true);
  window.addEventListener('focusin',e=>{if(!isField(e.target))return;active=e.target;suppressLegacy();if(e.target.value.trim().length>=2){clearTimeout(timer);timer=setTimeout(()=>search(e.target),140)}e.stopImmediatePropagation()},true);
  window.addEventListener('input',e=>{if(!isField(e.target))return;onInput(e.target);e.stopImmediatePropagation()},true);
  document.addEventListener('pointerup',e=>{const b=e.target.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]');if(!b)return;handleChoice(b,e)},true);
  document.addEventListener('click',e=>{const b=e.target.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]');if(!b)return;e.preventDefault();e.stopImmediatePropagation()},true);
  document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]');if(!b)return;e.preventDefault();e.stopPropagation()},true);
  document.addEventListener('scroll',()=>{if(active&&!portal().classList.contains('hide'))position(active)},true);
  window.addEventListener('resize',()=>{if(active&&!portal().classList.contains('hide'))position(active)});
  function install(){suppressLegacy();const stop=document.getElementById('preTripStopNameV127');if(stop){stop.setAttribute('autocomplete','off');stop.dataset.geoV125='1'}}
  install();[120,500,1200,2500].forEach(ms=>setTimeout(install,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v163.09 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.09 safe Android autocomplete */
#mvRouteChoicesV16261,#mvPlacesV16248,#mvNativePlacesV16260{display:none!important;visibility:hidden!important;pointer-events:none!important}
#mvRouteChoicesV16263{position:fixed!important;z-index:2147483646!important;max-height:min(330px,42vh)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;background:#fff!important;border:1px solid #d7dee8!important;border-radius:12px!important;box-shadow:0 10px 28px rgba(15,23,42,.18)!important;padding:5px 8px!important;touch-action:pan-y!important}
#mvRouteChoicesV16263.hide{display:none!important}
#mvRouteChoicesV16263 button{display:grid!important;grid-template-columns:minmax(0,1fr) 28px!important;gap:4px 10px!important;align-items:center!important;width:100%!important;min-height:78px!important;background:#fff!important;color:#172033!important;border:0!important;border-bottom:1px solid #eef1f5!important;border-radius:8px!important;padding:12px 10px!important;text-align:left!important;touch-action:manipulation!important;box-shadow:none!important}
#mvRouteChoicesV16263 button:after{content:'⌖';grid-column:2;grid-row:1 / span 3;justify-self:center;font-size:22px;color:#596779}
#mvRouteChoicesV16263 button b{grid-column:1;font-size:15px!important;line-height:20px!important;color:#172033!important;font-weight:750!important}
#mvRouteChoicesV16263 button span{grid-column:1;font-size:12px!important;line-height:16px!important;color:#667085!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#mvRouteChoicesV16263 button em{grid-column:1;font-style:normal!important;font-size:11px!important;line-height:15px!important;color:#7b8491!important}
#mvRouteChoicesV16263 button.mv-selected-v16263{background:#eef5ff!important;box-shadow:inset 0 0 0 2px #3378ed!important}
#mvRouteChoicesV16263 button.mv-selected-v16263 b{color:#0f4a9d!important}
#mvRouteChoicesV16263 button.mv-selected-v16263 em{color:#0f4a9d!important;font-weight:700!important}
#mvRouteChoicesV16263 .mv-route-google-v16263{padding:8px 10px!important;background:#fff!important;color:#8a94a3!important;text-align:right!important;font-size:11px!important}
`;
if(!s.includes('</style>'))throw new Error('v163.09 css anchor not found');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.09: deterministic two-tap Android autocomplete installed');