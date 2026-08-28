const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const must=(a,b,label)=>{if(!s.includes(a))throw new Error('v104.0 anchor ausente: '+label);s=s.replace(a,b)};
must('Gestão de deslocamentos · versão 103.0','Gestão de deslocamentos · versão 104.0','versao');
must('<span class="tag">103.0</span>','<span class="tag">104.0</span>','ajuda');
must("checks.push(['Versão','103.0']);","checks.push(['Versão','104.0']);",'diagnostico');

must('</style>',`\n/* v104.0 — retorno à identidade visual azul do layout clássico */
:root{--bg:#f4f6fa;--card:#fff;--line:#dce1ea;--ink:#102451;--muted:#737b8b;--brand:#09246f;--soft:#eef1f7;--ok:#267054;--err:#a34b42;--warn:#9a6923;--sidebar:#09246f;--sidebar2:#123d91;--sidebarText:#fff;--sidebarMuted:#d8e1f5;--shadow:0 8px 24px rgba(17,38,81,.07);--shadowSoft:0 3px 12px rgba(17,38,81,.05)}
body{background:#f4f6fa;color:var(--ink)}
.w{max-width:1500px;padding:0 18px 32px}
.w>.c:first-child{margin:0 -18px 18px;border:0;border-radius:0;min-height:86px;padding:16px 24px;position:sticky;top:0;z-index:40;background:#fff;box-shadow:0 2px 10px rgba(16,36,81,.07)}
.w>.c:first-child>div:first-child>div:first-child{font-size:25px!important;color:#102451;line-height:1.05}
#status{background:#f7c928;color:#102451;font-weight:800}
#app{padding-left:0}
.nav{position:sticky!important;left:auto;top:92px;bottom:auto;width:100%;height:auto;display:flex!important;flex-direction:row;align-items:center;gap:5px;overflow-x:auto;overflow-y:hidden;padding:12px 16px!important;margin:0 0 20px!important;border:0!important;border-radius:20px!important;background:linear-gradient(110deg,#08236c,#123d91)!important;box-shadow:0 8px 24px rgba(9,36,111,.18)!important;z-index:35}
.nav .nav-brand,.nav .nav-label{display:none}.nav button{width:auto!important;flex:0 0 auto;text-align:center;background:transparent!important;color:#fff!important;border-radius:12px!important;padding:12px 15px!important;font-size:13px!important;border:1px solid transparent!important;white-space:nowrap}.nav button:hover,.nav button:focus{background:rgba(255,255,255,.12)!important;transform:none}.nav #sair{margin:0!important;background:rgba(255,255,255,.1)!important}
.c{border-color:var(--line);box-shadow:var(--shadowSoft)}
section>.c{border-radius:22px;padding:24px;margin:16px 0}section>.c>h2{font-size:30px;color:#102451}
input,select,textarea{border-color:#d9dee8;color:#102451;background:#fff}input:focus,select:focus,textarea:focus{outline:2px solid #3159a5;border-color:#3159a5}
button{background:#09246f}.sec{background:#eef1f7;color:#102451}.tag{background:#e9eef8;color:#102451}
#p-inicio>.c:first-child{padding:24px;border-radius:24px;background:#fff}
#p-inicio>.c:first-child h2{font-size:28px;margin-bottom:4px}
#p-inicio>.c:first-child>button[data-p-jump="viagem"]{display:block;width:100%;max-width:none;min-height:72px;border-radius:18px;background:#09246f;font-size:19px;margin:22px 0!important}
#p-inicio>.c:first-child>h3{color:#183c7e;letter-spacing:3px;font-size:14px;text-transform:uppercase}
#p-inicio .stat{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:0;background:linear-gradient(145deg,#09246f,#15459b);border-radius:24px;padding:26px;color:#fff;margin-top:10px;box-shadow:0 12px 28px rgba(9,36,111,.16)}
#p-inicio .stat div{background:transparent;border:0;border-right:1px solid rgba(255,255,255,.16);border-radius:0;box-shadow:none;padding:8px 20px;color:#fff}#p-inicio .stat div:last-child{border-right:0}#p-inicio .stat .muted{color:#dce5f7}#p-inicio .stat b{color:#fff!important;font-size:30px!important}
#p-inicio>.c:first-child>.r{gap:12px}#p-inicio>.c:first-child>.r .row{border-radius:16px;background:#f8f9fc}
.hero{background:#fff!important;border:1px solid var(--line)!important;border-radius:24px!important}.hero>h3{font-size:28px;color:#102451;margin:6px 0 18px}.hero:before{content:'DASHBOARD';display:block;color:#244b8d;font-size:13px;font-weight:800;letter-spacing:3px;margin-bottom:8px}
.row{background:#fff;border-color:#e0e4ec;border-radius:16px}.progress>i{background:#174695}
#p-agenda>.c,#p-relatorios>.c{border-radius:24px}
.actions button{min-height:42px;border-radius:12px}
#mobileMenuToggle{background:#fff;color:#102451;border:1px solid #cfd6e3}
@media(max-width:960px){.w{padding:0 0 30px}.w>.c:first-child{margin:0;padding:14px 16px;min-height:76px}.w>.c:first-child>div:first-child>div:first-child{font-size:22px!important}#app{padding:0}.nav{position:sticky!important;top:76px;left:auto;bottom:auto;width:calc(100% - 32px);margin:12px 16px 18px!important;transform:none!important;border-radius:20px!important;padding:10px 12px!important}.nav button{padding:11px 13px!important}.nav .nav-brand,.nav .nav-label{display:none}#mobileMenuToggle{display:none!important}section{padding:0 0}section>.c{margin:14px 0;border-radius:22px;padding:20px 16px}#p-inicio .stat{grid-template-columns:1fr 1fr;padding:20px 14px}#p-inicio .stat div{border-right:0;border-bottom:1px solid rgba(255,255,255,.14);padding:14px 12px}#p-inicio .stat div:nth-last-child(-n+2){border-bottom:0}#p-inicio .stat b{font-size:27px!important}}
@media(max-width:560px){.w>.c:first-child{padding:12px 14px}.w>.c:first-child>div:first-child>div:first-child{font-size:21px!important}.nav{top:72px;width:calc(100% - 24px);margin:10px 12px 16px!important}.nav button{font-size:12px!important;padding:10px 12px!important}section>.c{padding:20px 16px}section>.c>h2{font-size:27px}.hero>h3{font-size:27px}#p-inicio>.c:first-child>button[data-p-jump="viagem"]{min-height:64px}.r,.r3{grid-template-columns:1fr}}
@media print{.nav{display:none!important}.w>.c:first-child{position:static}.w{padding:0}}
</style>`,'estilos');

fs.writeFileSync('dist/index.html',s);
console.log('Controle KM v104.0: classic blue visual hierarchy restored');
