const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.14: deterministic mobile place picker; no stale suggestion boxes.
(function(){
  const ctl=new WeakMap();
  const seq=new WeakMap();
  const timers=new WeakMap();
  const ids=new Set(['origem','destino','rotaOrigem','rotaDestino','agendaOriginV138','agendaDestV138','agOrigem','agDestino','stopNameV124','paradaNome']);
  function isPlaceField(el){
    if(!el||el.tagName!=='INPUT')return false;
    if(ids.has(el.id))return true;
    const ph=String(el.getAttribute('placeholder')||'').toLowerCase();
    const name=String(el.getAttribute('name')||'').toLowerCase();
    const marker=String(el.dataset?.placeField||el.dataset?.stopField||'').toLowerCase();
    return /parada|local da parada|endereco da parada|endereço da parada/.test(ph+' '+name+' '+marker);
  }
  function ensureDynamicId(el){
    if(el.id)return el.id;
    el.id='mvDynamicPlace'+Math.random().toString(36).slice(2,9);
    return el.id;
  }
  function closeBox(el){
    if(!el)return;
    ensureDynamicId(el);
    const b=document.getElementById('geo-'+el.id+'-v125');
    if(b)b.remove();
  }
  function closeAll(except){
    document.querySelectorAll('.geo-suggestions-v125').forEach(b=>{if(!except||b.id!=='geo-'+ensureDynamicId(except)+'-v125')b.remove()});
  }
  function choose(el,p){
    try{ctl.get(el)?.abort()}catch{}
    seq.set(el,(seq.get(el)||0)+1);
    el.dataset.mvPlaceChosen='1';
    el.dataset.mvPlaceChosenValue=googlePlaceLabelV130(p);
    el.value=el.dataset.mvPlaceChosenValue;
    el.dataset.placeId=p.placeId||'';
    el.dataset.placeKind=googlePlaceKindV130(p);
    closeAll();
    el.removeAttribute('list');
    el.setAttribute('autocomplete','off');
    el.blur();
    el.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function renderPicker(el,items){
    if(el.dataset.mvPlaceChosen==='1')return;
    ensureDynamicId(el);
    let box=ensureGeoBoxV125(el);
    box.innerHTML=items.map((p,i)=>'<button type="button" class="geo-option-v125 geo-option-v128 google-place-v130 mv-place-v16214" data-mv-place-v16214="'+i+'"><div class="geo-head-v128"><b>'+esc(p.mainText||p.text||'Local')+'</b><em>'+esc(googlePlaceKindV130(p))+'</em></div><span>'+esc(p.secondaryText||p.text||'')+'</span></button>').join('')+'<div class="google-attrib-v130">Resultados fornecidos pelo Google</div>';
    box.classList.remove('hide');
    const select=e=>{
      const b=e.target.closest('[data-mv-place-v16214]');
      if(!b||!box.contains(b))return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
      const p=items[Number(b.dataset.mvPlaceV16214)];
      if(p)choose(el,p);
    };
    box.addEventListener('pointerup',select,{capture:true});
    box.addEventListener('click',select,{capture:true});
  }
  searchPlacesV125=async function(el){
    if(!isPlaceField(el))return;
    ensureDynamicId(el);
    const q=el.value.trim();
    const chosen=el.dataset.mvPlaceChosen==='1';
    if(chosen && q===el.dataset.mvPlaceChosenValue){closeBox(el);return;}
    if(chosen){delete el.dataset.mvPlaceChosen;delete el.dataset.mvPlaceChosenValue;delete el.dataset.placeId;delete el.dataset.placeKind;}
    closeAll(el);
    if(q.length<3){closeBox(el);return;}
    try{ctl.get(el)?.abort()}catch{}
    const c=new AbortController();ctl.set(el,c);
    const n=(seq.get(el)||0)+1;seq.set(el,n);
    try{
      const r=await fetch('/api/places?q='+encodeURIComponent(q),{signal:c.signal,cache:'no-store',headers:{Accept:'application/json'}});
      const data=await r.json().catch(()=>({}));
      if(c.signal.aborted||seq.get(el)!==n||el.dataset.mvPlaceChosen==='1')return;
      if(!r.ok)throw new Error(data.error||'places');
      const items=Array.isArray(data.items)?data.items:[];
      if(items.length)renderPicker(el,items);
      else{
        const box=ensureGeoBoxV125(el);
        box.innerHTML='<div class="geo-empty-v125">Nenhuma cidade/endereço encontrado.</div>';
        box.classList.remove('hide');
      }
    }catch(e){if(e.name!=='AbortError'&&seq.get(el)===n){closeBox(el)}}
  };
  renderGooglePlacesV130=function(el,box,items){renderPicker(el,items)};
  document.addEventListener('input',e=>{
    const el=e.target;if(!isPlaceField(el))return;
    if(el.dataset.mvPlaceChosen==='1'&&el.value!==el.dataset.mvPlaceChosenValue){delete el.dataset.mvPlaceChosen;delete el.dataset.mvPlaceChosenValue;}
    clearTimeout(timers.get(el));
    const t=setTimeout(()=>searchPlacesV125(el),220);timers.set(el,t);
  },true);
  document.addEventListener('focusin',e=>{
    const el=e.target;if(!isPlaceField(el))return;
    ensureDynamicId(el);el.setAttribute('autocomplete','off');
    if(el.value.trim().length>=3){clearTimeout(timers.get(el));const t=setTimeout(()=>searchPlacesV125(el),80);timers.set(el,t)}
  },true);
  document.addEventListener('pointerdown',e=>{
    const el=e.target.closest?.('input');
    if((!el||!isPlaceField(el))&&!e.target.closest?.('.geo-suggestions-v125'))closeAll();
  },true);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.14 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.14 mobile place picker */
.mv-place-v16214{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;user-select:none!important}
`;
if(!s.includes('</style>'))throw new Error('v162.14 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.14: deterministic mobile place picker active, including dynamic route stops');
