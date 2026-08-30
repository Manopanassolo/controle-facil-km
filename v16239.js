const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.39: hard-bind the visible Home "Novo deslocamento" CTA on Android.
(function(){
  function forceTrip(){
    const app=document.getElementById('app'),trip=document.getElementById('p-viagem');
    if(!app||!trip)return false;
    try{if(typeof show==='function')show('viagem')}catch(e){console.warn('v162.39 show viagem',e)}
    app.classList.remove('hide');app.hidden=false;
    app.querySelectorAll('section[id^="p-"]').forEach(sec=>{
      if(sec===trip){
        sec.classList.remove('hide');sec.hidden=false;
        sec.style.setProperty('display','block','important');
        sec.style.setProperty('visibility','visible','important');
        sec.style.setProperty('opacity','1','important');
        sec.style.setProperty('pointer-events','auto','important');
      }else{
        sec.classList.add('hide');
        sec.style.removeProperty('display');
        sec.style.removeProperty('visibility');
        sec.style.removeProperty('opacity');
      }
    });
    document.body.classList.remove('km-menu-open','mv-lock-v1629');
    document.documentElement.classList.remove('mv-lock-v1629');
    document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow');
    setTimeout(()=>trip.scrollIntoView({block:'start'}),0);
    return !trip.classList.contains('hide');
  }
  function visibleTripButtons(){
    const home=document.getElementById('p-inicio');
    if(!home)return [];
    return [...home.querySelectorAll('button,a,[role="button"]')].filter(el=>{
      const t=(el.textContent||'').replace(/\s+/g,' ').trim();
      return /Novo deslocamento/i.test(t)||el.getAttribute('data-p-jump')==='viagem';
    });
  }
  function bind(){
    visibleTripButtons().forEach((b,i)=>{
      b.id=b.id||('mvNovoDeslocamentoV16239_'+i);
      b.dataset.mvTripCta='1';
      b.style.setProperty('pointer-events','auto','important');
      b.style.setProperty('position','relative','important');
      b.style.setProperty('z-index','30','important');
      b.onclick=function(e){e.preventDefault();e.stopPropagation();forceTrip()};
      b.ontouchend=function(e){e.preventDefault();e.stopPropagation();forceTrip()};
    });
  }
  document.addEventListener('pointerdown',function(e){
    const b=e.target.closest?.('[data-mv-trip-cta="1"]');
    if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();forceTrip();
  },true);
  [50,180,500,1200,2500].forEach(ms=>setTimeout(bind,ms));
  window.addEventListener('pageshow',()=>setTimeout(bind,50));
  if(new URLSearchParams(location.search).get('mv_trip_test')==='1'){
    setTimeout(()=>{
      document.getElementById('auth')?.classList.add('hide');
      document.getElementById('app')?.classList.remove('hide');
      try{if(typeof show==='function')show('inicio')}catch(_){}
      bind();
      const b=visibleTripButtons()[0];
      if(b)b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch'}));
      const trip=document.getElementById('p-viagem');
      const ok=!!trip&&!trip.classList.contains('hide')&&getComputedStyle(trip).display!=='none';
      document.documentElement.dataset.mvRealTripCtaTest=ok?'pass':'fail';
    },300);
  }
})();
`;
if(!s.includes('carga();'))throw new Error('v162.39 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.39: visible Novo deslocamento CTA hard-bound for Android');
