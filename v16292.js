const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.95: capture two-tap authority before legacy handlers can stop propagation.
(function(){
  function portal(){return document.getElementById('mvRouteChoicesV16263')}
  function choice(e){return e.target?.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]')}
  let armed=null,armedAt=0,lastInput=null;
  window.addEventListener('pointerup',e=>{
    const b=choice(e);if(!b)return;
    const active=document.activeElement;
    const input=(active&&['origem','destino','preTripStopNameV127'].includes(active.id))?active:lastInput;
    if(!input)return;
    lastInput=input;
    const idx=b.dataset.mvChoice63,now=Date.now(),key=input.id+':'+idx;
    const isSelected=b.classList.contains('mv-selected-v16263');
    if(!isSelected&&armed!==key){armed=key;armedAt=now;return}
    if(isSelected||(armed===key&&now-armedAt<2500)){
      setTimeout(()=>{
        const p=portal();if(!p||p.classList.contains('hide')){armed=null;return}
        const current=p.querySelector('button[data-mv-choice63="'+idx+'"]');
        if(!current||!current.classList.contains('mv-selected-v16263'))return;
        const main=current.querySelector('b')?.textContent?.trim()||'';
        const secondary=current.querySelector('span')?.textContent?.trim()||'';
        const text=[main,secondary].filter(Boolean).join(secondary?' - ':'');
        if(text){input.value=text;input.dispatchEvent(new Event('change',{bubbles:true}))}
        p.classList.add('hide');p.innerHTML='';armed=null;
        input.focus({preventScroll:true});
      },0)
    }
  },true);
  window.addEventListener('focusin',e=>{if(['origem','destino','preTripStopNameV127'].includes(e.target?.id))lastInput=e.target},true);
  document.addEventListener('input',e=>{if(['origem','destino','preTripStopNameV127'].includes(e.target?.id)){armed=null;lastInput=e.target}},true);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.95 startup anchor');s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.95: captured stop confirmation authority installed');