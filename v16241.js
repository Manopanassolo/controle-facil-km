const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.42: protect Novo deslocamento from delayed startup rerenders.
(function(){
  let tripLockUntil=0;
  let restoring=false;
  function trip(){return document.getElementById('p-viagem')}
  function app(){return document.getElementById('app')}
  function forceTripStable(){
    if(restoring)return;
    const a=app(),t=trip();if(!a||!t)return;
    restoring=true;
    try{
      a.classList.remove('hide');a.hidden=false;
      a.querySelectorAll('section[id^="p-"]').forEach(sec=>{
        if(sec===t){sec.classList.remove('hide');sec.hidden=false;sec.style.setProperty('display','block','important');sec.style.setProperty('visibility','visible','important');sec.style.setProperty('opacity','1','important')}
        else{sec.classList.add('hide');sec.style.removeProperty('display');sec.style.removeProperty('visibility');sec.style.removeProperty('opacity')}
      });
    }finally{restoring=false}
  }
  function armTripLock(){tripLockUntil=Date.now()+5000;forceTripStable()}
  globalThis.mvTripLockArm=armTripLock;
  globalThis.mvTripLockCancel=()=>{tripLockUntil=0};
  function isTripCTA(el){return !!el?.closest?.('[data-mv-trip-cta="1"],#p-inicio [data-p-jump="viagem"]')}
  document.addEventListener('click',e=>{
    if(isTripCTA(e.target)){armTripLock();return}
    if(tripLockUntil>Date.now())tripLockUntil=0;
  },true);
  const obs=new MutationObserver(()=>{
    if(restoring||Date.now()>=tripLockUntil)return;
    const t=trip();if(!t)return;
    const hidden=t.classList.contains('hide')||getComputedStyle(t).display==='none';
    if(hidden)setTimeout(forceTripStable,0);
  });
  function watch(){const a=app();if(a)obs.observe(a,{subtree:true,attributes:true,attributeFilter:['class','style','hidden']});else setTimeout(watch,100)}
  watch();
  if(new URLSearchParams(location.search).get('mv_trip_persist_test')==='1'){
    setTimeout(()=>{
      document.getElementById('auth')?.classList.add('hide');document.getElementById('app')?.classList.remove('hide');
      try{if(typeof show==='function')show('inicio')}catch(_){}
      const b=[...document.querySelectorAll('#p-inicio button,#p-inicio a,#p-inicio [role="button"]')].find(el=>/Novo deslocamento/i.test((el.textContent||''))||el.getAttribute('data-p-jump')==='viagem');
      if(b)b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch'}));
      setTimeout(()=>{const t=trip();const ok=!!t&&!t.classList.contains('hide')&&getComputedStyle(t).display!=='none';document.documentElement.dataset.mvTripPersistTest=ok?'pass':'fail'},3600);
    },300);
  }
})();
`;
if(!s.includes('carga();'))throw new Error('v162.42 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.42: Novo deslocamento persistence lock active');
