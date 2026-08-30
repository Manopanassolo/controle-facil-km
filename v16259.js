const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.59: native typing guard + visual/interaction self-test for Cloudflare Android build.
(function(){
  const ids=new Set(['origem','destino']);
  function isField(el){return !!(el&&el.tagName==='INPUT'&&ids.has(el.id)&&el.closest('#p-viagem'))}
  function unlock(el){
    if(!isField(el))return;
    el.disabled=false;el.readOnly=false;
    el.removeAttribute('disabled');el.removeAttribute('readonly');
    el.setAttribute('inputmode','text');el.setAttribute('autocomplete','off');
    el.style.setProperty('pointer-events','auto','important');
    el.style.setProperty('touch-action','auto','important');
    el.style.setProperty('user-select','text','important');
    el.style.setProperty('-webkit-user-select','text','important');
    el.style.setProperty('caret-color','#172033','important');
    el.tabIndex=0;
  }
  function unlockAll(){ids.forEach(id=>unlock(document.getElementById(id)))}
  // Window capture runs before old document capture handlers. Keep the browser default action intact.
  window.addEventListener('pointerdown',e=>{if(!isField(e.target))return;unlock(e.target);try{e.target.focus({preventScroll:true})}catch(_){e.target.focus()}e.stopPropagation()},true);
  window.addEventListener('touchstart',e=>{if(!isField(e.target))return;unlock(e.target);try{e.target.focus({preventScroll:true})}catch(_){e.target.focus()}e.stopPropagation()},true);
  window.addEventListener('click',e=>{if(!isField(e.target))return;unlock(e.target);try{e.target.focus({preventScroll:true})}catch(_){e.target.focus()}},true);
  unlockAll();[120,500,1200,2500].forEach(ms=>setTimeout(unlockAll,ms));

  const q=new URLSearchParams(location.search);
  if(q.get('mv_visual_test')==='1')setTimeout(()=>{
    document.getElementById('auth')?.classList.add('hide');document.getElementById('app')?.classList.remove('hide');
    try{globalThis.mvTripLockArm?.();globalThis.show?.('viagem')}catch(_){}
    const o=document.getElementById('origem'),d=document.getElementById('destino');unlockAll();
    if(o){o.value='Avenida Paulista';o.dispatchEvent(new Event('input',{bubbles:true}));try{o.focus()}catch(_){}}
    const cs=o?getComputedStyle(o):null;const r=o?.getBoundingClientRect();let hit=null;if(r)hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
    const ok=!!(o&&d&&!o.readOnly&&!o.disabled&&!d.readOnly&&!d.disabled&&cs?.pointerEvents!=='none'&&(hit===o||o.contains?.(hit))&&o.value==='Avenida Paulista');
    document.documentElement.dataset.mvTypingTest=ok?'pass':'fail';
    document.documentElement.dataset.mvBuild='162.59';
  },1200);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.59 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.59 final native input ownership */
body #p-viagem #origem,body #p-viagem #destino{pointer-events:auto!important;touch-action:auto!important;user-select:text!important;-webkit-user-select:text!important;cursor:text!important;caret-color:#172033!important;position:relative!important;z-index:50!important}
`;
if(!s.includes('</style>'))throw new Error('v162.59 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.59: native typing guard and Cloudflare visual self-test installed');
