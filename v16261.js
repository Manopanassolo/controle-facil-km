const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.61: rebuild Origem/Destino as fresh native inputs and isolate route autocomplete.
(function(){
  const ids=new Set(['origem','destino']);
  let active=null,timer=0,items=[];
  function isRouteField(el){return !!(el&&ids.has(el.id)&&el.closest?.('#p-viagem'))}
  function oldPortalOff(){
    ['mvPlacesV16248','mvNativePlacesV16260'].forEach(id=>{const p=document.getElementById(id);if(p){p.classList.add('hide');p.style.setProperty('display','none','important');p.style.setProperty('visibility','hidden','important');p.style.setProperty('pointer-events','none','important')}})
  }
  function portal(){let p=document.getElementById('mvRouteChoicesV16261');if(!p){p=document.createElement('div');p.id='mvRouteChoicesV16261';p.className='hide';document.body.appendChild(p)}return p}
  function close(){const p=portal();p.classList.add('hide');p.innerHTML='';items=[]}
  function position(input){const p=portal(),r=input.getBoundingClientRect();p.style.left=Math.max(8,r.left)+'px';p.style.top=Math.min(innerHeight-160,r.bottom+6)+'px';p.style.width=Math.min(r.width,innerWidth-16)+'px'}
  function esc(v){return String(v||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
  function render(arr,input){items=Array.isArray(arr)?arr:[];if(!items.length){close();return}const p=portal();p.innerHTML=items.map((x,i)=>'<button type="button" data-mv-choice="'+i+'"><b>'+esc(x.mainText||x.text)+'</b><span>'+esc(x.secondaryText||'')+'</span></button>').join('')+'<div class="mv-route-google-v16261">Resultados fornecidos pelo Google</div>';position(input);p.classList.remove('hide')}
  async function search(input){const q=input.value.trim();if(q.length<2){close();return}try{const r=await fetch('/api/places?q='+encodeURIComponent(q),{cache:'no-store'});const j=await r.json().catch(()=>({items:[]}));if(active===input&&input.value.trim()===q)render(j.items||[],input)}catch(_){close()}}
  function rebuild(id){
    const old=document.getElementById(id);if(!old)return null;
    const v60=document.getElementById(id==='origem'?'mvOrigemNativeV16260':'mvDestinoNativeV16260');
    const value=(v60?.value||old.value||'');
    if(v60)v60.remove();
    if(old.dataset.mvCleanV16261==='1'){old.disabled=false;old.readOnly=false;old.classList.remove('mv-legacy-route-input-v16260');old.removeAttribute('aria-hidden');old.style.removeProperty('display');old.style.removeProperty('visibility');old.style.removeProperty('opacity');old.tabIndex=0;return old}
    const fresh=old.cloneNode(false);
    fresh.id=id;fresh.value=value;fresh.type='text';fresh.disabled=false;fresh.readOnly=false;fresh.removeAttribute('disabled');fresh.removeAttribute('readonly');fresh.removeAttribute('aria-hidden');fresh.tabIndex=0;fresh.inputMode='text';fresh.autocomplete='off';fresh.setAttribute('autocorrect','off');fresh.spellcheck=false;fresh.dataset.mvCleanV16261='1';
    fresh.classList.remove('mv-legacy-route-input-v16260');
    ['lat','lon','placeId'].forEach(k=>{const val=v60?.dataset?.[k]||old.dataset?.[k];if(val)fresh.dataset[k]=val});
    old.replaceWith(fresh);
    return fresh;
  }
  function install(){oldPortalOff();ids.forEach(rebuild)}
  function onInput(el){active=el;oldPortalOff();clearTimeout(timer);timer=setTimeout(()=>search(el),220)}
  // Sole event authority for the two native route fields. We never preventDefault on native
  // gestures, so Android keeps its normal focus/keyboard action, while old delegated handlers
  // are prevented from re-entering, replacing or blurring these fields.
  for(const type of ['pointerdown','touchstart','click'])window.addEventListener(type,e=>{if(!isRouteField(e.target))return;e.stopImmediatePropagation()},true);
  window.addEventListener('focus',e=>{if(!isRouteField(e.target))return;active=e.target;oldPortalOff();e.stopImmediatePropagation()},true);
  window.addEventListener('focusin',e=>{if(!isRouteField(e.target))return;active=e.target;oldPortalOff();if(e.target.value.trim().length>=2){clearTimeout(timer);timer=setTimeout(()=>search(e.target),100)}e.stopImmediatePropagation()},true);
  window.addEventListener('input',e=>{if(!isRouteField(e.target))return;onInput(e.target);e.stopImmediatePropagation()},true);
  document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('#mvRouteChoicesV16261 button[data-mv-choice]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const x=items[Number(b.dataset.mvChoice)];if(!x||!active)return;active.value=x.text||[x.mainText,x.secondaryText].filter(Boolean).join(', ');active.dataset.placeId=x.placeId||'';active.dispatchEvent(new Event('change',{bubbles:true}));close();active.focus()},true);
  document.addEventListener('click',e=>{const b=e.target.closest?.('#mvRouteChoicesV16261 button[data-mv-choice]');if(!b)return;e.preventDefault();e.stopImmediatePropagation()},true);
  document.addEventListener('scroll',()=>{if(active&&document.activeElement===active)position(active)},true);
  window.addEventListener('resize',()=>{if(active&&document.activeElement===active)position(active)});
  install();[120,500,1200,2500].forEach(ms=>setTimeout(install,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.61 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.61 fresh native route input authority */
body #p-viagem #origem,body #p-viagem #destino{display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;min-height:58px!important;height:58px!important;box-sizing:border-box!important;border:1px solid #ccd5e2!important;border-radius:8px!important;background:#fff!important;padding:0 16px!important;font-size:16px!important;line-height:1.2!important;color:#172033!important;caret-color:#172033!important;pointer-events:auto!important;touch-action:auto!important;user-select:text!important;-webkit-user-select:text!important;position:relative!important;z-index:90!important;outline:0!important;box-shadow:none!important}
body #p-viagem #origem:focus,body #p-viagem #destino:focus{border-color:#3378ed!important;box-shadow:0 0 0 2px rgba(51,120,237,.16)!important}
#mvOrigemNativeV16260,#mvDestinoNativeV16260,#mvNativePlacesV16260,#mvPlacesV16248{display:none!important;visibility:hidden!important;pointer-events:none!important}
#mvRouteChoicesV16261{position:fixed!important;z-index:2147483642!important;max-height:min(340px,40vh)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;background:#fff!important;border:1px solid #d7dee8!important;border-radius:12px!important;box-shadow:0 10px 28px rgba(15,23,42,.18)!important;padding:4px 8px!important}
#mvRouteChoicesV16261.hide{display:none!important}
#mvRouteChoicesV16261 button{display:grid!important;grid-template-columns:minmax(0,1fr) 28px!important;gap:4px 10px!important;align-items:center!important;width:100%!important;min-height:66px!important;background:#fff!important;color:#172033!important;border:0!important;border-bottom:1px solid #eef1f5!important;border-radius:0!important;padding:11px 10px!important;text-align:left!important;touch-action:manipulation!important;box-shadow:none!important}
#mvRouteChoicesV16261 button:after{content:'⌖';grid-column:2;grid-row:1 / span 2;justify-self:center;font-size:22px;color:#596779}
#mvRouteChoicesV16261 button b{grid-column:1;font-size:15px!important;line-height:19px!important;color:#172033!important;font-weight:750!important}
#mvRouteChoicesV16261 button span{grid-column:1;font-size:12px!important;line-height:16px!important;color:#667085!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#mvRouteChoicesV16261 .mv-route-google-v16261{padding:8px 10px!important;background:#fff!important;color:#8a94a3!important;text-align:right!important;font-size:11px!important}
`;
if(!s.includes('</style>'))throw new Error('v162.61 css anchor not found');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.61: fresh native route inputs and isolated white autocomplete installed');
