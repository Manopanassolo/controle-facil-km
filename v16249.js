const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.49 visual system aligned to approved blue/white reference
(function(){
  const labels={inicio:'Dashboard',viagem:'Novo percurso',historico:'Viagens',agenda:'Agenda',rotas:'Rotas',veiculos:'Frota',custos:'Despesas',equipe:'Equipe',relatorios:'Relatórios',ajuda:'Ajuda',perfil:'Meu perfil',painel:'Painel ADM',notificacoes:'Ocorrências',auditoria:'Auditoria',backup:'Backup',config:'Configurações'};
  function relabel(){
    document.querySelectorAll('#sideMenuV136 [data-p],.classic-module-nav [data-p],#mvItemsV1629 [data-page]').forEach(b=>{
      const p=b.dataset.p||b.dataset.page;if(labels[p])b.textContent=labels[p];
    });
    const map=[['#p-inicio h3','RESUMO DO MÊS','Resumo do mês'],['#p-viagem h2','Nova viagem','Novo percurso'],['#p-historico h2','Histórico','Viagens'],['#p-agenda h2','Agenda de deslocamentos','Agenda'],['#p-veiculos h2','Veículos','Frota']];
    map.forEach(([sel,from,to])=>document.querySelectorAll(sel).forEach(el=>{if((el.textContent||'').trim()===from)el.textContent=to}));
  }
  function brandSidebar(){
    const nav=document.getElementById('sideMenuV136');if(!nav||nav.querySelector('.mv-ref-brand'))return;
    const h=nav.querySelector('.side-menu-head-v136');if(h){h.classList.add('mv-ref-brand');h.innerHTML='<div class="mv-ref-logo">M</div><div><b>Movvant</b><small>Inteligência comercial em campo</small></div><button id="sideMenuCloseV136" type="button" aria-label="Fechar menu">×</button>';}
    const close=document.getElementById('sideMenuCloseV136');if(close)close.onclick=()=>{nav.classList.remove('open-v136');document.getElementById('sideMenuShadeV136')?.classList.remove('open-v136');document.body.classList.remove('menu-open-v136')};
  }
  function bottomNav(){
    if(document.getElementById('mvBottomV16249'))return;
    const bar=document.createElement('nav');bar.id='mvBottomV16249';bar.setAttribute('aria-label','Navegação principal');
    bar.innerHTML='<button data-page="inicio" type="button"><span>⌂</span>Início</button><button data-page="historico" type="button"><span>▣</span>Viagens</button><button data-page="agenda" type="button"><span>□</span>Agenda</button><button data-page="veiculos" type="button"><span>◇</span>Frota</button><button data-menu="1" type="button"><span>☰</span>Menu</button>';
    document.body.appendChild(bar);
    bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.page&&typeof show==='function'){show(b.dataset.page);window.scrollTo(0,0)}else if(b.dataset.menu){document.getElementById('topMenu')?.click()}});
  }
  function homeLayout(){
    const p=document.getElementById('p-inicio');if(!p)return;p.classList.add('mv-ref-home');
    const main=p.querySelector('.home-main-card-v136')||p.querySelector('.c');if(main){main.classList.add('mv-ref-main');const title=main.querySelector('#empresa');if(title)title.textContent='Dashboard';}
    const hero=p.querySelector('.hero');if(hero)hero.classList.add('mv-ref-manager');
  }
  function pageChrome(){
    document.querySelectorAll('#app>section').forEach(sec=>sec.classList.add('mv-ref-page'));
    const top=document.querySelector('.classic-app-header');if(top)top.classList.add('mv-ref-top');
  }
  function apply(){relabel();brandSidebar();bottomNav();homeLayout();pageChrome();}
  const base=render;render=function(){const r=base();setTimeout(apply,0);return r};
  setTimeout(apply,120);setTimeout(apply,900);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.49 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.49 approved visual language: crisp blue/white fleet dashboard */
:root{--mv-blue:#0759e6;--mv-navy:#061d3b;--mv-bg:#f7f9fc;--mv-border:#e3e8f0;--mv-text:#111827;--mv-muted:#687386;--mv-green:#119c5b;--mv-red:#df2f2f}
body{background:var(--mv-bg)!important;color:var(--mv-text)!important;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
.w{max-width:1440px!important;padding:18px 22px 92px!important}
#app .c{background:#fff!important;border:1px solid var(--mv-border)!important;border-radius:7px!important;box-shadow:0 1px 2px rgba(16,24,40,.025)!important}
#app h2{color:#101828!important;font-size:20px!important;font-weight:750!important;letter-spacing:-.25px!important}
#app h3{color:#202939!important;font-weight:700!important;text-transform:none!important}
#app .muted{color:var(--mv-muted)!important}
#app input,#app select,#app textarea{border:1px solid #d8dee8!important;border-radius:5px!important;background:#fff!important;color:#101828!important;min-height:42px!important;box-shadow:none!important}
#app button:not(.sec):not(.danger){background:var(--mv-blue)!important;border-radius:5px!important;color:#fff!important;box-shadow:none!important}
#app button.sec{background:#fff!important;color:#344054!important;border:1px solid #d8dee8!important;border-radius:5px!important}
#app .stat>div,#app .row{border-color:var(--mv-border)!important;border-radius:6px!important;background:#fff!important}
#app .stat b{color:#0759e6!important}
#app .tag{border-radius:999px!important;background:#eaf2ff!important;color:#0759e6!important}
#app .progress{background:#edf1f6!important}.progress>i{background:var(--mv-blue)!important}
.mv-ref-home{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:10px!important;max-width:1180px!important;margin:0 auto!important}
.mv-ref-main{padding:18px!important}.mv-ref-main #empresa{margin:0 0 14px!important}
.mv-ref-main>button[data-p-jump="viagem"]{float:right!important;margin-top:-48px!important;width:auto!important;padding:9px 14px!important;font-size:12px!important}
.mv-ref-home .stat{gap:8px!important}.mv-ref-home .stat>div{padding:12px!important;min-height:78px!important}.mv-ref-home .stat b{font-size:21px!important}
.mv-ref-home .hero{background:#fff!important}.mv-ref-manager{border-top:3px solid var(--mv-blue)!important}
.mv-ref-page>.c:first-child{margin-top:6px!important}
.mv-ref-page#p-viagem,.mv-ref-page#p-historico,.mv-ref-page#p-agenda,.mv-ref-page#p-veiculos,.mv-ref-page#p-custos,.mv-ref-page#p-backup{max-width:860px!important;margin:0 auto!important}
#mvBottomV16249{display:none}
@media(min-width:901px){
  body{padding-left:224px!important}
  .w{margin:0 auto!important}
  .side-menu-open-v136,#sideMenuShadeV136{display:none!important}
  .nav#sideMenuV136{display:flex!important;transform:none!important;left:0!important;top:0!important;bottom:0!important;width:224px!important;border-radius:0!important;background:linear-gradient(180deg,#061f43,#04172f)!important;border:0!important;padding:12px 10px!important;box-shadow:none!important;overflow-y:auto!important;z-index:90!important}
  .nav#sideMenuV136 .side-menu-head-v136{color:#fff!important;border-bottom:1px solid rgba(255,255,255,.13)!important;padding:5px 5px 14px!important;margin-bottom:8px!important;display:grid!important;grid-template-columns:34px 1fr!important;gap:8px!important;align-items:center!important}
  .nav#sideMenuV136 .side-menu-head-v136>button{display:none!important}.mv-ref-logo{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#fff;color:#0759e6;font-size:15px;font-weight:900}.mv-ref-brand b{font-size:13px!important}.mv-ref-brand small{display:block!important;color:#aebbd0!important;font-size:8px!important;margin-top:2px!important}
  .nav#sideMenuV136 button[data-p]{background:transparent!important;color:#f2f6fb!important;border:0!important;border-radius:5px!important;min-height:36px!important;font-size:11px!important;padding:9px 10px!important;font-weight:600!important}
  .nav#sideMenuV136 button[data-p]:hover{background:rgba(255,255,255,.09)!important}.nav#sideMenuV136 button[data-p="inicio"]{background:#0759e6!important;color:#fff!important}
  .nav#sideMenuV136 #sair{margin-top:auto!important;background:transparent!important;color:#cbd5e1!important;border-top:1px solid rgba(255,255,255,.12)!important;border-radius:0!important}
  .classic-app-header.mv-ref-top{margin:0 0 10px!important;border-radius:7px!important;border:1px solid var(--mv-border)!important;background:#fff!important;color:#101828!important;box-shadow:none!important}
}
@media(max-width:900px){
  body{padding-left:0!important;background:#fff!important}
  .w{padding:58px 10px 82px!important;max-width:100%!important}
  #app .c{border-radius:5px!important;margin:7px 0!important;padding:12px!important}
  #app h2{font-size:18px!important;margin:3px 0 12px!important}
  .mv-ref-main>button[data-p-jump="viagem"]{float:none!important;margin:0 0 12px!important;width:100%!important}
  .mv-ref-home .stat{grid-template-columns:1fr 1fr!important}.mv-ref-home .stat>div{min-height:70px!important;padding:10px!important}.mv-ref-home .stat b{font-size:18px!important}
  #mvBottomV16249{position:fixed!important;display:grid!important;grid-template-columns:repeat(5,1fr)!important;left:0!important;right:0!important;bottom:0!important;z-index:2147483000!important;background:#fff!important;border-top:1px solid #dfe5ee!important;padding:5px 4px max(5px,env(safe-area-inset-bottom))!important;box-shadow:0 -3px 12px rgba(16,24,40,.06)!important}
  #mvBottomV16249 button{border:0!important;background:#fff!important;color:#596579!important;min-height:51px!important;padding:3px 2px!important;font-size:9px!important;font-weight:600!important;border-radius:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important}
  #mvBottomV16249 button span{font-size:18px!important;line-height:18px!important;color:#344054!important}#mvBottomV16249 button:first-child,#mvBottomV16249 button:first-child span{color:#0759e6!important}
  .classic-app-header.mv-ref-top{background:#fff!important;color:#101828!important;border-bottom:1px solid var(--mv-border)!important;border-radius:0!important;box-shadow:none!important}
  #p-viagem .r,#p-agenda .r,#p-agenda .r3{grid-template-columns:1fr!important}
}
`;
if(!s.includes('</style>'))throw new Error('v162.49 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.49: approved blue/white reference layout applied');
