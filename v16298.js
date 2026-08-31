const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.02: geometry/text based legacy chrome removal after production artifact inspection.
(function(){
 const hide=el=>{if(!el)return;for(const [k,v] of [['display','none'],['visibility','hidden'],['height','0'],['min-height','0'],['max-height','0'],['padding','0'],['margin','0'],['border','0'],['overflow','hidden'],['pointer-events','none']])el.style.setProperty(k,v,'important');el.setAttribute('aria-hidden','true')};
 function nearestCompactBlock(el,maxH=130,minW=180){
   let n=el; while(n&&n.id!=='app'){
     const r=n.getBoundingClientRect();
     if(r.height>0&&r.height<=maxH&&r.width>=minW)return n;
     n=n.parentElement;
   } return el;
 }
 function clean(){
   const app=document.getElementById('app');if(!app)return;
   hide(document.getElementById('mvTopNavV16282'));
   [...document.querySelectorAll('#app *')].forEach(el=>{
     if(el.closest('#app>.nav')||el.closest('.mv-sidebar89')||el.closest('#mvBottomDock85'))return;
     const t=(el.textContent||'').replace(/\\s+/g,' ').trim(); if(!t)return;
     const r=el.getBoundingClientRect();
     if(/backend online/i.test(t)&&r.height>0&&r.height<80){ hide(nearestCompactBlock(el,95,500)); return; }
     if(/versão\\s*162/i.test(t)&&/inteligência comercial em campo/i.test(t)&&r.height>0&&r.height<100){ hide(nearestCompactBlock(el,100,500)); return; }
   });
   const home=document.getElementById('mvHome88');
   if(home){
     [...home.querySelectorAll('*')].forEach(el=>{
       const t=(el.textContent||'').replace(/\\s+/g,' ').trim(); if(!t)return;
       const r=el.getBoundingClientRect();
       if(/Movvant/i.test(t)&&/Inteligência comercial em campo/i.test(t)&&!/Dashboard/i.test(t)&&r.height>15&&r.height<130){
         hide(nearestCompactBlock(el,130,220));
       }
     });
   }
   document.body.classList.add('mv-shell102');
 }
 [0,40,100,180,320,600,1000,1600,2600].forEach(ms=>setTimeout(clean,ms));
 window.addEventListener('pageshow',clean,true);document.addEventListener('click',()=>setTimeout(clean,10),true);
 globalThis.mvShellV16302={sync:clean};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.02 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.02 production artifact cleanup */
#mvTopNavV16282{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;padding:0!important;margin:0!important;border:0!important}
@media(min-width:900px){body.mv-shell102 #app{padding-top:0!important}body.mv-shell102 #p-inicio{padding-top:12px!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.02 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.02: production legacy status strip and duplicate brand removed by geometry/text authority');
