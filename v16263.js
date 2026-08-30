const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.63: unified safe autocomplete for origin, stop and destination; prevents Android touch-through.
(function(){
  const routeIds=new Set(['origem','destino','preTripStopNameV127']);
  let active=null,timer=0,items=[],closing=false;
  function isField(el){return !!(el&&routeIds.has(el.id)&&el.closest?.('#p-viagem'))}
  function portal(){let p=document.getElementById('mvRouteChoicesV16263');if(!p){p=document.createElement('div');p.id='mvRouteChoicesV16263';p.className='hide';document.body.appendChild(p)}return p}
  function suppressLegacy(){
    ['mvRouteChoicesV16261','mvPlacesV16248','mvNativePlacesV16260'].forEach(id=>{const p=document.getElementById(id);if(p){p.classList.add('hide');p.style.setProperty('display','none','important');p.style.setProperty('pointer-events','none','important')}});
  }
  function close(delay=0){
    const run=()=>{const p=portal();p.classList.add('hide');p.innerHTML='';items=[];closing=false};
    closing=true;if(delay)setTimeout(run,delay);else run();
  }
  function position(input){const p=portal(),r=input.getBoundingClientRect();p.style.left=Math.max(8,r.left)+'px';p.style.top=Math.min(innerHeight-180,r.bottom+8)+'px';p.style.width=Math.min(Math.max(r.width,280),innerWidth-16)+'px'}
  function esc(v){return String(v||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
  function render(arr,input){items=Array.isArray(arr)?arr:[];if(!items.length){close();return}const p=portal();p.innerHTML=items.map((x,i)=>'<button type="button" data-mv-choice63="'+i+'"><b>'+esc(x.mainText||x.text)+'</b><span>'+esc(x.secondaryText||'')+'</span></button>').join('')+'<div class="mv-route-google-v16263">Resultados fornecidos pelo Google</div>';position(input);p.classList.remove('hide')}
  async function search(input){const q=input.value.trim();if(q.length<2){close();return}try{const r=await fetch('/api/places?q='+encodeURIComponent(q),{cache:'no-store'});const j=await r.json().catch(()=>({items:[]}));if(active===input&&input.value.trim()===q)render(j.items||[],input)}catch(_){close()}}
  function onInput(el){active=el;suppressLegacy();clearTimeout(timer);timer=setTimeout(()=>search(el),280)}
  function choose(b,e){
    if(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.()}
    const x=items[Number(b.dataset.mvChoice63)],target=active;if(!x||!target)return;
    target.value=x.text||[x.mainText,x.secondaryText].filter(Boolean).join(', ');target.dataset.placeId=x.placeId||'';
    target.dispatchEvent(new Event('change',{bubbles:true}));
    // Keep an invisible interception shield briefly so the same finger release cannot hit controls underneath.
    const p=portal();p.classList.add('mv-touch-shield-v16263');p.innerHTML='';items=[];
    setTimeout(()=>{p.classList.remove('mv-touch-shield-v16263');p.classList.add('hide');target.focus({preventScroll:true})},320);
  }
  // Stop the legacy stop autocomplete from receiving route-field gestures/input.
  for(const type of ['pointerdown','touchstart','click'])window.addEventListener(type,e=>{if(!isField(e.target))return;suppressLegacy();e.stopImmediatePropagation()},true);
  window.addEventListener('focusin',e=>{if(!isField(e.target))return;active=e.target;suppressLegacy();if(e.target.value.trim().length>=2){clearTimeout(timer);timer=setTimeout(()=>search(e.target),140)}e.stopImmediatePropagation()},true);
  window.addEventListener('input',e=>{if(!isField(e.target))return;onInput(e.target);e.stopImmediatePropagation()},true);
  // Choose on pointerup/click, not pointerdown. This avoids removing the list while the finger is still pressed.
  document.addEventListener('pointerup',e=>{const b=e.target.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]');if(!b)return;choose(b,e)},true);
  document.addEventListener('click',e=>{const b=e.target.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]');if(!b)return;e.preventDefault();e.stopImmediatePropagation()},true);
  document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]');if(!b)return;e.preventDefault();e.stopPropagation()},true);
  document.addEventListener('scroll',()=>{if(active&&!portal().classList.contains('hide'))position(active)},true);
  window.addEventListener('resize',()=>{if(active&&!portal().classList.contains('hide'))position(active)});
  function install(){suppressLegacy();const stop=document.getElementById('preTripStopNameV127');if(stop){stop.setAttribute('autocomplete','off');stop.dataset.geoV125='1'}}
  install();[120,500,1200,2500].forEach(ms=>setTimeout(install,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.63 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.63 safe Android autocomplete */
#mvRouteChoicesV16261,#mvPlacesV16248,#mvNativePlacesV16260{display:none!important;visibility:hidden!important;pointer-events:none!important}
#mvRouteChoicesV16263{position:fixed!important;z-index:2147483646!important;max-height:min(330px,42vh)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;background:#fff!important;border:1px solid #d7dee8!important;border-radius:12px!important;box-shadow:0 10px 28px rgba(15,23,42,.18)!important;padding:5px 8px!important;touch-action:pan-y!important}
#mvRouteChoicesV16263.hide{display:none!important}
#mvRouteChoicesV16263.mv-touch-shield-v16263{display:block!important;min-height:72px!important;background:transparent!important;border-color:transparent!important;box-shadow:none!important;pointer-events:auto!important}
#mvRouteChoicesV16263 button{display:grid!important;grid-template-columns:minmax(0,1fr) 28px!important;gap:4px 10px!important;align-items:center!important;width:100%!important;min-height:72px!important;background:#fff!important;color:#172033!important;border:0!important;border-bottom:1px solid #eef1f5!important;border-radius:0!important;padding:13px 10px!important;text-align:left!important;touch-action:manipulation!important;box-shadow:none!important}
#mvRouteChoicesV16263 button:after{content:'⌖';grid-column:2;grid-row:1 / span 2;justify-self:center;font-size:22px;color:#596779}
#mvRouteChoicesV16263 button b{grid-column:1;font-size:15px!important;line-height:20px!important;color:#172033!important;font-weight:750!important}
#mvRouteChoicesV16263 button span{grid-column:1;font-size:12px!important;line-height:16px!important;color:#667085!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#mvRouteChoicesV16263 .mv-route-google-v16263{padding:8px 10px!important;background:#fff!important;color:#8a94a3!important;text-align:right!important;font-size:11px!important}
`;
if(!s.includes('</style>'))throw new Error('v162.63 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.63: safe unified Android autocomplete installed');
