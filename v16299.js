const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.21: keep the sidebar brand header; remove only duplicated centered legacy branding.
(function(){
  function hide(el){if(!el)return;for(const [k,v] of [['display','none'],['visibility','hidden'],['height','0'],['min-height','0'],['max-height','0'],['padding','0'],['margin','0'],['border','0'],['overflow','hidden'],['pointer-events','none']])el.style.setProperty(k,v,'important');el.setAttribute('aria-hidden','true')}
  function compact(el,maxH,minW){let best=el,n=el;while(n&&n!==document.body){const r=n.getBoundingClientRect();if(r.height>0&&r.height<=maxH&&r.width>=minW)best=n;else if(r.height>maxH)break;n=n.parentElement}return best}
  function cleanBrands(){
    if(innerWidth<900)return;
    [...document.body.querySelectorAll('*')].forEach(el=>{
      if(el.closest('#app>.nav')||el.closest('#auth')||el.closest('#mvTopNavV16282'))return;
      const t=(el.textContent||'').replace(/\\s+/g,' ').trim();if(!t)return;
      const r=el.getBoundingClientRect();
      if(r.left>=205&&r.top>=10&&r.top<140&&r.height>15&&r.height<140&&/Movvant/i.test(t)&&/Inteligência comercial em campo/i.test(t)&&!/Dashboard/i.test(t))hide(compact(el,150,200));
    });
    document.body.classList.add('mv-brand121');
  }
  [0,80,180,400,800,1400,2400,3600].forEach(ms=>setTimeout(cleanBrands,ms));
  window.addEventListener('pageshow',cleanBrands,true);
  window.addEventListener('resize',()=>requestAnimationFrame(cleanBrands));
  globalThis.mvBrandV16321={sync:cleanBrands};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.21 branding anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.21 sidebar brand is intentionally visible */
@media(min-width:900px){body.mv-brand121 #p-inicio{padding-top:0!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.21 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.21: sidebar brand header restored');
