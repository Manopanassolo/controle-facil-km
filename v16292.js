const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.94: final two-tap authority survives stop-editor focus/re-render timing.
(function(){
  function portal(){return document.getElementById('mvRouteChoicesV16263')}
  function choice(e){return e.target?.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]')}
  let armed=null,armedAt=0;
  window.addEventListener('pointerup',e=>{
    const b=choice(e);if(!b)return;
    const input=document.activeElement;
    if(!input||!['origem','destino','preTripStopNameV127'].includes(input.id))return;
    const idx=b.dataset.mvChoice63,now=Date.now(),key=input.id+':'+idx;
    const isSelected=b.classList.contains('mv-selected-v16263');
    if(!isSelected&&armed!==key){armed=key;armedAt=now;return}
    if(isSelected||armed===key&&now-armedAt<2500){
      // Let v162.63 handle first when its internal state is healthy. If it did not
      // close the portal, perform the same confirmation from the rendered choice.
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
  },false);
  document.addEventListener('input',e=>{if(['origem','destino','preTripStopNameV127'].includes(e.target?.id)){armed=null}},true);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.94 startup anchor');s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.94: stop two-tap confirmation hardened');