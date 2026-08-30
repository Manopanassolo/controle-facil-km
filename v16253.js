const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 const valid=new Set(['inicio','viagem','historico','agenda','rotas','veiculos','custos','equipe','relatorios','ajuda','perfil','painel','notificacoes','auditoria','backup','config']);
 function closeMenu(){
  const m=document.getElementById('sideMenuV136'),sh=document.getElementById('sideMenuShadeV136');
  if(m)m.classList.remove('open-v136');if(sh)sh.classList.remove('open-v136');document.body.classList.remove('menu-open-v136');
 }
 function go(p){
  if(!valid.has(p))return;
  document.body.dataset.mv53=p;
  document.querySelectorAll('#app [id^="p-"]').forEach(el=>{el.style.setProperty('display','none','important');el.classList.add('hide')});
  const t=document.getElementById('p-'+p);if(!t)return;
  t.classList.remove('hide');t.style.setProperty('display','block','important');t.style.setProperty('visibility','visible','important');t.style.setProperty('opacity','1','important');
  if(p==='viagem'){
   const f=document.getElementById('novaViagem');if(f){f.classList.remove('hide');f.style.setProperty('display','block','important');f.style.setProperty('visibility','visible','important');f.style.setProperty('opacity','1','important')}
  }
  closeMenu();window.scrollTo(0,0);
 }
 function install(){
  document.querySelectorAll('[data-p-jump],[data-p],[data-page]').forEach(b=>{
   const p=b.dataset.pJump||b.dataset.p||b.dataset.page;if(!valid.has(p))return;
   b.onclick=function(ev){ev.preventDefault();ev.stopImmediatePropagation();go(p);return false};
  });
  const open=document.querySelector('.side-menu-open-v136');if(open)open.onclick=function(ev){ev.preventDefault();ev.stopImmediatePropagation();document.getElementById('sideMenuV136')?.classList.add('open-v136');document.getElementById('sideMenuShadeV136')?.classList.add('open-v136');document.body.classList.add('menu-open-v136');return false};
  const shade=document.getElementById('sideMenuShadeV136');if(shade)shade.onclick=closeMenu;
 }
 // Neutralize v16252 capture interceptor before it sees navigation events.
 document.addEventListener('click',function(e){
  const b=e.target.closest('[data-p-jump],[data-p],[data-page]');if(!b)return;const p=b.dataset.pJump||b.dataset.p||b.dataset.page;if(!valid.has(p))return;
  e.preventDefault();e.stopImmediatePropagation();go(p);
 },true);
 setTimeout(install,100);setTimeout(install,800);setTimeout(install,1800);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.53 anchor missing');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.53 navigation authority */
body[data-mv53] #app [id^="p-"]{display:none!important}
body[data-mv53="inicio"] #p-inicio,body[data-mv53="viagem"] #p-viagem,body[data-mv53="historico"] #p-historico,body[data-mv53="agenda"] #p-agenda,body[data-mv53="rotas"] #p-rotas,body[data-mv53="veiculos"] #p-veiculos,body[data-mv53="custos"] #p-custos,body[data-mv53="equipe"] #p-equipe,body[data-mv53="relatorios"] #p-relatorios,body[data-mv53="ajuda"] #p-ajuda,body[data-mv53="perfil"] #p-perfil,body[data-mv53="painel"] #p-painel,body[data-mv53="notificacoes"] #p-notificacoes,body[data-mv53="auditoria"] #p-auditoria,body[data-mv53="backup"] #p-backup,body[data-mv53="config"] #p-config{display:block!important;visibility:visible!important;opacity:1!important}
body[data-mv53="viagem"] #novaViagem{display:block!important;visibility:visible!important;opacity:1!important}
@media(max-width:900px){#sideMenuV136.open-v136{display:flex!important;transform:translateX(0)!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}#sideMenuShadeV136.open-v136{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.53 css anchor missing');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.53: direct navigation authority installed');
