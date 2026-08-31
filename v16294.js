const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.97: canonical shell authority; remove legacy top shell and duplicate Dashboard visually and structurally.
(function(){
  const hide=el=>{if(!el)return;el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');el.style.setProperty('pointer-events','none','important');el.setAttribute('aria-hidden','true')};
  function clean(){
    const app=document.getElementById('app');
    if(!app)return;
    hide(document.getElementById('mvTopNavV16282'));
    const home=document.getElementById('p-inicio'),canonical=document.getElementById('mvHome88');
    if(home&&canonical){[...home.children].forEach(x=>{if(x!==canonical)hide(x)});canonical.style.removeProperty('display');canonical.style.removeProperty('visibility');canonical.removeAttribute('aria-hidden')}
    const status=document.getElementById('status');
    if(status){const c=status.closest('.c');if(c&&!c.contains(canonical))hide(c)}
    [...app.children].forEach(el=>{
      if(el===home||el.matches?.('section[id^="p-"]')||el.classList?.contains('nav')||el.id==='mvBottomDock85')return;
      const t=(el.textContent||'').replace(/\s+/g,' ').trim();
      if(/backend online/i.test(t)||(/inteligência comercial em campo/i.test(t)&&/versão/i.test(t)))hide(el);
    });
    document.body.classList.add('mv-canonical-shell97');
  }
  [0,80,220,500,1000,1800,3000].forEach(ms=>setTimeout(clean,ms));
  document.addEventListener('click',()=>setTimeout(clean,30),true);
  globalThis.mvCanonicalShellV16297={sync:clean};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.97 startup anchor');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.97 canonical shell */
#mvTopNavV16282{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important;pointer-events:none!important}
body.mv-canonical-shell97[data-mv-page="inicio"] #p-inicio>#mvHome88{display:block!important;visibility:visible!important}
body.mv-canonical-shell97[data-mv-page="inicio"] #p-inicio>:not(#mvHome88){display:none!important;visibility:hidden!important}
@media(min-width:900px){body.mv-canonical-shell97 #app{padding-top:0!important}body.mv-canonical-shell97 #p-inicio{padding-top:0!important}body.mv-canonical-shell97 #mvHome88{margin-top:0!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.97 css anchor');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.97: canonical shell enforced; legacy top shell and duplicate Dashboard removed');
