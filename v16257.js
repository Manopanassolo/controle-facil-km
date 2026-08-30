const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.57: route text fields own their touch/focus interaction on mobile.
(function(){
  const ids=new Set(['origem','destino']);
  function isField(el){return !!(el&&el.tagName==='INPUT'&&ids.has(el.id)&&el.closest('#p-viagem'))}
  function unlock(el){
    if(!isField(el))return;
    el.disabled=false;el.readOnly=false;
    el.removeAttribute('disabled');el.removeAttribute('readonly');
    el.style.setProperty('pointer-events','auto','important');
    el.style.setProperty('touch-action','manipulation','important');
    el.style.setProperty('user-select','text','important');
    el.style.setProperty('-webkit-user-select','text','important');
    el.style.setProperty('caret-color','auto','important');
    el.tabIndex=0;
  }
  function tune(){['origem','destino'].forEach(id=>unlock(document.getElementById(id)))}
  // Block legacy gesture handlers from consuming taps, without cancelling the browser's focus/keyboard default action.
  document.addEventListener('pointerdown',e=>{
    if(!isField(e.target))return;
    unlock(e.target);e.stopImmediatePropagation();
    setTimeout(()=>{try{e.target.focus({preventScroll:true})}catch(_){e.target.focus()}},0);
  },true);
  document.addEventListener('touchstart',e=>{
    if(!isField(e.target))return;
    unlock(e.target);e.stopImmediatePropagation();
  },true);
  document.addEventListener('click',e=>{
    if(!isField(e.target))return;
    unlock(e.target);e.stopImmediatePropagation();
    try{e.target.focus({preventScroll:true})}catch(_){e.target.focus()}
  },true);
  document.addEventListener('focusin',e=>{if(isField(e.target))unlock(e.target)},true);
  document.addEventListener('input',e=>{if(isField(e.target))unlock(e.target)},true);
  const mo=new MutationObserver(tune);mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','readonly','style','class']});
  [0,100,400,1000,2000].forEach(ms=>setTimeout(tune,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.57 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.57 mobile input authority */
body #p-viagem #origem,body #p-viagem #destino{pointer-events:auto!important;touch-action:manipulation!important;user-select:text!important;-webkit-user-select:text!important;cursor:text!important;caret-color:#172033!important;position:relative!important;z-index:5!important}
`;
if(!s.includes('</style>'))throw new Error('v162.57 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.57: route fields accept typing on mobile');
