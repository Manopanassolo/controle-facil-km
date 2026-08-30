const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.55: approved mobile route proportions + single white autocomplete + reliable tap selection.
(function(){
  const routeFields=new Set(['origem','destino']);
  const keepId='mvPlacesV16248';
  let active=null;
  function isRouteField(el){return !!(el&&el.tagName==='INPUT'&&routeFields.has(el.id)&&el.closest('#p-viagem'))}
  function suppressLegacy(root=document){
    const nodes=[...root.querySelectorAll?.('[id],[class],[role="listbox"]')||[]];
    nodes.forEach(el=>{
      if(el.id===keepId||el.closest?.('#'+keepId)||el.contains?.(document.getElementById(keepId)))return;
      const sig=((el.id||'')+' '+(typeof el.className==='string'?el.className:'')+' '+(el.getAttribute?.('role')||'')).toLowerCase();
      if(/place|suggest|autocomplete|geo|pac-container|listbox/.test(sig)){
        if(el.closest?.('#p-viagem')||el.parentElement===document.body||el.getAttribute?.('role')==='listbox'){
          el.dataset.mvLegacyAutocomplete='1';
          el.style.setProperty('display','none','important');
          el.style.setProperty('visibility','hidden','important');
          el.style.setProperty('pointer-events','none','important');
        }
      }
    });
  }
  function activate(el){
    active=el;document.body.classList.add('mv-route-autocomplete-v16255');
    document.body.dataset.mvRouteField=el.id;
    suppressLegacy();
  }
  function deactivate(){
    active=null;document.body.classList.remove('mv-route-autocomplete-v16255');delete document.body.dataset.mvRouteField;
  }
  function polishPortal(){
    const p=document.getElementById(keepId);if(!p)return;
    p.querySelectorAll('button').forEach(b=>{
      if(b.dataset.mvTapBound==='1')return;b.dataset.mvTapBound='1';
      const choose=ev=>{
        ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation?.();
        const idx=Number(b.dataset.mvPlaceV16248);
        if(typeof idx==='number'&&!Number.isNaN(idx)){
          b.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
        }
      };
      b.addEventListener('touchend',choose,{capture:true,passive:false});
    });
  }
  function labelRoute(){
    const o=document.getElementById('directOriginBodyV127'),d=document.getElementById('directDestBodyV127');
    if(o){const sm=o.querySelector(':scope>small');if(sm)sm.textContent='Origem'}
    if(d){const sm=d.querySelector(':scope>small');if(sm)sm.textContent='Destino'}
    const stop=document.querySelector('#directRouteStackV127 .route-point-v126.stops');
    if(stop)stop.classList.add('mv-approved-stop-v16255');
  }
  document.addEventListener('focusin',e=>{if(isRouteField(e.target)){activate(e.target);setTimeout(()=>{suppressLegacy();polishPortal();labelRoute()},0)}},true);
  document.addEventListener('input',e=>{if(isRouteField(e.target)){activate(e.target);setTimeout(()=>{suppressLegacy();polishPortal()},140)}},true);
  document.addEventListener('pointerdown',e=>{if(e.target.closest?.('#'+keepId))return;if(!isRouteField(e.target))deactivate()},true);
  const mo=new MutationObserver(()=>{if(active){suppressLegacy();polishPortal();labelRoute()}});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  [0,250,900,1800].forEach(ms=>setTimeout(()=>{suppressLegacy();labelRoute()},ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.55 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.55 approved route visual/proportions */
#p-viagem #novaViagem{max-width:820px!important;margin:0 auto!important;background:#fff!important}
#directRouteStackV127{position:relative!important;margin:16px 0 12px!important;padding:0 0 0 4px!important}
#directRouteStackV127:before{content:"";position:absolute;left:27px;top:34px;bottom:34px;width:3px;background:#e3e8f1;border-radius:99px;z-index:0}
#directRouteStackV127 .route-point-v126{position:relative!important;display:grid!important;grid-template-columns:56px minmax(0,1fr)!important;gap:14px!important;padding:8px 0!important;align-items:start!important;z-index:1!important}
#directRouteStackV127 .route-marker-v126{width:46px!important;height:46px!important;min-width:46px!important;border-radius:50%!important;display:grid!important;place-items:center!important;font-size:16px!important;font-weight:800!important;color:#fff!important;background:#113c83!important;border:0!important;box-shadow:0 0 0 5px #fff!important;margin:0!important}
#directRouteStackV127 .route-point-v126.destination .route-marker-v126{background:#ef2222!important}
#directRouteStackV127 .route-point-v126.stops .route-marker-v126{width:44px!important;height:44px!important;min-width:44px!important;background:#f1f5fb!important;color:#11418d!important;font-size:30px!important;font-weight:300!important;box-shadow:0 0 0 5px #fff!important}
#directRouteStackV127 .route-point-body-v126{min-width:0!important;padding:0!important;background:transparent!important;border:0!important}
#directRouteStackV127 .route-point-body-v126>small{display:block!important;margin:0 0 8px!important;font-size:14px!important;line-height:18px!important;text-transform:none!important;letter-spacing:0!important;font-weight:700!important;color:#19478d!important}
#directRouteStackV127 .route-point-v126.destination .route-point-body-v126>small{color:#ef2222!important}
#directRouteStackV127 #origem,#directRouteStackV127 #destino{height:58px!important;min-height:58px!important;border:1px solid #ccd5e2!important;border-radius:8px!important;background:#fff!important;padding:0 18px!important;font-size:17px!important;box-shadow:none!important;color:#172033!important}
#directRouteStackV127 #origem:focus,#directRouteStackV127 #destino:focus{border-color:#3378ed!important;box-shadow:0 0 0 2px rgba(51,120,237,.16)!important;outline:0!important}
#directRouteStackV127 .route-gps-v127{margin-top:8px!important;border-radius:7px!important;background:#fff!important;border:1px solid #d9e0ea!important;color:#344054!important}
#directRouteStackV127 .mv-approved-stop-v16255 .route-point-body-v126>small{display:none!important}
#directRouteStackV127 .mv-approved-stop-v16255 .pre-stop-entry-v127{display:none!important}
#directRouteStackV127 .mv-approved-stop-v16255 #preTripStopsListV127{margin-top:4px!important}
#directRouteStackV127 .mv-approved-stop-v16255{min-height:58px!important;cursor:pointer!important}
#directRouteStackV127 .mv-approved-stop-v16255:after{content:"Adicionar parada";align-self:center;grid-column:2;color:#5f6b7a;font-size:13px;margin-top:12px}
#mvPlacesV16248{background:#fff!important;border:1px solid #d7dee8!important;border-radius:14px!important;box-shadow:0 10px 28px rgba(15,23,42,.16)!important;padding:4px 8px!important;overflow-y:auto!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;max-height:min(350px,42vh)!important}
#mvPlacesV16248 button{display:grid!important;grid-template-columns:minmax(0,1fr) 28px!important;gap:4px 10px!important;align-items:center!important;width:100%!important;background:#fff!important;color:#172033!important;border:0!important;border-bottom:1px solid #eef1f5!important;border-radius:0!important;padding:12px 10px!important;min-height:64px!important;text-align:left!important;touch-action:manipulation!important}
#mvPlacesV16248 button:after{content:"⌖";grid-column:2;grid-row:1 / span 2;justify-self:center;align-self:center;font-size:22px;color:#596779}
#mvPlacesV16248 button b{grid-column:1!important;font-size:15px!important;line-height:19px!important;color:#172033!important;font-weight:750!important}
#mvPlacesV16248 button span{grid-column:1!important;margin:0!important;font-size:12px!important;line-height:16px!important;color:#667085!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#mvPlacesV16248 .mv-google-v16248{padding:8px 10px!important;background:#fff!important;color:#8a94a3!important;text-align:right!important}
body.mv-route-autocomplete-v16255 [data-mv-legacy-autocomplete="1"]{display:none!important;visibility:hidden!important;pointer-events:none!important}
@media(max-width:700px){
 #p-viagem #novaViagem{padding:12px 14px 22px!important;border-radius:0!important;border-left:0!important;border-right:0!important}
 #p-viagem #novaViagem>.r{gap:10px!important}
 #p-viagem #dataViagem,#p-viagem #motivo,#p-viagem #tipoUso{min-height:56px!important;height:56px!important;font-size:16px!important;border-radius:7px!important}
 #directRouteStackV127{margin-top:18px!important}
 #directRouteStackV127 .route-point-v126{grid-template-columns:50px minmax(0,1fr)!important;gap:12px!important;padding:7px 0!important}
 #directRouteStackV127:before{left:23px!important}
 #directRouteStackV127 .route-marker-v126{width:42px!important;height:42px!important;min-width:42px!important;font-size:15px!important}
 #directRouteStackV127 .route-point-v126.stops .route-marker-v126{width:40px!important;height:40px!important;min-width:40px!important;font-size:27px!important}
 #directRouteStackV127 #origem,#directRouteStackV127 #destino{min-height:58px!important;height:58px!important;font-size:16px!important;padding:0 16px!important}
 #mvPlacesV16248{border-radius:12px!important;max-height:min(340px,40vh)!important}
 #mvPlacesV16248 button{min-height:66px!important;padding:11px 10px!important}
 #mvPlacesV16248 button b{font-size:15px!important}#mvPlacesV16248 button span{font-size:12px!important}
}
`;
if(!s.includes('</style>'))throw new Error('v162.55 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.55: approved route proportions and white autocomplete installed');
