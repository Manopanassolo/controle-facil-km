const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.85: reference-aligned application shell, dashboard and module presentation.
(function(){
  const byId=id=>document.getElementById(id);
  const navMap={inicio:['⌂','Dashboard'],viagem:['↗','Novo percurso'],historico:['▤','Viagens'],custos:['▣','Despesas'],veiculos:['▥','Frota'],agenda:['▦','Agenda'],equipe:['♙','Equipe'],relatorios:['▧','Relatórios'],config:['⚙','Configurações'],backup:['↻','Backup'],auditoria:['✓','Auditoria'],rotas:['⌁','Rotas'],ajuda:['?','Ajuda'],perfil:['●','Meu perfil'],painel:['◇','Painel ADM'],notificacoes:['!','Avisos'],recursos:['＋','Recursos'],assinatura:['★','Assinatura']};
  const core=['inicio','historico','agenda','veiculos'];
  function renameNav(){
    document.querySelectorAll('#app .nav [data-p]').forEach(b=>{
      const x=navMap[b.dataset.p];if(!x)return;
      b.innerHTML='<span class="mv-nav-icon85">'+x[0]+'</span><span>'+x[1]+'</span>';
      b.title=x[1];
    });
    const sair=byId('sair');if(sair&&!sair.dataset.mv85){sair.dataset.mv85='1';sair.innerHTML='<span class="mv-nav-icon85">↪</span><span>Sair</span>'}
  }
  function brand(){
    const app=byId('app'),nav=document.querySelector('#app .nav');if(!app||!nav)return;
    let b=byId('mvBrand85');if(!b){b=document.createElement('div');b.id='mvBrand85';b.innerHTML='<div class="mv-brandmark85">M</div><div><b>Movvant</b><small>Inteligência comercial em campo</small></div>';nav.insertAdjacentElement('afterbegin',b)}
    let user=byId('mvSideUser85');if(!user){user=document.createElement('div');user.id='mvSideUser85';user.innerHTML='<span class="mv-avatar85">●</span><div><b>Conta Movvant</b><small>Gestão de deslocamentos</small></div>';nav.appendChild(user)}
  }
  function bottomDock(){
    if(byId('mvBottomDock85'))return;
    const app=byId('app');if(!app)return;
    const d=document.createElement('nav');d.id='mvBottomDock85';d.setAttribute('aria-label','Navegação principal móvel');
    const labels={inicio:['⌂','Início'],historico:['▤','Viagens'],agenda:['▦','Agenda'],veiculos:['▥','Frota']};
    core.forEach(p=>{const b=document.createElement('button');b.type='button';b.dataset.mvDock=p;b.innerHTML='<span>'+labels[p][0]+'</span><small>'+labels[p][1]+'</small>';b.onclick=()=>globalThis.mvNavigationV16282?.navigate?.(p);d.appendChild(b)});
    const m=document.createElement('button');m.type='button';m.dataset.mvDock='menu';m.innerHTML='<span>☰</span><small>Menu</small>';m.onclick=()=>globalThis.mvNavigationV16282?.openMenu?.();d.appendChild(m);app.appendChild(d)
  }
  function sectionHead(){
    document.querySelectorAll('#app section').forEach(sec=>{
      const page=sec.id?.replace(/^p-/,'');if(!page)return;
      const first=sec.querySelector(':scope > .c, :scope > .mv-surface84');if(!first)return;
      const h=first.querySelector('h2');if(h){
        const x=navMap[page];if(x&&page!=='inicio')h.textContent=x[1];
        h.classList.add('mv-ref-title85');
      }
    });
    const p=byId('p-inicio');if(p){
      let hd=byId('mvDashboardHead85');if(!hd){hd=document.createElement('div');hd.id='mvDashboardHead85';hd.className='mv-pagehead85';hd.innerHTML='<div><h1>Dashboard</h1><span>Visão geral da operação</span></div><button type="button" data-mv-new85>＋ Novo percurso</button>';p.insertAdjacentElement('afterbegin',hd);hd.querySelector('[data-mv-new85]').onclick=()=>globalThis.mvNavigationV16282?.navigate?.('viagem')}
    }
  }
  function dashboard(){
    const p=byId('p-inicio');if(!p)return;
    p.classList.add('mv-dashboard85');
    const first=p.querySelector(':scope > .c:not(#onboard):not(#unidade):not(#convitePendente)');if(first)first.classList.add('mv-dashboard-main85');
    const stat=p.querySelector('.stat');if(stat){stat.classList.add('mv-kpis85');stat.querySelectorAll(':scope>div').forEach((d,i)=>d.dataset.kpi=String(i+1))}
    const resumo=[byId('nkm'),byId('ndesp'),byId('nv'),byId('nmedia')];resumo.forEach(x=>x?.closest('div')?.classList.add('mv-kpi-card85'));
    const quick=[...p.querySelectorAll('.c')].find(c=>/Ações rápidas/i.test(c.textContent||''));if(quick)quick.classList.add('mv-quick85');
    const hero=p.querySelector('.hero');if(hero)hero.classList.add('mv-manager85');
  }
  function forms(){
    const trip=byId('novaViagem');if(trip){trip.classList.add('mv-formpage85');const h=trip.querySelector('h2');if(h)h.textContent='Novo percurso'}
    document.querySelectorAll('#app input,#app select,#app textarea').forEach(x=>x.classList.add('mv-control85'));
    document.querySelectorAll('#app button:not(#mvBottomDock85 button)').forEach(x=>x.classList.add('mv-btn85'));
    document.querySelectorAll('#app section .c,#app section .row').forEach(x=>x.classList.add('mv-ref-card85'));
  }
  function active(){
    const c=byId('viagemAtiva');if(!c)return;c.classList.add('mv-active85');
    const sum=byId('mvActiveRouteSummaryV16283');if(sum)sum.classList.add('mv-active-summary85');
    c.querySelectorAll('.mv-fold84').forEach(x=>x.classList.add('mv-ref-fold85'));
  }
  function desktopShell(){document.body.classList.add('mv-reference-shell85')}
  function activeDock(){const cur=document.body.dataset.mvPage||globalThis.mvNavigationV16282?.page||'';document.querySelectorAll('#mvBottomDock85 [data-mv-dock]').forEach(b=>b.classList.toggle('active',b.dataset.mvDock===cur))}
  function sync(){desktopShell();brand();renameNav();bottomDock();sectionHead();dashboard();forms();active();activeDock()}
  [0,160,420,900,1800].forEach(ms=>setTimeout(sync,ms));
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-p],[data-p-jump],#mvBottomDock85'))setTimeout(sync,80)},true);
  window.addEventListener('popstate',()=>setTimeout(sync,30));
  globalThis.mvReferenceUiV16285={sync};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.85 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.85 approved-reference visual system */
:root{--mv85-navy:#061a33;--mv85-navy2:#09284d;--mv85-blue:#0866e8;--mv85-blue2:#0b6df1;--mv85-bg:#f5f7fa;--mv85-card:#fff;--mv85-line:#e3e8ef;--mv85-text:#172033;--mv85-muted:#6d7788;--mv85-green:#179d55;--mv85-red:#df2f37;--mv85-amber:#d99400}
body.mv-reference-shell85{background:var(--mv85-bg)!important;color:var(--mv85-text)!important;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif!important}.mv-reference-shell85>.w{max-width:none!important;margin:0!important;padding:0!important;min-height:100vh!important}.mv-reference-shell85>.w>div.c:first-child{display:none!important}
#app{min-height:100vh!important}.mv-ref-card85,.mv-surface84{background:#fff!important;border:1px solid var(--mv85-line)!important;border-radius:8px!important;box-shadow:0 1px 2px #0b1f3a08!important}.mv-ref-card85{padding:16px!important}.mv-ref-title85{font-size:20px!important;line-height:1.25!important;font-weight:750!important;color:#111827!important;margin:0 0 18px!important}.muted{color:var(--mv85-muted)!important}
.mv-pagehead85{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 14px}.mv-pagehead85 h1{font-size:22px;margin:0;color:#111827}.mv-pagehead85 span{display:block;font-size:12px;color:var(--mv85-muted);margin-top:3px}.mv-pagehead85 button{width:auto!important;min-height:38px!important;padding:0 15px!important;background:var(--mv85-blue)!important;border-radius:6px!important}
.mv-control85{border:1px solid #d8dee8!important;border-radius:6px!important;background:#fff!important;color:#222b3a!important;min-height:40px!important;padding:9px 11px!important;box-shadow:none!important}.mv-control85:focus{outline:none!important;border-color:#3c8bf2!important;box-shadow:0 0 0 3px #0866e812!important}.mv-btn85{border-radius:6px!important;min-height:40px!important;font-weight:650!important;box-shadow:none!important}.mv-btn85:not(.sec):not(.danger){background:var(--mv85-blue)!important;color:#fff!important}.mv-btn85.sec{background:#fff!important;color:#314158!important;border:1px solid #d7dee8!important}.mv-btn85.danger{background:var(--mv85-red)!important}
#mvBrand85{display:flex;align-items:center;gap:9px;padding:18px 14px 14px;color:#fff;border-bottom:1px solid #ffffff18;margin-bottom:8px}#mvBrand85>div:last-child{display:grid;min-width:0}#mvBrand85 b{font-size:14px;letter-spacing:.01em}#mvBrand85 small{font-size:9px;color:#a9b9cb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mv-brandmark85{width:29px;height:29px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--mv85-blue);font-weight:900;font-size:14px}.mv-nav-icon85{width:19px;display:inline-grid!important;place-items:center;font-size:13px;font-weight:800}
#mvSideUser85{margin-top:auto;padding:14px;display:flex;gap:9px;align-items:center;border-top:1px solid #ffffff18;color:#fff}#mvSideUser85>div{display:grid}#mvSideUser85 b{font-size:11px}#mvSideUser85 small{font-size:9px;color:#99abc0}.mv-avatar85{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:#fff;color:#6c879f;font-size:8px}
.mv-dashboard85 .mv-dashboard-main85{margin-top:0!important}.mv-dashboard85 .mv-kpis85{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:0!important;border:1px solid var(--mv85-line);border-radius:7px;overflow:hidden}.mv-dashboard85 .mv-kpis85>div{border:0!important;border-right:1px solid var(--mv85-line)!important;border-radius:0!important;padding:13px 14px!important;background:#fff!important}.mv-dashboard85 .mv-kpis85>div:last-child{border-right:0!important}.mv-dashboard85 .mv-kpis85 .muted{font-size:11px!important}.mv-dashboard85 .mv-kpis85 b{font-size:20px!important;color:#163c75!important}.mv-dashboard85 h3{font-size:13px!important;color:#273448!important}.mv-dashboard85 .hero{background:#fff!important}.mv-dashboard85 .row{border-radius:7px!important}.mv-quick85 .actions button{font-size:12px!important}.mv-manager85{background:#fff!important}
.mv-formpage85{max-width:760px!important;margin-left:auto!important;margin-right:auto!important}.mv-formpage85>.r,.mv-formpage85>.r3{gap:12px!important}.mv-formpage85 textarea{min-height:72px!important}.mv-plan-hint84{border-radius:7px!important;background:#f6f9fd!important;border-color:#e2e8f0!important}.mv-save84{border-radius:6px!important;background:#fff!important;color:var(--mv85-blue)!important;border-color:var(--mv85-blue)!important}
.mv-active85{max-width:860px!important;margin-left:auto!important;margin-right:auto!important;background:transparent!important;padding:0!important}.mv-active-summary85{border-radius:8px!important;box-shadow:none!important;border:1px solid var(--mv85-line)!important}.mv-active-summary85 .mv-live83{background:#e8f7ee;padding:5px 8px;border-radius:4px;color:#15824a!important;width:max-content}.mv-active-summary85 .mv-metrics83>div{border-radius:6px!important;background:#fff!important;border:1px solid var(--mv85-line)!important}.mv-ref-fold85{border-radius:8px!important;border-color:var(--mv85-line)!important}.mv-ref-fold85>summary{padding:14px 15px!important}.mv-ref-fold85[open]>summary{background:#f8fafc!important}
#mvBottomDock85{display:none}
@media(min-width:821px){
  #app{padding-left:178px!important}.mv-reference-shell85 #app>.nav{position:fixed!important;inset:0 auto 0 0!important;width:178px!important;height:100vh!important;z-index:100!important;display:flex!important;flex-direction:column!important;gap:2px!important;overflow-y:auto!important;padding:0 7px 8px!important;margin:0!important;border:0!important;border-radius:0!important;background:var(--mv85-navy)!important;box-shadow:none!important}.mv-reference-shell85 #app>.nav button{display:flex!important;align-items:center!important;gap:7px!important;width:100%!important;min-height:35px!important;padding:7px 9px!important;border:0!important;border-radius:5px!important;background:transparent!important;color:#c6d2df!important;text-align:left!important;font-size:11px!important;font-weight:520!important;white-space:nowrap!important}.mv-reference-shell85 #app>.nav button:hover{background:#0d315b!important;color:#fff!important}.mv-reference-shell85 #app>.nav [data-p].mv-current-v16282{background:var(--mv85-blue)!important;color:#fff!important;outline:0!important}.mv-reference-shell85 #app>.nav #sair{margin-top:3px!important;color:#c6d2df!important}.mv-reference-shell85 #app>.nav.mv-nav-collapsed-v16282{display:flex!important}.mv-reference-shell85 .mv-topnav-v16282{position:sticky!important;top:0!important;z-index:70!important;margin:0!important;border:0!important;border-bottom:1px solid var(--mv85-line)!important;border-radius:0!important;background:#fff!important;color:#263246!important;box-shadow:none!important;padding:8px 20px!important;height:50px!important;grid-template-columns:36px 36px minmax(0,1fr)!important}.mv-reference-shell85 .mv-topnav-v16282 button{width:34px!important;height:32px!important;min-height:32px!important;background:#fff!important;color:#44536a!important;border:1px solid #e0e5ec!important;border-radius:5px!important;font-size:17px!important}.mv-reference-shell85 #mvPageTitleV16282{color:#1f2937!important;font-size:13px!important}.mv-reference-shell85 #app>section{padding:16px 20px 28px!important;max-width:1360px!important;margin:0 auto!important}.mv-dashboard85{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(280px,.8fr);gap:12px;align-items:start}.mv-dashboard85>.mv-pagehead85{grid-column:1/-1}.mv-dashboard85>.mv-dashboard-main85{grid-column:1}.mv-dashboard85>.c:not(.mv-dashboard-main85):not(.hide),.mv-dashboard85>.mv-surface84:not(.mv-dashboard-main85):not(.hide){grid-column:auto}.mv-dashboard85>.hero{grid-column:1}.mv-dashboard85>#resumoAtiva{grid-column:1/-1}.mv-dashboard85>#onboard,.mv-dashboard85>#unidade,.mv-dashboard85>#convitePendente{grid-column:1/-1}
}
@media(max-width:820px){
  body.mv-reference-shell85{padding-bottom:66px!important}.mv-reference-shell85>.w{padding:0!important}.mv-reference-shell85 #app{padding-bottom:70px!important}.mv-reference-shell85 .mv-topnav-v16282{position:sticky!important;top:0!important;margin:0!important;border:0!important;border-bottom:1px solid var(--mv85-line)!important;border-radius:0!important;background:#fff!important;box-shadow:none!important;color:#1f2937!important;padding:7px 10px!important;height:48px!important;grid-template-columns:36px 36px minmax(0,1fr)!important}.mv-reference-shell85 #mvMenuToggleV16282{display:none!important}.mv-reference-shell85 .mv-topnav-v16282 button{width:34px!important;height:32px!important;min-height:32px!important;background:#fff!important;color:#405068!important;border:1px solid #dfe5ec!important;border-radius:5px!important;font-size:17px!important}.mv-reference-shell85 #mvPageTitleV16282{color:#111827!important;font-size:14px!important}.mv-reference-shell85 #app>section{padding:12px 12px 18px!important}.mv-reference-shell85 #app>.nav{left:12px!important;right:12px!important;top:auto!important;bottom:66px!important;max-height:calc(100dvh - 86px)!important;border-radius:8px!important;background:var(--mv85-navy)!important;padding:10px!important;grid-template-columns:1fr 1fr!important;box-shadow:0 16px 45px #061a3366!important}.mv-reference-shell85 #app>.nav button{background:#0d315b!important;color:#d9e3ee!important;border:0!important;border-radius:5px!important;min-height:39px!important;font-size:11px!important}.mv-reference-shell85 #app>.nav [data-p].mv-current-v16282{background:var(--mv85-blue)!important;color:#fff!important;outline:0!important}#mvBrand85,#mvSideUser85{grid-column:1/-1}.mv-dashboard85 .mv-kpis85{grid-template-columns:1fr 1fr!important}.mv-dashboard85 .mv-kpis85>div:nth-child(2){border-right:0!important}.mv-dashboard85 .mv-kpis85>div:nth-child(-n+2){border-bottom:1px solid var(--mv85-line)!important}.mv-pagehead85{margin-bottom:10px}.mv-pagehead85 h1{font-size:20px}.mv-pagehead85 button{font-size:11px!important;padding:0 11px!important}.mv-ref-card85{padding:13px!important;border-radius:7px!important}.mv-ref-title85{font-size:18px!important;margin-bottom:14px!important}.mv-formpage85{max-width:none!important}.mv-formpage85 .r,.mv-formpage85 .r3{grid-template-columns:1fr!important}.mv-active-summary85 .mv-metrics83{grid-template-columns:1fr 1fr!important}#mvBottomDock85{position:fixed;left:0;right:0;bottom:0;z-index:95;height:62px;display:grid!important;grid-template-columns:repeat(5,1fr);background:#fff;border-top:1px solid #dfe5ec;padding:5px 5px calc(5px + env(safe-area-inset-bottom));box-shadow:0 -4px 16px #10233f0b}#mvBottomDock85 button{border:0!important;background:#fff!important;color:#657184!important;min-height:50px!important;padding:3px 1px!important;border-radius:5px!important;display:grid!important;place-items:center!important;gap:0!important;font-weight:600!important}#mvBottomDock85 button span{font-size:16px;line-height:18px}#mvBottomDock85 button small{font-size:9px}#mvBottomDock85 button.active{color:var(--mv85-blue)!important}#mvBottomDock85 button[data-mv-dock=menu]{color:#344054!important}
}
`;
if(!s.includes('</style>'))throw new Error('v162.85 css anchor not found');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.85: approved-reference shell, dashboard and responsive module layout installed');
