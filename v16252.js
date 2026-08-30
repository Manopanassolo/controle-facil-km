const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 const pages=['inicio','viagem','historico','agenda','rotas','veiculos','custos','equipe','relatorios','ajuda','perfil','painel','notificacoes','auditoria','backup','config'];
 function route(page){
   if(!pages.includes(page))return;
   document.body.dataset.mvRoute=page;
   if(page==='viagem'&&typeof globalThis.mvTripLockArm==='function')globalThis.mvTripLockArm();
   try{if(typeof show==='function')show(page)}catch(e){}
   const target=document.getElementById('p-'+page);
   if(target){target.classList.remove('hide');target.style.setProperty('display','block','important');}
   pages.forEach(p=>{if(p===page)return;const el=document.getElementById('p-'+p);if(el)el.style.removeProperty('display');});
   requestAnimationFrame(()=>{const t=document.getElementById('p-'+page);if(t){t.classList.remove('hide');t.style.setProperty('display','block','important');}window.scrollTo(0,0)});
 }
 function bind(){
   if(document.documentElement.dataset.mv52Bound)return;document.documentElement.dataset.mv52Bound='1';
   document.addEventListener('click',e=>{
     const b=e.target.closest('[data-p-jump],[data-p],[data-page]');if(!b)return;
     const p=b.dataset.pJump||b.dataset.p||b.dataset.page;if(!pages.includes(p))return;
     e.preventDefault();e.stopPropagation();route(p);
   },true);
 }
 function tune(){
   bind();
   const main=document.querySelector('#p-inicio .home-main-card-v136')||document.querySelector('#p-inicio .c');
   if(main)main.classList.add('mv52-main');
   const stats=document.querySelector('#p-inicio .stat');if(stats)stats.classList.add('mv52-stats');
   const hero=document.querySelector('#p-inicio .hero');if(hero)hero.classList.add('mv52-hero');
   document.querySelectorAll('#p-inicio .row').forEach(x=>x.classList.add('mv52-row'));
 }
 const old=render;render=function(){const r=old();queueMicrotask(tune);return r};
 setTimeout(tune,80);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.52 startup anchor missing');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.52 functional navigation + closer reference palette */
:root{--m52-blue:#0d5cc8;--m52-side:#123d73;--m52-side2:#0d315f;--m52-bg:#f7f8fa;--m52-line:#e1e5eb;--m52-text:#1c2430;--m52-muted:#697586}
body{background:var(--m52-bg)!important;color:var(--m52-text)!important}
body[data-mv-route="inicio"] #p-inicio,body[data-mv-route="viagem"] #p-viagem,body[data-mv-route="historico"] #p-historico,body[data-mv-route="agenda"] #p-agenda,body[data-mv-route="rotas"] #p-rotas,body[data-mv-route="veiculos"] #p-veiculos,body[data-mv-route="custos"] #p-custos,body[data-mv-route="equipe"] #p-equipe,body[data-mv-route="relatorios"] #p-relatorios,body[data-mv-route="ajuda"] #p-ajuda,body[data-mv-route="perfil"] #p-perfil,body[data-mv-route="painel"] #p-painel,body[data-mv-route="notificacoes"] #p-notificacoes,body[data-mv-route="auditoria"] #p-auditoria,body[data-mv-route="backup"] #p-backup,body[data-mv-route="config"] #p-config{display:block!important;visibility:visible!important;opacity:1!important}
#app button:not(.sec):not(.danger){background:var(--m52-blue)!important}
.mv52-main{padding:13px!important}.mv52-main #empresa{font-size:17px!important;line-height:1.2!important;margin-bottom:2px!important}.mv52-main #usuario{font-size:9px!important;margin-bottom:10px!important}.mv52-main>h3{font-size:8px!important;margin:8px 0 5px!important;letter-spacing:.45px!important}.mv52-main>button[data-p-jump="viagem"]{min-height:31px!important;padding:6px 10px!important;font-size:9px!important;right:13px!important;top:12px!important}
.mv52-stats{gap:6px!important}.mv52-stats>div{min-height:64px!important;padding:8px 9px!important;border-radius:3px!important;border:1px solid var(--m52-line)!important}.mv52-stats .small{font-size:8px!important}.mv52-stats b{font-size:17px!important;margin-top:4px!important;color:#17212f!important}.mv52-row{padding:7px 9px!important;margin:5px 0!important;border-radius:3px!important;font-size:9px!important}.mv52-hero{padding:11px!important;border-radius:3px!important}.mv52-hero h3{font-size:10px!important;margin:0 0 7px!important}
@media(min-width:901px){.nav#sideMenuV136,.mv51-side{background:linear-gradient(180deg,var(--m52-side),var(--m52-side2))!important}.nav#sideMenuV136 button[data-p="inicio"],.mv51-side button[data-p="inicio"]{background:#1d66bd!important}.nav#sideMenuV136 button[data-p],.mv51-side button[data-p]{color:#eef4fb!important}.w{padding-top:10px!important}.mv51-dashboard{max-width:1040px!important}}
@media(max-width:900px){.mv52-main{padding:10px!important}.mv52-main>button[data-p-jump="viagem"]{position:static!important;width:100%!important;margin:6px 0 8px!important}.mv52-stats{grid-template-columns:1fr 1fr!important}.mv52-stats>div{min-height:60px!important}.mv52-stats b{font-size:16px!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.52 css anchor missing');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.52: navigation recovered and dashboard refined');
