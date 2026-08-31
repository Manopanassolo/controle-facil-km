const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.01: descendant-level production chrome cleanup verified against v163.00 artifact.
(function(){
 const hide=el=>{if(!el)return;el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');el.style.setProperty('height','0','important');el.style.setProperty('min-height','0','important');el.style.setProperty('max-height','0','important');el.style.setProperty('padding','0','important');el.style.setProperty('margin','0','important');el.style.setProperty('border','0','important');el.style.setProperty('overflow','hidden','important');el.style.setProperty('pointer-events','none','important');el.setAttribute('aria-hidden','true')};
 function clean(){
   const app=document.getElementById('app');if(!app)return;
   hide(document.getElementById('mvTopNavV16282'));
   // Hide the narrow legacy status/version strip wherever it lives outside the sidebar.
   [...document.querySelectorAll('#app *')].forEach(el=>{
     if(el.closest('#app>.nav')||el.closest('.mv-sidebar89')||el.closest('#mvBottomDock85'))return;
     const t=(el.textContent||'').replace(/\\s+/g,' ').trim();if(!t)return;
     const r=el.getBoundingClientRect();
     if(r.width>300&&r.height>18&&r.height<110&&/versão\\s*162/i.test(t)&&/backend online/i.test(t)) hide(el);
   });
   // Remove the duplicate centered Movvant brand inside the canonical dashboard, preserving only the sidebar brand.
   const home=document.getElementById('mvHome88');
   if(home){
     [...home.querySelectorAll('*')].forEach(el=>{
       const t=(el.textContent||'').replace(/\\s+/g,' ').trim();if(!t)return;
       const r=el.getBoundingClientRect();
       if(r.height>20&&r.height<120&&r.width<700&&/^Movvant\\s+Inteligência comercial em campo/i.test(t)) hide(el);
     });
   }
   document.body.classList.add('mv-shell101');
 }
 [0,50,120,250,500,900,1500,2600].forEach(ms=>setTimeout(clean,ms));
 window.addEventListener('pageshow',clean,true);document.addEventListener('click',()=>setTimeout(clean,15),true);
 globalThis.mvShellV16301={sync:clean};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.01 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.01 descendant-level production chrome cleanup */
#mvTopNavV16282{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;padding:0!important;margin:0!important;border:0!important}
@media(min-width:900px){body.mv-shell101 #app{padding-top:0!important}body.mv-shell101 #p-inicio{padding-top:12px!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.01 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.01: duplicate status strip and centered brand removed by descendant scan');
