const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.00: final visual shell authority. Remove remaining legacy desktop chrome verified in production artifact.
(function(){
 function hide(el){if(!el)return;el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');el.style.setProperty('height','0','important');el.style.setProperty('min-height','0','important');el.style.setProperty('padding','0','important');el.style.setProperty('margin','0','important');el.style.setProperty('border','0','important');el.setAttribute('aria-hidden','true')}
 function clean(){
   const app=document.getElementById('app'); if(!app)return;
   hide(document.getElementById('mvTopNavV16282'));
   // Production screenshot showed two obsolete chrome blocks: a white status/version strip and a centered Movvant brand above Dashboard.
   [...app.children].forEach(el=>{
     if(el.matches('section[id^="p-"],#mvBottomDock85,.mv-sidebar89,.nav'))return;
     const t=(el.textContent||'').replace(/\\s+/g,' ').trim();
     if((/versão\\s*162/i.test(t)&&/backend online/i.test(t))||(/^Movvant\\s+Inteligência comercial em campo/i.test(t)&&!el.closest('.mv-sidebar89'))) hide(el);
   });
   const home=document.getElementById('p-inicio'),canonical=document.getElementById('mvHome88');
   if(home&&canonical){[...home.children].forEach(el=>{if(el!==canonical)hide(el)});canonical.style.removeProperty('display');canonical.style.removeProperty('visibility');canonical.removeAttribute('aria-hidden')}
   document.body.classList.add('mv-shell100');
 }
 [0,60,160,350,700,1300,2400].forEach(ms=>setTimeout(clean,ms));
 window.addEventListener('pageshow',clean,true);document.addEventListener('click',()=>setTimeout(clean,20),true);
 globalThis.mvShellV16300={sync:clean};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.00 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.00 verified production chrome cleanup */
#mvTopNavV16282{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;padding:0!important;margin:0!important;border:0!important}
body.mv-shell100 #p-inicio>#mvHome88{display:block!important;visibility:visible!important}
body.mv-shell100 #p-inicio>:not(#mvHome88){display:none!important;visibility:hidden!important}
@media(min-width:900px){body.mv-shell100 #app{padding-top:0!important}body.mv-shell100 #p-inicio{padding-top:12px!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.00 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.00: remaining legacy production chrome removed');
