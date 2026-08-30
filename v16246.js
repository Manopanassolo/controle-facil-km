const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.46: stable Novo deslocamento without periodic rerenders or scroll resets.
(function(){
  let active=false,repairing=false;
  const app=()=>document.getElementById('app');
  const trip=()=>document.getElementById('p-viagem');
  const form=()=>document.getElementById('novaViagem');
  function isHidden(el){return !el||el.hidden||el.classList.contains('hide')||getComputedStyle(el).display==='none'||getComputedStyle(el).visibility==='hidden'}
  function repairOnlyIfNeeded(){
    if(!active||repairing)return;
    const a=app(),t=trip(),f=form();if(!a||!t||!f)return;
    if(!isHidden(t)&&!isHidden(f))return;
    const y=window.scrollY;
    repairing=true;
    try{
      a.classList.remove('hide');a.hidden=false;
      t.classList.remove('hide');t.hidden=false;
      t.style.removeProperty('display');t.style.removeProperty('visibility');t.style.removeProperty('opacity');
      if(getComputedStyle(t).display==='none')t.style.setProperty('display','block','important');
      f.classList.remove('hide');f.hidden=false;
      f.style.removeProperty('display');f.style.removeProperty('visibility');f.style.removeProperty('opacity');
      if(getComputedStyle(f).display==='none')f.style.setProperty('display','block','important');
      a.querySelectorAll('[id^="p-"]').forEach(sec=>{if(sec!==t&&!sec.classList.contains('hide'))sec.classList.add('hide')});
    }finally{
      repairing=false;
      requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:'instant'}));
    }
  }
  globalThis.mvTripLockArm=function(){active=true};
  function explicitOtherNav(target){
    const el=target?.closest?.('#topBell,[data-page],[data-p],[data-p-jump]');
    if(!el)return false;
    const page=el.dataset?.page||el.dataset?.p||el.dataset?.pJump||'';
    return el.id==='topBell'||(page&&page!=='viagem');
  }
  document.addEventListener('pointerdown',e=>{if(active&&explicitOtherNav(e.target))active=false},true);
  document.addEventListener('click',e=>{if(active&&explicitOtherNav(e.target))active=false},true);
  const obs=new MutationObserver(()=>{if(active&&!repairing)queueMicrotask(repairOnlyIfNeeded)});
  function watch(){const a=app();if(a)obs.observe(a,{subtree:true,attributes:true,attributeFilter:['class','style','hidden']});else setTimeout(watch,100)}
  watch();
  if(new URLSearchParams(location.search).get('mv_trip_scroll_test')==='1'){
    setTimeout(()=>{
      document.getElementById('auth')?.classList.add('hide');
      document.getElementById('app')?.classList.remove('hide');
      try{if(typeof show==='function')show('inicio')}catch(_){}
      const b=[...document.querySelectorAll('#p-inicio button,#p-inicio a,#p-inicio [role="button"]')].find(el=>/Novo deslocamento/i.test((el.textContent||''))||el.getAttribute('data-p-jump')==='viagem');
      if(b)b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch'}));
      setTimeout(()=>{
        const t=trip(),f=form();if(!t||!f)return;
        const spacer=document.createElement('div');spacer.id='mvScrollProbeV16246';spacer.style.height='1400px';f.appendChild(spacer);
        window.scrollTo(0,Math.min(500,document.documentElement.scrollHeight-window.innerHeight));
        const before=window.scrollY;
        setTimeout(()=>{t.classList.add('hide');},300);
        setTimeout(()=>{
          const after=window.scrollY;
          const ok=!isHidden(t)&&!isHidden(f)&&Math.abs(after-before)<80;
          document.documentElement.dataset.mvTripScrollTest=ok?'pass':'fail';
          spacer.remove();
        },900);
      },500);
    },300);
  }
})();
`;
if(!s.includes('carga();'))throw new Error('v162.46 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.46: trip screen stable without flicker or scroll reset');
