const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.48: authoritative trip address autocomplete + clean return from notifications.
(function(){
  const fieldIds=new Set(['origem','destino']);
  let timer=0,seq=0,ctl=null,current=null,items=[];
  const escHtml=v=>String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  function isTripAddress(el){return !!(el&&el.tagName==='INPUT'&&fieldIds.has(el.id)&&el.closest('#p-viagem'))}
  function portal(){
    let p=document.getElementById('mvPlacesV16248');
    if(!p){p=document.createElement('div');p.id='mvPlacesV16248';p.className='mv-places-v16248 hide';document.body.appendChild(p)}
    return p;
  }
  function close(){
    seq++;try{ctl?.abort()}catch{}ctl=null;current=null;items=[];
    const p=document.getElementById('mvPlacesV16248');if(p){p.classList.add('hide');p.innerHTML=''}
  }
  function position(el){
    const p=portal(),r=el.getBoundingClientRect(),pad=8;
    const vv=window.visualViewport, vw=vv?.width||window.innerWidth, vh=vv?.height||window.innerHeight;
    const left=Math.max(pad,r.left),right=Math.min(vw-pad,r.right);
    p.style.left=left+'px';p.style.width=Math.max(240,right-left)+'px';
    const below=vh-r.bottom;
    if(below>=190){p.style.top=(r.bottom+4)+'px';p.style.bottom='auto';p.style.maxHeight=Math.min(300,below-10)+'px'}
    else{p.style.top='auto';p.style.bottom=Math.max(8,vh-r.top+4)+'px';p.style.maxHeight=Math.min(300,Math.max(120,r.top-10))+'px'}
  }
  function label(x){return x.mainText||x.text||''}
  function render(el,data){
    current=el;items=data;const p=portal();
    p.innerHTML=data.map((x,i)=>'<button type="button" data-mv-place-v16248="'+i+'"><b>'+escHtml(x.mainText||x.text||'Local')+'</b><span>'+escHtml(x.secondaryText||x.text||'')+'</span></button>').join('')+'<div class="mv-google-v16248">Resultados fornecidos pelo Google</div>';
    p.classList.remove('hide');position(el);
    document.querySelectorAll('#mvPlacesV16217,#mvPlacesPortalV16215,#mvStopPlacesV16216,.geo-suggestions-v125').forEach(x=>x.classList.add('hide'));
  }
  async function search(el){
    if(!isTripAddress(el))return;
    const q=el.value.trim();
    if(q.length<3){close();return}
    try{ctl?.abort()}catch{}
    ctl=new AbortController();const mine=++seq;current=el;
    try{
      const r=await fetch('/api/places?q='+encodeURIComponent(q),{signal:ctl.signal,cache:'no-store',headers:{Accept:'application/json'}});
      const j=await r.json().catch(()=>({}));
      if(ctl.signal.aborted||mine!==seq)return;
      if(!r.ok)throw new Error(j.error||'places');
      const a=Array.isArray(j.items)?j.items:[];
      if(a.length)render(el,a);else{
        const p=portal();current=el;items=[];p.innerHTML='<div class="mv-empty-v16248">Nenhum endereço encontrado.</div>';p.classList.remove('hide');position(el);
      }
    }catch(e){if(e.name!=='AbortError'&&mine===seq){const p=portal();p.innerHTML='<div class="mv-empty-v16248">Não foi possível buscar endereços agora.</div>';p.classList.remove('hide');position(el)}}
  }
  function prepare(el){
    if(!isTripAddress(el))return;
    el.removeAttribute('list');el.setAttribute('autocomplete','off');el.setAttribute('autocorrect','off');el.setAttribute('spellcheck','false');
  }
  function choose(i,e){
    if(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.()}
    const el=current,x=items[i];if(!el||!x)return;
    const v=label(x);el.value=v;el.dataset.placeId=x.placeId||'';el.dataset.mvPlaceChosen='1';el.dataset.mvPlaceChosenValue=v;
    close();el.dispatchEvent(new Event('change',{bubbles:true}));el.focus({preventScroll:true});
  }
  document.addEventListener('focusin',e=>{const el=e.target;if(!isTripAddress(el))return;prepare(el);if(el.value.trim().length>=3){clearTimeout(timer);timer=setTimeout(()=>search(el),70)}},true);
  document.addEventListener('input',e=>{const el=e.target;if(!isTripAddress(el))return;prepare(el);delete el.dataset.mvPlaceChosen;delete el.dataset.mvPlaceChosenValue;clearTimeout(timer);timer=setTimeout(()=>search(el),120)},true);
  document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('[data-mv-place-v16248]');if(b){choose(Number(b.dataset.mvPlaceV16248),e);return}if(!e.target.closest?.('#mvPlacesV16248')&&!isTripAddress(e.target))close()},true);
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-mv-place-v16248]');if(b)choose(Number(b.dataset.mvPlaceV16248),e)},true);
  window.addEventListener('scroll',()=>{if(current&&!portal().classList.contains('hide'))position(current)},{capture:true,passive:true});
  window.visualViewport?.addEventListener('resize',()=>{if(current&&!portal().classList.contains('hide'))position(current)});

  // Returning from notifications always lands at the top of Home instead of the previous Home viewport.
  let fromNotices=false;
  document.addEventListener('pointerdown',e=>{if(e.target.closest?.('#topBell,[data-page="notificacoes"],[data-p="notificacoes"]'))fromNotices=true},true);
  document.addEventListener('click',e=>{
    const home=e.target.closest?.('[data-page="inicio"],[data-p="inicio"],[data-p-jump="inicio"]');
    if(home&&fromNotices){fromNotices=false;[0,60,180].forEach(ms=>setTimeout(()=>{document.scrollingElement.scrollTop=0;window.scrollTo(0,0)},ms))}
  },true);
  const baseShow=typeof globalThis.show==='function'?globalThis.show:null;
  if(baseShow){
    let last='';
    globalThis.show=function(page){
      const prev=last;last=page;
      const r=baseShow.apply(this,arguments);
      if(page==='notificacoes')fromNotices=true;
      if(page==='inicio'&&(prev==='notificacoes'||fromNotices)){fromNotices=false;[0,60,180].forEach(ms=>setTimeout(()=>{document.scrollingElement.scrollTop=0;window.scrollTo(0,0)},ms))}
      return r;
    };
  }

  const q=new URLSearchParams(location.search);
  if(q.get('mv_places_test')==='1')setTimeout(async()=>{
    document.getElementById('auth')?.classList.add('hide');document.getElementById('app')?.classList.remove('hide');
    globalThis.mvTripLockArm?.();try{globalThis.show?.('viagem')}catch(_){}
    const el=document.getElementById('destino');if(!el){document.documentElement.dataset.mvPlacesTest='fail';return}
    prepare(el);el.value='Avenida Paulista';el.dispatchEvent(new Event('input',{bubbles:true}));
    setTimeout(()=>{const p=portal();document.documentElement.dataset.mvPlacesTest=(!p.classList.contains('hide')&&p.querySelector('button'))?'pass':'fail'},1400);
  },600);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.48 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.48 authoritative trip address autocomplete */
.mv-places-v16248{position:fixed!important;z-index:2147483647!important;background:#fff!important;border:1px solid #dbe2ec!important;border-radius:14px!important;box-shadow:0 12px 30px rgba(7,20,40,.20)!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important;padding:4px!important}
.mv-places-v16248 button{display:block!important;width:100%!important;padding:11px 12px!important;margin:0!important;border:0!important;border-bottom:1px solid #edf1f5!important;border-radius:10px!important;background:#fff!important;color:#071428!important;text-align:left!important;min-height:0!important;touch-action:manipulation!important}
.mv-places-v16248 button b{display:block!important;font-size:13px!important}.mv-places-v16248 button span{display:block!important;margin-top:3px!important;font-size:11px!important;color:#667085!important}.mv-google-v16248,.mv-empty-v16248{padding:9px 11px!important;font-size:10px!important;color:#7b8491!important;background:#fafbfc!important}
body.mv-trip-active-v16247 #mvPlacesV16248{display:block!important}
body.mv-trip-active-v16247 #mvPlacesV16248.hide{display:none!important}
`;
if(!s.includes('</style>'))throw new Error('v162.48 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.48: address autocomplete restored and Home reset after notifications');
