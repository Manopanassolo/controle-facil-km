const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.16: hard-bind Google Places to route stop inputs, including dynamically rendered fields.
(function(){
  let timer=null,ctl=null,seq=0,current=null,items=[];
  function stopField(el){
    if(!el||el.tagName!=='INPUT')return false;
    if(['preTripStopNameV127','stopNameV124','paradaNome'].includes(el.id))return true;
    if(el.closest?.('.pre-stop-entry-v127,.route-point-v126.stops,.inline-stops-v125'))return true;
    const t=((el.placeholder||'')+' '+(el.name||'')).toLowerCase();
    return /parada|cidade, endere[cç]o ou local|local da parada/.test(t);
  }
  function portal(){let p=document.getElementById('mvStopPlacesV16216');if(!p){p=document.createElement('div');p.id='mvStopPlacesV16216';p.className='mv-stop-places-v16216 hide';document.body.appendChild(p)}return p}
  function close(){seq++;try{ctl?.abort()}catch{}ctl=null;current=null;items=[];const p=document.getElementById('mvStopPlacesV16216');if(p){p.classList.add('hide');p.innerHTML=''}}
  function pos(el){const p=portal(),r=el.getBoundingClientRect(),pad=8;p.style.left=Math.max(pad,r.left)+'px';p.style.width=Math.max(220,Math.min(window.innerWidth-pad,r.right)-Math.max(pad,r.left))+'px';const below=window.innerHeight-r.bottom;if(below>180){p.style.top=(r.bottom+4)+'px';p.style.bottom='auto';p.style.maxHeight=Math.min(300,below-10)+'px'}else{p.style.top='auto';p.style.bottom=(window.innerHeight-r.top+4)+'px';p.style.maxHeight=Math.min(300,r.top-10)+'px'}}
  function label(x){return typeof googlePlaceLabelV130==='function'?googlePlaceLabelV130(x):(x.mainText||x.text||'')}
  function kind(x){return typeof googlePlaceKindV130==='function'?googlePlaceKindV130(x):'Local'}
  function render(el,data){current=el;items=data;const p=portal();p.innerHTML=data.map((x,i)=>'<button type="button" data-stop-place-v16216="'+i+'"><b>'+esc(x.mainText||x.text||'Local')+'</b><em>'+esc(kind(x))+'</em><span>'+esc(x.secondaryText||x.text||'')+'</span></button>').join('')+'<div class="mv-stop-note-v16216">Resultados fornecidos pelo Google</div>';p.classList.remove('hide');pos(el)}
  async function search(el){if(!stopField(el))return;const q=el.value.trim();if(q.length<3){close();return}try{ctl?.abort()}catch{}ctl=new AbortController();const my=++seq;current=el;try{const r=await fetch('/api/places?q='+encodeURIComponent(q),{signal:ctl.signal,cache:'no-store',headers:{Accept:'application/json'}}),j=await r.json().catch(()=>({}));if(ctl.signal.aborted||my!==seq)return;if(!r.ok)throw Error(j.error||'places');const a=Array.isArray(j.items)?j.items:[];if(a.length)render(el,a);else{const p=portal();current=el;items=[];p.innerHTML='<div class="mv-stop-empty-v16216">Nenhuma cidade/endereço encontrado.</div>';p.classList.remove('hide');pos(el)}}catch(e){if(e.name!=='AbortError'&&my===seq)close()}}
  function choose(i,e){if(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.()}const el=current,x=items[i];if(!el||!x)return;const v=label(x);el.value=v;el.dataset.placeId=x.placeId||'';el.dataset.placeKind=kind(x);el.dataset.mvPlaceChosen='1';el.dataset.mvPlaceChosenValue=v;close();el.dispatchEvent(new Event('change',{bubbles:true}));}
  document.addEventListener('input',e=>{const el=e.target;if(!stopField(el))return;el.setAttribute('autocomplete','off');clearTimeout(timer);timer=setTimeout(()=>search(el),120)},true);
  document.addEventListener('focusin',e=>{const el=e.target;if(!stopField(el))return;el.setAttribute('autocomplete','off');if(el.value.trim().length>=3){clearTimeout(timer);timer=setTimeout(()=>search(el),40)}},true);
  document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('[data-stop-place-v16216]');if(b){choose(Number(b.dataset.stopPlaceV16216),e);return}if(!e.target.closest?.('#mvStopPlacesV16216')&&!stopField(e.target))close()},true);
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-stop-place-v16216]');if(b)choose(Number(b.dataset.stopPlaceV16216),e)},true);
  window.addEventListener('scroll',()=>{if(current&&!portal().classList.contains('hide'))pos(current)},{capture:true,passive:true});
  window.addEventListener('resize',()=>{if(current&&!portal().classList.contains('hide'))pos(current)});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.16 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.16 stop autocomplete portal */
.mv-stop-places-v16216{position:fixed!important;z-index:2147483647!important;background:#fff!important;border:1px solid #d9e0ea!important;border-radius:12px!important;box-shadow:0 14px 38px rgba(13,34,67,.28)!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important}
.mv-stop-places-v16216 button{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:2px 8px!important;width:100%!important;padding:11px 12px!important;border:0!important;border-bottom:1px solid #edf0f5!important;border-radius:0!important;background:#fff!important;color:#102451!important;text-align:left!important;min-height:0!important;touch-action:manipulation!important}
.mv-stop-places-v16216 button b{font-size:13px!important}.mv-stop-places-v16216 button em{font-size:9px!important;font-style:normal!important;background:#eef4ff!important;color:#173b80!important;border-radius:999px!important;padding:3px 6px!important}.mv-stop-places-v16216 button span{grid-column:1/-1!important;font-size:11px!important;color:#6d7684!important}.mv-stop-note-v16216,.mv-stop-empty-v16216{padding:10px 12px!important;font-size:10px!important;color:#7b8491!important;background:#fafbfc!important}
`;
if(!s.includes('</style>'))throw new Error('v162.16 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.16: route stop autocomplete hard-bound');
