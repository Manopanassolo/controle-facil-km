const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.60: clean native route fields, isolated from legacy gesture/autocomplete listeners.
(function(){
  const cfg=[
    {orig:'origem',proxy:'mvOrigemNativeV16260',label:'Origem'},
    {orig:'destino',proxy:'mvDestinoNativeV16260',label:'Destino'}
  ];
  let timer=0,active=null,items=[];
  function portal(){
    let p=document.getElementById('mvNativePlacesV16260');
    if(!p){p=document.createElement('div');p.id='mvNativePlacesV16260';p.className='hide';document.body.appendChild(p)}
    return p;
  }
  function positionPortal(input){const p=portal(),r=input.getBoundingClientRect();p.style.left=Math.max(8,r.left)+'px';p.style.top=Math.min(innerHeight-160,r.bottom+6)+'px';p.style.width=Math.min(r.width,innerWidth-16)+'px'}
  function closePortal(){const p=portal();p.classList.add('hide');p.innerHTML='';items=[]}
  function sync(proxy,orig){orig.value=proxy.value;['lat','lon','placeId'].forEach(k=>{if(proxy.dataset[k])orig.dataset[k]=proxy.dataset[k];else delete orig.dataset[k]})}
  function choose(i){const x=items[i],proxy=active;if(!x||!proxy)return;proxy.value=x.text||[x.mainText,x.secondaryText].filter(Boolean).join(', ');proxy.dataset.placeId=x.placeId||'';const orig=document.getElementById(proxy.dataset.mvOriginal);if(orig)sync(proxy,orig);closePortal();proxy.focus()}
  function render(arr,input){items=Array.isArray(arr)?arr:[];const p=portal();if(!items.length){closePortal();return}p.innerHTML=items.map((x,i)=>'<button type="button" data-mv-native-place="'+i+'"><b>'+String(x.mainText||x.text||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))+'</b><span>'+String(x.secondaryText||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))+'</span></button>').join('')+'<div class="mv-native-google-v16260">Resultados fornecidos pelo Google</div>';positionPortal(input);p.classList.remove('hide')}
  async function search(input){const q=input.value.trim();if(q.length<2){closePortal();return}try{const r=await fetch('/api/places?q='+encodeURIComponent(q),{cache:'no-store'});const j=await r.json().catch(()=>({items:[]}));if(active===input&&input.value.trim()===q)render(j.items||[],input)}catch(_){closePortal()}}
  function bindProxy(proxy,orig){
    proxy.addEventListener('input',()=>{sync(proxy,orig);active=proxy;clearTimeout(timer);timer=setTimeout(()=>search(proxy),250)});
    proxy.addEventListener('focus',()=>{active=proxy;if(proxy.value.trim().length>=2){clearTimeout(timer);timer=setTimeout(()=>search(proxy),120)}});
    proxy.addEventListener('blur',()=>{sync(proxy,orig);setTimeout(()=>{if(document.activeElement!==proxy)closePortal()},180)});
  }
  function install(){
    cfg.forEach(c=>{
      const orig=document.getElementById(c.orig);if(!orig||document.getElementById(c.proxy))return;
      const proxy=document.createElement('input');proxy.id=c.proxy;proxy.className='mv-native-route-input-v16260';proxy.type='text';proxy.inputMode='text';proxy.autocomplete='off';proxy.autocorrect='off';proxy.spellcheck=false;proxy.placeholder='Digite nome, cidade ou endereço';proxy.setAttribute('aria-label',c.label);proxy.dataset.mvOriginal=c.orig;proxy.value=orig.value||'';
      ['lat','lon','placeId'].forEach(k=>{if(orig.dataset[k])proxy.dataset[k]=orig.dataset[k]});
      orig.insertAdjacentElement('beforebegin',proxy);orig.classList.add('mv-legacy-route-input-v16260');orig.setAttribute('aria-hidden','true');orig.tabIndex=-1;
      bindProxy(proxy,orig);
    });
  }
  document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('#mvNativePlacesV16260 button[data-mv-native-place]');if(!b)return;e.preventDefault();choose(Number(b.dataset.mvNativePlace))},true);
  document.addEventListener('click',e=>{const b=e.target.closest?.('#mvNativePlacesV16260 button[data-mv-native-place]');if(!b)return;e.preventDefault();choose(Number(b.dataset.mvNativePlace))},true);
  document.addEventListener('scroll',()=>{if(active&&document.activeElement===active)positionPortal(active)},true);
  document.addEventListener('resize',()=>{if(active&&document.activeElement===active)positionPortal(active)});
  install();[150,500,1200,2500].forEach(ms=>setTimeout(install,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.60 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.60 clean native route inputs */
#p-viagem .mv-legacy-route-input-v16260{display:none!important}
#p-viagem .mv-native-route-input-v16260{display:block!important;width:100%!important;min-height:58px!important;height:58px!important;box-sizing:border-box!important;border:1px solid #ccd5e2!important;border-radius:8px!important;background:#fff!important;padding:0 16px!important;font-size:16px!important;line-height:1.2!important;color:#172033!important;caret-color:#172033!important;pointer-events:auto!important;touch-action:auto!important;user-select:text!important;-webkit-user-select:text!important;position:relative!important;z-index:80!important;outline:0!important;box-shadow:none!important}
#p-viagem .mv-native-route-input-v16260:focus{border-color:#3378ed!important;box-shadow:0 0 0 2px rgba(51,120,237,.16)!important}
#mvNativePlacesV16260{position:fixed!important;z-index:2147483640!important;max-height:min(340px,40vh)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;background:#fff!important;border:1px solid #d7dee8!important;border-radius:12px!important;box-shadow:0 10px 28px rgba(15,23,42,.18)!important;padding:4px 8px!important}
#mvNativePlacesV16260.hide{display:none!important}
#mvNativePlacesV16260 button{display:grid!important;grid-template-columns:minmax(0,1fr) 28px!important;gap:4px 10px!important;align-items:center!important;width:100%!important;min-height:66px!important;background:#fff!important;color:#172033!important;border:0!important;border-bottom:1px solid #eef1f5!important;border-radius:0!important;padding:11px 10px!important;text-align:left!important;touch-action:manipulation!important;box-shadow:none!important}
#mvNativePlacesV16260 button:after{content:'⌖';grid-column:2;grid-row:1 / span 2;justify-self:center;font-size:22px;color:#596779}
#mvNativePlacesV16260 button b{grid-column:1;font-size:15px!important;line-height:19px!important;color:#172033!important;font-weight:750!important}
#mvNativePlacesV16260 button span{grid-column:1;font-size:12px!important;line-height:16px!important;color:#667085!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#mvNativePlacesV16260 .mv-native-google-v16260{padding:8px 10px!important;background:#fff!important;color:#8a94a3!important;text-align:right!important;font-size:11px!important}
`;
if(!s.includes('</style>'))throw new Error('v162.60 css anchor not found');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.60: clean native route fields and isolated white autocomplete installed');
