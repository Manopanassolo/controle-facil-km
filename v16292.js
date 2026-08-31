const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.08: second-tap confirmation is armed on pointerdown, then repaired after all legacy handlers.
(function(){
  const ids=new Set(['origem','destino','preTripStopNameV127']);
  function portal(){return document.getElementById('mvRouteChoicesV16263')}
  let lastInput=null,lastAt=0;
  function remember(el){if(el&&ids.has(el.id)){lastInput=el;lastAt=Date.now()}}
  window.addEventListener('focusin',e=>remember(e.target),true);
  window.addEventListener('input',e=>remember(e.target),true);
  window.addEventListener('pointerdown',e=>{
    remember(e.target);
    const b=e.target?.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]');
    if(!b||!b.classList.contains('mv-selected-v16263'))return; // only the second tap is armed
    let input=(lastInput&&Date.now()-lastAt<15000)?lastInput:null;
    const active=document.activeElement;
    if(active&&ids.has(active.id)&&(active===lastInput||!input))input=active;
    if(!input)return;
    const main=b.querySelector('b')?.textContent?.trim()||'';
    const secondary=b.querySelector('span')?.textContent?.trim()||'';
    const text=[main,secondary].filter(Boolean).join(secondary?' - ':'');
    const target=input;
    // Do not cancel the native tap. Repair after click/pointerup handlers have fully completed.
    setTimeout(()=>{
      if(text){target.value=text;target.dispatchEvent(new Event('change',{bubbles:true}))}
      const p=portal();if(p){p.classList.add('hide');p.innerHTML=''}
      target.focus({preventScroll:true});
    },90);
  },true);
})();
`;
if(!s.includes('carga();'))throw new Error('v163.08 autocomplete anchor');s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.08: pointerdown-armed second-tap autocomplete repair installed');