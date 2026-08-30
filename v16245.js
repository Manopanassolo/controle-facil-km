const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.45: keep Novo deslocamento stable until the user explicitly navigates elsewhere.
(function(){
  let active=false,restoring=false;
  const app=()=>document.getElementById('app');
  const trip=()=>document.getElementById('p-viagem');
  const form=()=>document.getElementById('novaViagem');
  function stabilize(){
    if(!active||restoring)return;
    const a=app(),t=trip(),f=form();if(!a||!t)return;
    restoring=true;
    try{
      a.classList.remove('hide');a.hidden=false;
      a.querySelectorAll('[id^="p-"]').forEach(sec=>{
        if(sec===t){
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
      if(f){
        f.classList.remove('hide');f.hidden=false;
        f.style.removeProperty('display');
        f.style.setProperty('visibility','visible','important');
        f.style.setProperty('opacity','1','important');
        f.style.setProperty('pointer-events','auto','important');
        if(getComputedStyle(f).display==='none')f.style.setProperty('display','block','important');
      }
    }finally{restoring=false}
  }
  globalThis.mvTripLockArm=function(){active=true;stabilize();[40,150,500,1200,2600,5000].forEach(ms=>setTimeout(stabilize,ms))};
  function explicitOtherNav(target){
    const el=target?.closest?.('#topBell,[data-page],[data-p],[data-p-jump]');
    if(!el)return false;
    const page=el.dataset?.page||el.dataset?.p||el.dataset?.pJump||'';
    return el.id==='topBell'||(page&&page!=='viagem');
  }
  document.addEventListener('pointerdown',e=>{if(active&&explicitOtherNav(e.target))active=false},true);
  document.addEventListener('click',e=>{if(active&&explicitOtherNav(e.target))active=false},true);
  const originalShow=typeof globalThis.show==='function'?globalThis.show:null;
  if(originalShow){
    globalThis.show=function(page){
      if(active&&page!=='viagem')return;
      return originalShow.apply(this,arguments);
    };
  }
  const obs=new MutationObserver(()=>{
    if(!active||restoring)return;
    const t=trip(),f=form();
    const bad=!t||t.classList.contains('hide')||getComputedStyle(t).display==='none'||!f||f.classList.contains('hide')||getComputedStyle(f).display==='none';
    if(bad)setTimeout(stabilize,0);
  });
  function watch(){const a=app();if(a)obs.observe(a,{subtree:true,attributes:true,childList:true,attributeFilter:['class','style','hidden']});else setTimeout(watch,100)}
  watch();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(stabilize,30)});
})();
`;
if(!s.includes('carga();'))throw new Error('v162.45 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.45: active trip screen remains stable until explicit navigation');
