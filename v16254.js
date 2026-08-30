const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.54: keep only the white authoritative autocomplete on Origem/Destino.
(function(){
  const legacySelectors=['#mvPlacesV16217','#mvPlacesPortalV16215','#mvStopPlacesV16216','.geo-suggestions-v125'];
  function purgeLegacy(){
    legacySelectors.forEach(sel=>document.querySelectorAll(sel).forEach(el=>{
      el.classList.add('hide');
      el.style.setProperty('display','none','important');
      el.setAttribute('aria-hidden','true');
    }));
  }
  document.addEventListener('focusin',e=>{if(e.target?.matches?.('#origem,#destino'))purgeLegacy()},true);
  document.addEventListener('input',e=>{if(e.target?.matches?.('#origem,#destino'))purgeLegacy()},true);
  const mo=new MutationObserver(purgeLegacy);
  mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  setTimeout(purgeLegacy,0);setTimeout(purgeLegacy,300);setTimeout(purgeLegacy,1000);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.54 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.54 single autocomplete authority: white v162.48 only */
#mvPlacesV16217,#mvPlacesPortalV16215,#mvStopPlacesV16216,.geo-suggestions-v125{display:none!important;visibility:hidden!important;pointer-events:none!important}
`;
if(!s.includes('</style>'))throw new Error('v162.54 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.54: duplicate legacy autocomplete removed');
