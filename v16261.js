const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.61: rebuild Origem/Destino as fresh native inputs only. Autocomplete authority is v162.63.
(function(){
  const ids=new Set(['origem','destino']);
  function oldPortalOff(){
    ['mvPlacesV16248','mvNativePlacesV16260','mvRouteChoicesV16261'].forEach(id=>{const p=document.getElementById(id);if(p){p.classList.add('hide');p.style.setProperty('display','none','important');p.style.setProperty('visibility','hidden','important');p.style.setProperty('pointer-events','none','important')}})
  }
  function rebuild(id){
    const old=document.getElementById(id);if(!old)return null;
    const v60=document.getElementById(id==='origem'?'mvOrigemNativeV16260':'mvDestinoNativeV16260');
    const value=(v60?.value||old.value||'');
    if(v60)v60.remove();
    if(old.dataset.mvCleanV16261==='1'){
      old.disabled=false;old.readOnly=false;old.classList.remove('mv-legacy-route-input-v16260');old.removeAttribute('aria-hidden');old.style.removeProperty('display');old.style.removeProperty('visibility');old.style.removeProperty('opacity');old.tabIndex=0;old.inputMode='text';old.autocomplete='off';return old;
    }
    const fresh=old.cloneNode(false);
    fresh.id=id;fresh.value=value;fresh.type='text';fresh.disabled=false;fresh.readOnly=false;fresh.removeAttribute('disabled');fresh.removeAttribute('readonly');fresh.removeAttribute('aria-hidden');fresh.tabIndex=0;fresh.inputMode='text';fresh.autocomplete='off';fresh.setAttribute('autocorrect','off');fresh.spellcheck=false;fresh.dataset.mvCleanV16261='1';
    fresh.classList.remove('mv-legacy-route-input-v16260');
    ['lat','lon','placeId'].forEach(k=>{const val=v60?.dataset?.[k]||old.dataset?.[k];if(val)fresh.dataset[k]=val});
    old.replaceWith(fresh);return fresh;
  }
  function install(){oldPortalOff();ids.forEach(rebuild)}
  install();[120,500,1200,2500].forEach(ms=>setTimeout(install,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.61 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.61 fresh native route inputs; v162.63 owns autocomplete */
body #p-viagem #origem,body #p-viagem #destino{display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;min-height:58px!important;height:58px!important;box-sizing:border-box!important;border:1px solid #ccd5e2!important;border-radius:8px!important;background:#fff!important;padding:0 16px!important;font-size:16px!important;line-height:1.2!important;color:#172033!important;caret-color:#172033!important;pointer-events:auto!important;touch-action:auto!important;user-select:text!important;-webkit-user-select:text!important;position:relative!important;z-index:90!important;outline:0!important;box-shadow:none!important}
body #p-viagem #origem:focus,body #p-viagem #destino:focus{border-color:#3378ed!important;box-shadow:0 0 0 2px rgba(51,120,237,.16)!important}
#mvOrigemNativeV16260,#mvDestinoNativeV16260,#mvNativePlacesV16260,#mvPlacesV16248,#mvRouteChoicesV16261{display:none!important;visibility:hidden!important;pointer-events:none!important}
`;
if(!s.includes('</style>'))throw new Error('v162.61 css anchor not found');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.61: fresh native route inputs ready for v162.63 autocomplete');
