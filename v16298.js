const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.21: remove only obsolete legacy chrome; the new global header remains visible.
(function(){
 const hide=el=>{if(!el)return;for(const [k,v] of [['display','none'],['visibility','hidden'],['height','0'],['min-height','0'],['max-height','0'],['padding','0'],['margin','0'],['border','0'],['overflow','hidden'],['pointer-events','none']])el.style.setProperty(k,v,'important');el.setAttribute('aria-hidden','true')};
 function compactAncestor(el,maxH=140,minW=180){let best=el,n=el;while(n&&n!==document.body){const r=n.getBoundingClientRect();if(r.height>0&&r.height<=maxH&&r.width>=minW)best=n;else if(r.height>maxH)break;n=n.parentElement}return best}
 function clean(){
   if(innerWidth>=900){
     [...document.body.querySelectorAll('*')].forEach(el=>{
       if(el.closest('#app>.nav')||el.closest('.mv-sidebar89')||el.closest('#mvBottomDock85')||el.closest('#auth')||el.closest('#mvTopNavV16282'))return;
       const t=(el.textContent||'').replace(/\\s+/g,' ').trim();if(!t)return;
       const r=el.getBoundingClientRect();
       if(r.width<=0||r.height<=0)return;
       if(/backend online/i.test(t)&&r.top<100&&r.left>=190&&r.height<90){hide(compactAncestor(el,100,500));return}
       if(/versão\\s*162/i.test(t)&&r.top<100&&r.left>=190&&r.height<90){hide(compactAncestor(el,100,500));return}
       if(/Movvant/i.test(t)&&/Inteligência comercial em campo/i.test(t)&&!/Dashboard/i.test(t)&&r.top>=70&&r.top<185&&r.left>=205&&r.height<130){hide(compactAncestor(el,140,220));return}
     });
   }
   document.body.classList.add('mv-shell121');
 }
 [0,60,140,300,650,1100,1800,2800].forEach(ms=>setTimeout(clean,ms));
 window.addEventListener('pageshow',clean,true);
 window.addEventListener('resize',()=>requestAnimationFrame(clean));
 globalThis.mvShellV16321={sync:clean};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.21 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.21 global header is authoritative */
@media(min-width:900px){body.mv-shell121 #app{padding-top:54px!important}body.mv-shell121 #p-inicio{padding-top:0!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.21 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.21: global header preserved and legacy chrome removed');
