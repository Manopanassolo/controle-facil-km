const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.05: deterministic post-confirm autocomplete repair + single desktop brand authority.
(function(){
  const ids=new Set(['origem','destino','preTripStopNameV127']);
  let lastField=null,lastFieldAt=0;
  function remember(el){if(el&&ids.has(el.id)){lastField=el;lastFieldAt=Date.now()}}
  window.addEventListener('pointerdown',e=>remember(e.target),true);
  window.addEventListener('focusin',e=>remember(e.target),true);
  window.addEventListener('input',e=>remember(e.target),true);

  // On the second tap, snapshot the visible suggestion and repair the final value AFTER
  // every older handler has completed. This avoids removing the tapped node during Playwright/native tap.
  window.addEventListener('pointerup',e=>{
    const b=e.target?.closest?.('#mvRouteChoicesV16263 button[data-mv-choice63]');
    if(!b||!b.classList.contains('mv-selected-v16263'))return;
    let target=(lastField&&Date.now()-lastFieldAt<15000)?lastField:null;
    const active=document.activeElement;
    if(active&&ids.has(active.id)&&(active===lastField||!target))target=active;
    if(!target)return;
    const main=b.querySelector('b')?.textContent?.trim()||'';
    const secondary=b.querySelector('span')?.textContent?.trim()||'';
    const text=[main,secondary].filter(Boolean).join(secondary?' - ':'');
    const targetRef=target;
    setTimeout(()=>{
      if(text){targetRef.value=text;targetRef.dispatchEvent(new Event('change',{bubbles:true}))}
      const p=document.getElementById('mvRouteChoicesV16263');
      if(p){p.classList.add('hide');p.innerHTML=''}
      targetRef.focus({preventScroll:true});
    },20);
  },true);

  function hide(el){if(!el)return;for(const [k,v] of [['display','none'],['visibility','hidden'],['height','0'],['min-height','0'],['max-height','0'],['padding','0'],['margin','0'],['border','0'],['overflow','hidden'],['pointer-events','none']])el.style.setProperty(k,v,'important');el.setAttribute('aria-hidden','true')}
  function compact(el,maxH,minW){let best=el,n=el;while(n&&n!==document.body){const r=n.getBoundingClientRect();if(r.height>0&&r.height<=maxH&&r.width>=minW)best=n;else if(r.height>maxH)break;n=n.parentElement}return best}
  function cleanBrands(){
    if(innerWidth<900)return;
    const nav=document.querySelector('#app>.nav');
    if(nav){
      [...nav.querySelectorAll('*')].forEach(el=>{
        const t=(el.textContent||'').replace(/\\s+/g,' ').trim();if(!t||!/Movvant/i.test(t))return;
        const r=el.getBoundingClientRect();
        if(r.top>=0&&r.top<70&&r.height>12&&r.height<60&&r.width>100)hide(compact(el,70,120));
      });
    }
    [...document.body.querySelectorAll('*')].forEach(el=>{
      if(el.closest('#app>.nav')||el.closest('#auth'))return;
      const t=(el.textContent||'').replace(/\\s+/g,' ').trim();if(!t)return;
      const r=el.getBoundingClientRect();
      if(r.left>=205&&r.top>=10&&r.top<120&&r.height>15&&r.height<120&&/Movvant/i.test(t)&&/Inteligência comercial em campo/i.test(t)&&!/Dashboard/i.test(t))hide(compact(el,130,200));
    });
    document.body.classList.add('mv-brand105');
  }
  [0,80,180,400,800,1400,2400,3600].forEach(ms=>setTimeout(cleanBrands,ms));
  window.addEventListener('pageshow',cleanBrands,true);
  window.addEventListener('resize',()=>requestAnimationFrame(cleanBrands));
  globalThis.mvV16305={remember,cleanBrands};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.05 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.05 single brand + deterministic autocomplete repair */
@media(min-width:900px){body.mv-brand105 #p-inicio{padding-top:12px!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.05 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.05: post-confirm stop autocomplete repair and single desktop brand authority installed');
