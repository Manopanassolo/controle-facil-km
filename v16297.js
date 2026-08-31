const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.24: descendant-level production chrome cleanup preserving the global header.
(function(){
 const hide=el=>{if(!el)return;el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');el.style.setProperty('height','0','important');el.style.setProperty('min-height','0','important');el.style.setProperty('max-height','0','important');el.style.setProperty('padding','0','important');el.style.setProperty('margin','0','important');el.style.setProperty('border','0','important');el.style.setProperty('overflow','hidden','important');el.style.setProperty('pointer-events','none','important');el.setAttribute('aria-hidden','true')};
 function clean(){
   const app=document.getElementById('app');if(!app)return;
   [...document.querySelectorAll('#app *')].forEach(el=>{
     if(el.closest('#app>.nav')||el.closest('.mv-sidebar89')||el.closest('#mvBottomDock85')||el.closest('#mvTopNavV16282'))return;
     const t=(el.textContent||'').replace(/\\s+/g,' ').trim();if(!t)return;
     const r=el.getBoundingClientRect();
     if(r.width>300&&r.height>18&&r.height<110&&/versão\\s*162/i.test(t)&&/backend online/i.test(t)) hide(el);
   });
   const home=document.getElementById('mvHome88');
   if(home){
     [...home.querySelectorAll('*')].forEach(el=>{
       const t=(el.textContent||'').replace(/\\s+/g,' ').trim();if(!t)return;
       const r=el.getBoundingClientRect();
       if(r.height>20&&r.height<120&&r.width<700&&/^Movvant\\s+Inteligência comercial em campo/i.test(t)) hide(el);
     });
   }
   document.body.classList.add('mv-shell124');
 }
 [0,50,120,250,500,900,1500,2600].forEach(ms=>setTimeout(clean,ms));
 window.addEventListener('pageshow',clean,true);document.addEventListener('click',()=>setTimeout(clean,15),true);
 globalThis.mvShellV16324={sync:clean};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.24 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.24 descendant-level cleanup, header preserved */
@media(min-width:900px){body.mv-shell124 #p-inicio{padding-top:0!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.24 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.24: final chrome cleanup preserves fixed header');
