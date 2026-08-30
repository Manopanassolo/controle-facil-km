const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.47: CSS-owned trip screen state prevents flicker and scroll collapse.
(function(){
  let active=false;
  function activate(){active=true;document.body.classList.add('mv-trip-active-v16247')}
  function deactivate(){active=false;document.body.classList.remove('mv-trip-active-v16247')}
  globalThis.mvTripLockArm=activate;
  function explicitOtherNav(target){
    const el=target?.closest?.('#topBell,[data-page],[data-p],[data-p-jump]');
    if(!el)return false;
    const page=el.dataset?.page||el.dataset?.p||el.dataset?.pJump||'';
    return el.id==='topBell'||(page&&page!=='viagem');
  }
  document.addEventListener('pointerdown',e=>{if(active&&explicitOtherNav(e.target))deactivate()},true);
  document.addEventListener('click',e=>{if(active&&explicitOtherNav(e.target))deactivate()},true);
  if(new URLSearchParams(location.search).get('mv_trip_scroll_test')==='1'){
    setTimeout(()=>{
      document.getElementById('auth')?.classList.add('hide');
      document.getElementById('app')?.classList.remove('hide');
      try{if(typeof show==='function')show('inicio')}catch(_){}
      const b=[...document.querySelectorAll('#p-inicio button,#p-inicio a,#p-inicio [role="button"]')].find(el=>/Novo deslocamento/i.test((el.textContent||''))||el.getAttribute('data-p-jump')==='viagem');
      if(b)b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch'}));
      setTimeout(()=>{
        const t=document.getElementById('p-viagem'),f=document.getElementById('novaViagem');if(!t||!f)return;
        const spacer=document.createElement('div');spacer.id='mvScrollProbeV16247';spacer.style.height='1400px';f.appendChild(spacer);
        window.scrollTo(0,Math.min(500,document.documentElement.scrollHeight-window.innerHeight));
        const before=window.scrollY;
        setTimeout(()=>{t.classList.add('hide');f.classList.add('hide')},300);
        setTimeout(()=>{
          const after=window.scrollY,ct=getComputedStyle(t),cf=getComputedStyle(f);
          const ok=ct.display!=='none'&&cf.display!=='none'&&Math.abs(after-before)<80&&document.body.classList.contains('mv-trip-active-v16247');
          document.documentElement.dataset.mvTripScrollTest=ok?'pass':'fail';
          spacer.remove();
        },900);
      },500);
    },300);
  }
})();
`;
if(!s.includes('carga();'))throw new Error('v162.47 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.47: while Novo deslocamento is active, CSS prevents delayed renderers from collapsing the page */
body.mv-trip-active-v16247 #app{display:block!important;visibility:visible!important;opacity:1!important}
body.mv-trip-active-v16247 #app [id^="p-"]{display:none!important}
body.mv-trip-active-v16247 #app #p-viagem{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
body.mv-trip-active-v16247 #app #p-viagem #novaViagem{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
`;
if(!s.includes('</style>'))throw new Error('v162.47 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.47: CSS trip state prevents flicker and scroll collapse');
