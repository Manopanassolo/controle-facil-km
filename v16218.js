const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.18: keep only one visible Google Places list and make it compact/light.
(function(){
  function hideLegacyPlaces(){
    document.querySelectorAll('#mvPlacesPortalV16215,#mvStopPlacesV16216,.geo-suggestions-v125').forEach(x=>{
      x.classList.add('hide');
      x.style.setProperty('display','none','important');
      x.setAttribute('aria-hidden','true');
    });
  }
  hideLegacyPlaces();
  const obs=new MutationObserver(()=>hideLegacyPlaces());
  obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
  document.addEventListener('input',e=>{if(e.target?.matches?.('input'))hideLegacyPlaces()},true);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.18 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.18 clean Places UI */
#mvPlacesPortalV16215,#mvStopPlacesV16216,.geo-suggestions-v125{display:none!important}
body #mvPlacesV16217{background:#fff!important;border:1px solid #dfe5ee!important;border-radius:14px!important;box-shadow:0 10px 26px rgba(7,20,40,.16)!important;max-height:270px!important;padding:4px!important}
body #mvPlacesV16217 button{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:2px 8px!important;width:100%!important;padding:10px 11px!important;margin:0!important;border:0!important;border-bottom:1px solid #edf1f5!important;border-radius:10px!important;background:#fff!important;color:#071428!important;text-align:left!important;min-height:0!important;box-shadow:none!important}
body #mvPlacesV16217 button:last-of-type{border-bottom:0!important}
body #mvPlacesV16217 button:active,body #mvPlacesV16217 button:focus{background:#f3f7fb!important;outline:2px solid #ccff00!important;outline-offset:-2px!important}
body #mvPlacesV16217 button b{font-size:14px!important;line-height:1.2!important;color:#071428!important;font-weight:800!important}
body #mvPlacesV16217 button em{font-size:9px!important;line-height:1!important;font-style:normal!important;background:#eef2f6!important;color:#334155!important;border-radius:999px!important;padding:5px 7px!important;white-space:nowrap!important}
body #mvPlacesV16217 button span{grid-column:1/-1!important;font-size:11px!important;line-height:1.3!important;color:#667085!important;margin:1px 0 0!important}
body #mvPlacesV16217 .mv-google-v16217,body #mvPlacesV16217 .mv-empty-v16217{padding:8px 10px!important;font-size:9px!important;color:#7b8491!important;background:#fafbfc!important;border-radius:0 0 10px 10px!important}
@media(max-width:700px){body #mvPlacesV16217{max-height:250px!important}body #mvPlacesV16217 button{padding:9px 10px!important}body #mvPlacesV16217 button b{font-size:13px!important}body #mvPlacesV16217 button span{font-size:10.5px!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.18 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.18: single compact light Google Places suggestion list');
