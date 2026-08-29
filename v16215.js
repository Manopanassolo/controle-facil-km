const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.15: unified Google Places portal for origin, destination and dynamic stops.
(function(){
  const supportedIds=new Set(['origem','destino','rotaOrigem','rotaDestino','agendaOriginV138','agendaDestV138','agOrigem','agDestino','stopNameV124','paradaNome','preTripStopNameV127']);
  const state={el:null,items:[],seq:0,ctl:null,timer:null};
  function isField(el){
    if(!el||el.tagName!=='INPUT')return false;
    if(supportedIds.has(el.id))return true;
    const txt=((el.placeholder||'')+' '+(el.name||'')+' '+(el.dataset?.placeField||'')).toLowerCase();
    return /cidade|endere[cç]o|local|parada|origem|destino/.test(txt) && !!el.closest('#p-viagem,#p-agenda,#p-rotas');
  }
  function portal(){
    let p=document.getElementById('mvPlacesPortalV16215');
    if(!p){
      p=document.createElement('div');p.id='mvPlacesPortalV16215';p.className='mv-places-portal-v16215 hide';document.body.appendChild(p);
    }
    return p;
  }
  function close(){
    state.seq++;
    try{state.ctl?.abort()}catch{}
    state.ctl=null;state.items=[];state.el=null;
    const p=document.getElementById('mvPlacesPortalV16215');if(p){p.classList.add('hide');p.innerHTML=''}
    document.querySelectorAll('.geo-suggestions-v125').forEach(x=>{x.classList.add('hide');x.innerHTML=''});
  }
  function placePortal(el){
    const p=portal(),r=el.getBoundingClientRect(),pad=8;
    const left=Math.max(pad,r.left),right=Math.min(window.innerWidth-pad,r.right);
    p.style.left=left+'px';p.style.width=Math.max(220,right-left)+'px';
    const below=window.innerHeight-r.bottom,estimated=Math.min(320,Math.max(180,state.items.length*68+36));
    if(below>=Math.min(estimated,240)){p.style.top=(r.bottom+4)+'px';p.style.bottom='auto';p.style.maxHeight=Math.min(320,below-10)+'px'}
    else{p.style.top='auto';p.style.bottom=(window.innerHeight-r.top+4)+'px';p.style.maxHeight=Math.min(320,r.top-10)+'px'}
  }
  function label(p){return typeof googlePlaceLabelV130==='function'?googlePlaceLabelV130(p):(p.mainText||p.text||'')}
  function kind(p){return typeof googlePlaceKindV130==='function'?googlePlaceKindV130(p):'Local'}
  function choose(i,e){
    if(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.()}
    const el=state.el,p=state.items[i];if(!el||!p)return;
    const v=label(p);el.value=v;el.dataset.placeId=p.placeId||'';el.dataset.placeKind=kind(p);el.dataset.mvPlaceChosen='1';el.dataset.mvPlaceChosenValue=v;
    close();el.blur();el.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function render(el,items){
    state.el=el;state.items=items;const p=portal();
    p.innerHTML=items.map((x,i)=>'<button type="button" data-mv-place-v16215="'+i+'"><b>'+esc(x.mainText||x.text||'Local')+'</b><em>'+esc(kind(x))+'</em><span>'+esc(x.secondaryText||x.text||'')+'</span></button>').join('')+'<div class="mv-google-note-v16215">Resultados fornecidos pelo Google</div>';
    p.classList.remove('hide');placePortal(el);
  }
  async function search(el){
    if(!isField(el))return;
    const q=el.value.trim();
    if(el.dataset.mvPlaceChosen==='1'&&q===el.dataset.mvPlaceChosenValue){close();return}
    if(el.dataset.mvPlaceChosen==='1'){delete el.dataset.mvPlaceChosen;delete el.dataset.mvPlaceChosenValue;delete el.dataset.placeId;delete el.dataset.placeKind}
    if(q.length<3){close();return}
    try{state.ctl?.abort()}catch{}
    const ctl=new AbortController();state.ctl=ctl;const seq=++state.seq;state.el=el;
    try{
      const r=await fetch('/api/places?q='+encodeURIComponent(q),{signal:ctl.signal,cache:'no-store',headers:{Accept:'application/json'}}),j=await r.json().catch(()=>({}));
      if(ctl.signal.aborted||seq!==state.seq||document.activeElement!==el)return;
      if(!r.ok)throw Error(j.error||'places');
      const items=Array.isArray(j.items)?j.items:[];
      if(items.length)render(el,items);else{const p=portal();state.el=el;state.items=[];p.innerHTML='<div class="mv-place-empty-v16215">Nenhuma cidade/endereço encontrado.</div>';p.classList.remove('hide');placePortal(el)}
    }catch(e){if(e.name!=='AbortError'&&seq===state.seq)close()}
  }
  document.addEventListener('input',e=>{
    const el=e.target;if(!isField(el))return;
    clearTimeout(state.timer);state.timer=setTimeout(()=>search(el),180);
  },true);
  document.addEventListener('focusin',e=>{
    const el=e.target;if(!isField(el))return;el.setAttribute('autocomplete','off');
    if(el.value.trim().length>=3){clearTimeout(state.timer);state.timer=setTimeout(()=>search(el),60)}
  },true);
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest?.('[data-mv-place-v16215]');if(b){choose(Number(b.dataset.mvPlaceV16215),e);return}
    if(!e.target.closest?.('#mvPlacesPortalV16215')&&!isField(e.target))close();
  },true);
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-mv-place-v16215]');if(b)choose(Number(b.dataset.mvPlaceV16215),e)},true);
  window.addEventListener('resize',()=>{if(state.el&&!portal().classList.contains('hide'))placePortal(state.el)});
  window.addEventListener('scroll',()=>{if(state.el&&!portal().classList.contains('hide'))placePortal(state.el)},{capture:true,passive:true});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.15 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.15 Google Places portal */
.mv-places-portal-v16215{position:fixed!important;z-index:2147483647!important;background:#fff!important;border:1px solid #d9e0ea!important;border-radius:12px!important;box-shadow:0 14px 38px rgba(13,34,67,.28)!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important}
.mv-places-portal-v16215 button{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:2px 8px!important;width:100%!important;padding:11px 12px!important;border:0!important;border-bottom:1px solid #edf0f5!important;border-radius:0!important;background:#fff!important;color:#102451!important;text-align:left!important;min-height:0!important;touch-action:manipulation!important}
.mv-places-portal-v16215 button b{font-size:13px!important;min-width:0!important;overflow-wrap:anywhere!important}.mv-places-portal-v16215 button em{font-size:9px!important;font-style:normal!important;background:#eef4ff!important;color:#173b80!important;border-radius:999px!important;padding:3px 6px!important;align-self:start!important}.mv-places-portal-v16215 button span{grid-column:1/-1!important;font-size:11px!important;color:#6d7684!important;overflow-wrap:anywhere!important}.mv-google-note-v16215,.mv-place-empty-v16215{padding:10px 12px!important;font-size:10px!important;color:#7b8491!important;background:#fafbfc!important}
`;
if(!s.includes('</style>'))throw new Error('v162.15 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.15: unified Google Places portal active for all route fields and stops');
