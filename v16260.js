const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
// v162.60 compatibility shim only. The former proxy-input implementation is intentionally
// disabled because it raced with v162.61 and could re-hide/reclassify the real route fields.
const js=`
// v162.60 neutralized: v162.61+ is the sole owner of Origem/Destino and route autocomplete.
(function(){
  ['mvOrigemNativeV16260','mvDestinoNativeV16260','mvNativePlacesV16260'].forEach(id=>document.getElementById(id)?.remove());
  ['origem','destino'].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    el.classList.remove('mv-legacy-route-input-v16260');
    el.removeAttribute('aria-hidden');el.disabled=false;el.readOnly=false;el.tabIndex=0;
  });
})();
`;
if(!s.includes('carga();'))throw new Error('v162.60 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.60: obsolete route proxy neutralized');
