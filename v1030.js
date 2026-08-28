const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const must=(a,b,label)=>{if(!s.includes(a))throw new Error('v103.0 anchor ausente: '+label);s=s.replace(a,b)};

must('Gestão de deslocamentos · versão 102.3','Gestão de deslocamentos · versão 103.0','versao');
must('<span class="tag">102.3</span>','<span class="tag">103.0</span>','versao ajuda');
must("checks.push(['Versão','102.3']);","checks.push(['Versão','103.0']);",'diagnostico');

must('</style>',`\n/* v103.0 — restauração da experiência visual corporativa mantendo a paleta nude */
:root{--sidebar:#3b332d;--sidebar2:#463b33;--sidebarText:#f7f1eb;--sidebarMuted:#cbbdb1;--shadow:0 12px 34px rgba(68,54,43,.10);--shadowSoft:0 6px 18px rgba(68,54,43,.07)}
body{background:linear-gradient(180deg,#f7f3ee 0%,#f5f0ea 100%)}
.w{max-width:1500px;padding:18px 24px 28px}
.w> .c:first-child{border:0;box-shadow:var(--shadowSoft);border-radius:16px;min-height:72px;padding:14px 18px;position:sticky;top:10px;z-index:30;background:rgba(255,255,255,.96);backdrop-filter:blur(10px)}
.w> .c:first-child>div:first-child>div:first-child{font-size:23px!important;letter-spacing:-.3px}
#status{font-weight:700;padding:7px 11px}
#auth{max-width:720px;margin:44px auto;box-shadow:var(--shadow);padding:28px}
#app{padding-left:270px;min-height:calc(100vh - 112px)}
.nav{position:fixed!important;left:18px;top:104px;bottom:18px;width:240px;display:flex!important;flex-direction:column;align-items:stretch;gap:4px;overflow-y:auto;overflow-x:hidden;padding:14px 10px!important;border:0!important;border-radius:20px!important;background:linear-gradient(180deg,var(--sidebar),var(--sidebar2))!important;box-shadow:0 18px 45px rgba(50,41,35,.22)!important;z-index:25}
.nav .nav-brand{padding:8px 10px 14px;margin-bottom:2px;border-bottom:1px solid rgba(255,255,255,.12)}
.nav .nav-brand strong{display:block;color:#fff;font-size:15px}.nav .nav-brand span{display:block;color:var(--sidebarMuted);font-size:11px;margin-top:3px}
.nav .nav-label{color:var(--sidebarMuted);font-size:10px;text-transform:uppercase;letter-spacing:1.15px;font-weight:800;padding:13px 10px 5px}
.nav button{width:100%!important;text-align:left;background:transparent!important;color:var(--sidebarText)!important;border-radius:11px!important;padding:10px 11px!important;font-weight:650!important;font-size:13px!important;display:flex;align-items:center;gap:9px;border:1px solid transparent!important;transition:.15s ease}
.nav button:hover,.nav button:focus{background:rgba(255,255,255,.10)!important;border-color:rgba(255,255,255,.08)!important;transform:translateX(2px)}
.nav button::first-letter{font-size:15px}.nav #sair{margin-top:10px!important;background:rgba(255,255,255,.08)!important;color:#f3e8df!important}
#gm{box-shadow:var(--shadowSoft);border:1px solid var(--line)}
section>.c,.hero{box-shadow:var(--shadowSoft);border-color:#e8ddd3}
section>.c>h2{font-size:25px;letter-spacing:-.4px;margin-top:2px}
.hero{background:linear-gradient(135deg,#fff 0%,#f4ebe3 100%)}
.stat{grid-template-columns:repeat(4,minmax(150px,1fr));gap:12px}.stat div{background:linear-gradient(180deg,#fff,#fbf7f3);border-color:#e6dbd1;border-radius:15px;padding:16px;box-shadow:0 3px 10px rgba(62,49,39,.035)}
.stat div b{display:inline-block;margin-top:5px;color:#3a3029}.row{background:#fff;border-color:#e8ddd3;box-shadow:0 2px 7px rgba(60,48,39,.025)}
#p-inicio>.c:first-child{padding:22px}.progress{height:9px}.tag{font-weight:650}
.actions button{min-height:39px}.actions button.sec{background:#eee6de}
input,select,textarea{border-color:#dfd3c8;background:#fff;box-shadow:inset 0 1px 0 rgba(0,0,0,.015)}
input:focus,select:focus,textarea:focus{outline:2px solid #c8b5a4;outline-offset:1px;border-color:#b9a391}
button{transition:transform .12s ease,box-shadow .12s ease}button:active{transform:translateY(1px)}
#mobileMenuToggle{display:none;width:42px;height:42px;padding:0;border-radius:12px;font-size:20px;align-items:center;justify-content:center}
@media(max-width:960px){
 .w{padding:10px 10px 90px}.w>.c:first-child{top:6px;min-height:64px;padding:11px 12px}.w>.c:first-child>div:first-child>div:first-child{font-size:19px!important}
 #mobileMenuToggle{display:inline-flex}
 #app{padding-left:0}
 .nav{left:10px;top:82px;bottom:10px;width:min(82vw,300px);transform:translateX(-115%);transition:transform .22s ease;z-index:60!important;border-radius:18px!important}
 body.km-menu-open .nav{transform:translateX(0)}
 body.km-menu-open:after{content:'';position:fixed;inset:0;background:rgba(45,37,31,.32);z-index:50;backdrop-filter:blur(1px)}
 body.km-menu-open .nav{z-index:61!important}
 .stat{grid-template-columns:1fr 1fr}
}
@media(max-width:560px){.stat{grid-template-columns:1fr 1fr}.stat div{padding:13px}.stat div b{font-size:20px!important}.c{padding:14px}section>.c>h2{font-size:21px}.r,.r3{grid-template-columns:1fr}.actions button{flex:1 1 calc(50% - 8px)}}
@media print{#app{padding-left:0!important}.nav,#mobileMenuToggle{display:none!important}.w{max-width:none;padding:0}.w>.c:first-child{position:static;box-shadow:none}}
</style>`,'estilos');

must('<span id="status" class="tag">carregando...</span>',`<div style="display:flex;align-items:center;gap:8px"><span id="status" class="tag">carregando...</span><button id="mobileMenuToggle" type="button" aria-label="Abrir menu">☰</button></div>`,'toggle mobile');

const oldNav=`<div class="nav c">
      <button data-p="inicio">Início</button>
      <button data-p="viagem">Viagem</button>
      <button data-p="historico">Histórico</button><button data-p="agenda">Agenda</button><button data-p="rotas">Rotas</button>
      <button data-p="veiculos">Veículos</button>
      <button data-p="custos">Custos</button>
      <button data-p="equipe">Equipe</button>
      <button data-p="relatorios">Relatórios</button>
      <button data-p="ajuda">Ajuda</button><button data-p="perfil">Meu perfil</button><button data-p="painel">Painel ADM</button><button data-p="notificacoes">Avisos</button><button data-p="auditoria">Auditoria</button><button data-p="backup">Backup</button><button data-p="config">Configurações</button>
      <button id="sair" class="sec">Sair</button>
    </div>`;
const newNav=`<div class="nav c">
      <div class="nav-brand"><strong>Controle Fácil de KM</strong><span>Gestão de deslocamentos</span></div>
      <div class="nav-label">Visão geral</div>
      <button data-p="inicio">⌂  Início</button>
      <button data-p="painel">▦  Painel gerencial</button>
      <div class="nav-label">Deslocamentos</div>
      <button data-p="viagem">＋  Nova viagem</button>
      <button data-p="historico">◷  Histórico</button>
      <button data-p="agenda">▣  Agenda</button>
      <button data-p="rotas">⌁  Rotas frequentes</button>
      <div class="nav-label">Frota</div>
      <button data-p="veiculos">▱  Veículos</button>
      <button data-p="custos">$  Custos</button>
      <div class="nav-label">Gestão</div>
      <button data-p="equipe">♙  Equipe</button>
      <button data-p="relatorios">▤  Relatórios</button>
      <button data-p="notificacoes">●  Avisos</button>
      <div class="nav-label">Administração</div>
      <button data-p="auditoria">✓  Auditoria</button>
      <button data-p="backup">⇩  Backup</button>
      <button data-p="config">⚙  Configurações</button>
      <button data-p="perfil">◎  Meu perfil</button>
      <button data-p="ajuda">?  Ajuda</button>
      <button id="sair" class="sec">↪  Sair</button>
    </div>`;
must(oldNav,newNav,'menu lateral');

must("document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>show(b.dataset.p));",`document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{show(b.dataset.p);document.body.classList.remove('km-menu-open')});\nconst kmMenuToggle=document.getElementById('mobileMenuToggle');if(kmMenuToggle)kmMenuToggle.onclick=()=>document.body.classList.toggle('km-menu-open');\ndocument.addEventListener('click',e=>{if(document.body.classList.contains('km-menu-open')&&!e.target.closest('.nav')&&!e.target.closest('#mobileMenuToggle'))document.body.classList.remove('km-menu-open')});`,'menu mobile js');

fs.writeFileSync('dist/index.html',s);
console.log('Controle KM v103.0: corporate sidebar/dashboard visual restored with existing nude palette');
