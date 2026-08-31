const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.06: authoritative second-tap confirmation. Keep first tap on v162.63; delay DOM removal until native tap completes.
(function(){
  const ids=new Set(['origem','destino','preTripStopNameV127']);
  function portal(){return document.getElementById('mvRouteChoicesV16263')}
  let lastInput=null,lastAt=0;
  function remember(el){if(el&&ids.has(el.id)){lastInput=el;lastAt=Date.now()}}
  window.addEventListener('pointerdown',e=>remember(e.target),true);
  window.addEventListener('focusin',e=>remember(e.target),true);
  window.addEventListener('input',e=>remember(e.target),true);
  window.addEventListener('pointerup',e=>{
    const b=e.target?.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]');
    if(!b||!b.classList.contains('mv-selected-v16263'))return; // first tap is handled by v162.63
    let input=(lastInput&&Date.now()-lastAt<15000)?lastInput:null;
    const active=document.activeElement;
    if(active&&ids.has(active.id)&&(active===lastInput||!input))input=active;
    if(!input)return;
    const main=b.querySelector('b')?.textContent?.trim()||'';
    const secondary=b.querySelector('span')?.textContent?.trim()||'';
    const text=[main,secondary].filter(Boolean).join(secondary?' - ':'');
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
    const target=input;
    // Delay closing so the native/Playwright tap can finish against a still-attached button.
    setTimeout(()=>{
      if(text){target.value=text;target.dispatchEvent(new Event('change',{bubbles:true}))}
      const p=portal();if(p){p.classList.add('hide');p.innerHTML=''}
      target.focus({preventScroll:true});
    },60);
  },true);
})();
`;
if(!s.includes('carga();'))throw new Error('v163.06 autocomplete anchor');s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.06: native-safe deterministic second-tap autocomplete authority installed');