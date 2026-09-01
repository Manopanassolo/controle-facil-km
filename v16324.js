const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const bad="opacity:selected?.98:.55";
if(s.includes(bad))s=s.replaceAll(bad,"opacity:selected?0.98:0.55");
// Keep the completion screen authoritative even if older history rendering runs after navigation.
const js=`
(function(){
  function syncCompleted(){
    if(document.body.dataset.mvTripState!=='completed')return;
    setTimeout(()=>{try{globalThis.mvNavigationV16282?.navigate?.('historico')}catch(_){};try{globalThis.mvTripFlowV16352?.sync?.()}catch(_){}},80);
  }
  document.addEventListener('click',e=>{if(e.target?.closest?.('#btFinalizar'))setTimeout(syncCompleted,350)},true);
  addEventListener('pageshow',syncCompleted,true);
  document.documentElement.dataset.mvSegmentedRoutes='163.52';
})();
`;
if(!s.includes('carga();'))throw new Error('v163.52.1 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.52.1 segmented-route rendering syntax repaired');
