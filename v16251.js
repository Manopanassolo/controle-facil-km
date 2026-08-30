const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 function tune(){
  const p=document.getElementById('p-inicio');
  if(p){
   p.classList.add('mv51-dashboard');
   const main=p.querySelector('.home-main-card-v136')||p.querySelector('.c');
   if(main){main.classList.add('mv51-summary');const t=main.querySelector('#empresa');if(t)t.textContent='Dashboard';const b=main.querySelector('[data-p-jump="viagem"]');if(b){b.textContent='Novo percurso';b.classList.add('mv51-newtrip');}const st=main.querySelector('.stat');if(st)st.classList.add('mv51-kpis');}
   const hero=p.querySelector('.hero');if(hero)hero.classList.add('mv51-manager');
  }
  const trip=document.getElementById('novaViagem');if(trip){trip.classList.add('mv51-form');const h=trip.querySelector('h2');if(h)h.textContent='Novo percurso';}
  const side=document.getElementById('sideMenuV136');if(side)side.classList.add('mv51-side');
  const top=document.querySelector('.classic-app-header');if(top)top.classList.add('mv51-top');
  document.querySelectorAll('#app>section').forEach(x=>x.classList.add('mv51-page'));
 }
 const r0=render;render=function(){const r=r0();setTimeout(tune,0);return r};setTimeout(tune,100);setTimeout(tune,700);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.51 startup anchor missing');
s=s.replace('carga();',js+'\ncarga();');
const css=`
:root{--m51-blue:#0b63e5;--m51-navy:#073b79;--m51-bg:#f5f7fb;--m51-line:#dfe5ee;--m51-text:#172033;--m51-muted:#748095}
body{background:var(--m51-bg)!important;color:var(--m51-text)!important;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;font-size:13px!important}
.w{max-width:none!important;margin:0!important;padding:14px 22px 84px!important}
#app .c{background:#fff!important;border:1px solid var(--m51-line)!important;border-radius:4px!important;box-shadow:0 1px 3px rgba(20,32,50,.035)!important;margin:9px 0!important;padding:16px!important}
#app h2{font-size:19px!important;color:#162033!important;margin:2px 0 13px!important}
#app h3{font-size:12px!important;color:#263244!important;text-transform:none!important}
#app input,#app select,#app textarea{border:1px solid #d7dee8!important;border-radius:3px!important;background:#fff!important;min-height:40px!important;font-size:11px!important;box-shadow:none!important}
#app button:not(.sec):not(.danger){background:var(--m51-blue)!important;border-radius:3px!important;box-shadow:none!important}
#app button.sec{background:#fff!important;color:#344054!important;border:1px solid #d7dee8!important;border-radius:3px!important}
.mv51-dashboard{max-width:1100px!important;margin:0 auto!important}.mv51-summary{position:relative!important;padding:18px!important}.mv51-summary #empresa{font-size:19px!important;margin:0 0 4px!important}.mv51-summary #usuario{font-size:10px!important;color:var(--m51-muted)!important;margin-bottom:16px!important}.mv51-newtrip{position:absolute!important;right:18px!important;top:16px!important;width:auto!important;min-height:34px!important;padding:8px 13px!important;font-size:10px!important}.mv51-summary>h3{font-size:9px!important;text-transform:uppercase!important;letter-spacing:.6px!important;color:#7f8a9b!important;margin:10px 0 7px!important}.mv51-kpis{grid-template-columns:repeat(4,1fr)!important;gap:8px!important}.mv51-kpis>div{min-height:80px!important;border:1px solid var(--m51-line)!important;border-radius:4px!important;padding:12px!important;background:#fff!important}.mv51-kpis .small{font-size:9px!important;color:#7b8798!important}.mv51-kpis b{font-size:21px!important;color:#122033!important;margin-top:7px!important;display:block!important}.mv51-manager{background:#fff!important;border-top:1px solid var(--m51-line)!important}.mv51-page:not(#p-inicio){max-width:930px!important;margin:0 auto!important}.mv51-form{max-width:760px!important;margin:10px auto!important}.mv51-form h2{border-bottom:1px solid #e6eaf0!important;padding-bottom:12px!important}.mv51-form .r,.mv51-form .r3{gap:8px!important}
@media(min-width:901px){body{padding-left:205px!important}.mv51-side{display:flex!important;transform:none!important;left:0!important;top:0!important;bottom:0!important;width:205px!important;border-radius:0!important;background:var(--m51-navy)!important;border:0!important;padding:12px 9px!important;box-shadow:none!important;z-index:90!important}.mv51-side .side-menu-head-v136{color:#fff!important;border-bottom:1px solid rgba(255,255,255,.14)!important;padding:6px 5px 14px!important;margin-bottom:8px!important}.mv51-side button[data-p]{background:transparent!important;color:#e8f0fb!important;border:0!important;border-radius:3px!important;min-height:35px!important;font-size:10px!important;padding:8px 9px!important;font-weight:600!important}.mv51-side button[data-p="inicio"]{background:#1768d8!important;color:#fff!important}.mv51-side #sair{margin-top:auto!important;background:transparent!important;color:#c5d5e8!important;border:0!important;border-top:1px solid rgba(255,255,255,.12)!important;border-radius:0!important}.side-menu-open-v136,#sideMenuShadeV136{display:none!important}.mv51-top{margin:0 0 10px!important;border-radius:0!important;border:0!important;border-bottom:1px solid var(--m51-line)!important;background:#fff!important;box-shadow:none!important}}
@media(max-width:900px){body{padding-left:0!important;background:#f8fafc!important}.w{padding:56px 9px 76px!important}.mv51-top{position:fixed!important;left:0!important;right:0!important;top:0!important;z-index:45!important;margin:0!important;height:50px!important;min-height:50px!important;padding:6px 9px 6px 52px!important;background:#fff!important;border-bottom:1px solid var(--m51-line)!important;border-radius:0!important}.mv51-summary{padding:12px!important}.mv51-newtrip{position:static!important;width:100%!important;margin:8px 0 12px!important}.mv51-kpis{grid-template-columns:1fr 1fr!important;gap:7px!important}.mv51-kpis>div{min-height:72px!important;padding:10px!important}.mv51-kpis b{font-size:18px!important}.mv51-form{margin:0!important}.mv51-form .r,.mv51-form .r3{grid-template-columns:1fr!important}.mv51-page:not(#p-inicio){max-width:100%!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.51 css anchor missing');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.51: validated structural reference layout');
