const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.56: final mobile autocomplete authority.
(function(){
  function portal(){return document.getElementById('mvPlacesV16248')}
  function routeField(){return document.activeElement?.matches?.('#origem,#destino')?document.activeElement:null}
  function normalize(){
    const p=portal();if(!p)return;
    p.querySelectorAll('button').forEach(b=>{
      b.style.setProperty('background','#fff','important');
      b.style.setProperty('color','#172033','important');
    });
    const d=document.querySelector('#directRouteStackV127 .route-point-v126.destination .route-marker-v126');
    if(d){d.style.setProperty('background','#ef2222','important');d.style.setProperty('color','#fff','important')}
  }
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest?.('#mvPlacesV16248 button[data-mv-place-v16248]');
    if(!b)return;
    // Let the authoritative v162.48 document handler perform the actual choose.
    // Only prevent focus/scroll side effects here.
    e.preventDefault();
  },false);
  document.addEventListener('touchstart',e=>{
    const b=e.target.closest?.('#mvPlacesV16248 button[data-mv-place-v16248]');
    if(!b)return;
    b.style.setProperty('background','#f7f9fc','important');
  },{passive:true});
  document.addEventListener('touchend',e=>{
    const b=e.target.closest?.('#mvPlacesV16248 button[data-mv-place-v16248]');
    if(!b)return;
    b.style.setProperty('background','#fff','important');
    // Fallback click for browsers that skip pointerdown selection after keyboard interaction.
    setTimeout(()=>{if(portal()&&!portal().classList.contains('hide'))b.click()},0);
  },{passive:true});
  const mo=new MutationObserver(normalize);mo.observe(document.documentElement,{childList:true,subtree:true});
  [0,150,500,1200].forEach(ms=>setTimeout(normalize,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.56 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.56 hard override over global blue button theme */
body #app #mvPlacesV16248,
body #mvPlacesV16248{background:#fff!important;color:#172033!important;border:1px solid #d7dee8!important}
body #app #mvPlacesV16248 button,
body #mvPlacesV16248 button,
body #app #mvPlacesV16248 button:not(.sec):not(.danger){background:#fff!important;color:#172033!important;border:0!important;border-bottom:1px solid #eef1f5!important;box-shadow:none!important}
body #app #mvPlacesV16248 button b,
body #mvPlacesV16248 button b{color:#172033!important}
body #app #mvPlacesV16248 button span,
body #mvPlacesV16248 button span{color:#667085!important}
body #app #mvPlacesV16248 .mv-google-v16248,
body #mvPlacesV16248 .mv-google-v16248{background:#fff!important;color:#8a94a3!important}
body #app #directRouteStackV127 .route-point-v126.destination .route-marker-v126,
body #directRouteStackV127 .route-point-v126.destination .route-marker-v126{background:#ef2222!important;color:#fff!important}
`;
if(!s.includes('</style>'))throw new Error('v162.56 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.56: white autocomplete and mobile selection override installed');
