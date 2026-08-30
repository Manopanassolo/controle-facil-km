const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.87: final reference fidelity pass across every module.
(function(){
  const byId=id=>document.getElementById(id);
  const meta={
    inicio:['Dashboard','Visão geral da operação e próximos compromissos'],
    viagem:['Novo percurso','Planeje, salve ou inicie um deslocamento'],
    historico:['Viagens','Histórico e acompanhamento dos deslocamentos'],
    agenda:['Agenda','Compromissos e viagens programadas'],
    veiculos:['Frota','Veículos, disponibilidade e quilometragem'],
    custos:['Despesas','Custos, categorias e comprovantes'],
    equipe:['Equipe','Usuários, funções e acessos'],
    relatorios:['Relatórios','Indicadores e desempenho operacional'],
    config:['Configurações','Preferências, políticas e parâmetros'],
    backup:['Backup / Restauração','Proteção e portabilidade dos dados'],
    auditoria:['Auditoria','Histórico de movimentações e conformidade'],
    documentos:['Documentos','Documentos da frota, motoristas e empresa'],
    sinistros:['Ocorrências','Registro e acompanhamento de ocorrências'],
    rotas:['Rotas','Rotas frequentes e planejamento'],
    painel:['Painel administrativo','Gestão da operação e alertas'],
    notificacoes:['Avisos','Central de notificações e pendências'],
    perfil:['Meu perfil','Dados pessoais e acesso'],
    ajuda:['Central de ajuda','Orientações de uso da Movvant'],
    recursos:['Recursos','Recursos disponíveis para sua assinatura'],
    assinatura:['Assinatura','Plano, limites e recursos contratados'],
    routeops:['Operação de rotas','Acompanhamento e execução em campo']
  };
  function pageKey(sec){return sec?.id?.replace(/^p-/,'')||''}
  function ensureHeader(sec){
    const key=pageKey(sec),m=meta[key];if(!m||key==='inicio')return;
    let h=sec.querySelector(':scope > .mv-pagehead87');
    if(!h){
      h=document.createElement('div');h.className='mv-pagehead87';
      h.innerHTML='<div class="mv-headcopy87"><button type="button" class="mv-headback87" aria-label="Voltar">←</button><div><h1></h1><p></p></div></div><div class="mv-headactions87"></div>';
      sec.insertAdjacentElement('afterbegin',h);
      h.querySelector('.mv-headback87').onclick=()=>globalThis.mvNavigationV16282?.back?.();
    }
    h.querySelector('h1').textContent=m[0];h.querySelector('p').textContent=m[1];
    const old=sec.querySelector(':scope > .c h2, :scope > .mv-surface84 h2');if(old)old.classList.add('mv-hide-legacy-title87');
  }
  function classify(){
    document.querySelectorAll('#app section').forEach(sec=>{sec.classList.add('mv-module87');ensureHeader(sec)});
    document.querySelectorAll('#app section>.c,#app section>.mv-surface84').forEach(c=>c.classList.add('mv-panel87'));
    document.querySelectorAll('#app section .row').forEach(r=>r.classList.add('mv-listrow87'));
    document.querySelectorAll('#app section .stat').forEach(r=>r.classList.add('mv-statgrid87'));
    document.querySelectorAll('#app section .actions').forEach(r=>r.classList.add('mv-actions87'));
    document.querySelectorAll('#app section h3').forEach(h=>h.classList.add('mv-sectiontitle87'));
    document.querySelectorAll('#app section .tag').forEach(t=>t.classList.add('mv-chip87'));
  }
  function special(){
    byId('p-historico')?.classList.add('mv-history87');
    byId('p-agenda')?.classList.add('mv-agenda87');
    byId('p-veiculos')?.classList.add('mv-fleet87');
    byId('p-custos')?.classList.add('mv-costs87');
    byId('p-documentos')?.classList.add('mv-docs87');
    byId('p-backup')?.classList.add('mv-backup87');
    byId('p-config')?.classList.add('mv-settings87');
    byId('p-painel')?.classList.add('mv-admin87');
    byId('p-relatorios')?.classList.add('mv-reports87');
    byId('p-auditoria')?.classList.add('mv-audit87');
    const h=byId('p-historico');if(h){h.querySelector('.r')?.classList.add('mv-filterbar87')}
    const a=byId('p-agenda');if(a){a.querySelector('.r3')?.classList.add('mv-filterbar87')}
    const v=byId('p-veiculos');if(v){v.querySelector('.r3,.r')?.classList.add('mv-filterbar87')}
    const c=byId('p-custos');if(c){c.querySelector('.r3,.r')?.classList.add('mv-filterbar87')}
  }
  function activePage(){
    const cur=document.body.dataset.mvPage||globalThis.mvNavigationV16282?.page||'inicio';
    document.querySelectorAll('#mvBottomDock85 [data-mv-dock]').forEach(b=>b.classList.toggle('active',b.dataset.mvDock===cur));
    document.querySelectorAll('#app>.nav [data-p]').forEach(b=>b.classList.toggle('mv-navactive87',b.dataset.p===cur));
  }
  function sync(){classify();special();activePage()}
  [0,180,500,1000,1800].forEach(ms=>setTimeout(sync,ms));
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-p],[data-p-jump],#mvBottomDock85,.mv-headback87'))setTimeout(sync,70)},true);
  globalThis.mvReferenceUiV16287={sync};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.87 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.87 final reference fidelity */
body.mv-reference-shell85{--mv87-blue:#0b66e4;--mv87-navy:#071b34;--mv87-bg:#f5f7fa;--mv87-card:#fff;--mv87-line:#e2e7ee;--mv87-text:#152033;--mv87-muted:#737d8c;--mv87-green:#198754;--mv87-red:#d9343b;--mv87-amber:#d99a11;background:var(--mv87-bg)!important}
.mv-module87{color:var(--mv87-text)}.mv-pagehead87{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px}.mv-headcopy87{display:flex;align-items:center;gap:10px}.mv-headcopy87>div{display:grid;gap:2px}.mv-pagehead87 h1{margin:0;font-size:20px;line-height:1.2;font-weight:760;color:#151d2d}.mv-pagehead87 p{margin:0;font-size:11px;color:var(--mv87-muted)}.mv-headback87{width:32px!important;height:32px!important;min-height:32px!important;padding:0!important;border-radius:6px!important;background:#fff!important;color:#26354a!important;border:1px solid var(--mv87-line)!important;font-size:17px!important}.mv-hide-legacy-title87{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important}
.mv-panel87{border:1px solid var(--mv87-line)!important;border-radius:7px!important;background:#fff!important;box-shadow:0 1px 2px #0a1f3b08!important;padding:14px!important;margin:0 0 10px!important}.mv-sectiontitle87{font-size:12px!important;font-weight:760!important;color:#263349!important;margin:15px 0 8px!important;text-transform:none!important;letter-spacing:0!important}.mv-listrow87{border:1px solid #e6eaf0!important;border-radius:6px!important;background:#fff!important;padding:11px 12px!important;margin:7px 0!important;box-shadow:none!important}.mv-listrow87:hover{border-color:#cfd8e6!important;background:#fbfcfe!important}.mv-actions87{gap:6px!important}.mv-actions87 button{min-height:34px!important;padding:7px 10px!important;font-size:11px!important}.mv-chip87{border-radius:999px!important;padding:4px 8px!important;font-size:10px!important;background:#eef3f8!important;color:#536176!important}.ok.mv-chip87{background:#e8f7ee!important;color:#167843!important}.warn.mv-chip87{background:#fff5dc!important;color:#9a6a00!important}.err.mv-chip87{background:#fdeaea!important;color:#ae2932!important}
.mv-filterbar87{background:#fafbfd!important;border:1px solid var(--mv87-line)!important;border-radius:6px!important;padding:9px!important;gap:8px!important;margin-bottom:10px!important}.mv-filterbar87 input,.mv-filterbar87 select{background:#fff!important}
.mv-statgrid87{gap:8px!important}.mv-statgrid87>div{background:#fff!important;border:1px solid var(--mv87-line)!important;border-radius:6px!important;padding:11px 12px!important}.mv-statgrid87>div b{color:#163b73!important}
.mv-history87 #hist,.mv-fleet87 #veicLista,.mv-costs87 #custosLista,.mv-audit87 #auditLista,.mv-docs87 [id*=Lista]{display:grid;gap:7px}.mv-history87 #detalheViagem{border-left:3px solid var(--mv87-blue)!important}.mv-agenda87 .mv-calendar,.mv-agenda87 [class*=calendar]{border:1px solid var(--mv87-line)!important;border-radius:7px!important;background:#fff!important}.mv-fleet87 img{border-radius:6px!important}.mv-docs87 .row{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important}.mv-backup87>.mv-panel87,.mv-settings87>.mv-panel87{max-width:900px!important;margin-left:auto!important;margin-right:auto!important}.mv-settings87 label{display:flex!important;align-items:center!important;gap:7px!important;padding:8px 0!important;border-bottom:1px solid #edf0f4!important}.mv-settings87 label:last-of-type{border-bottom:0!important}.mv-admin87 .stat,.mv-reports87 .stat{margin-bottom:12px!important}
#viagemAtiva.mv-active85{max-width:760px!important}.mv-active85 .mv-ref-fold85{background:#fff!important}.mv-active85 .mv-ref-fold85>summary{min-height:48px!important}.mv-active85 .mv-active-summary85{overflow:hidden!important}.mv-active85 .mv-active-summary85 .mv-metrics83{gap:0!important;border:1px solid var(--mv87-line)!important;border-radius:6px!important;overflow:hidden!important}.mv-active85 .mv-active-summary85 .mv-metrics83>div{border:0!important;border-right:1px solid var(--mv87-line)!important;border-radius:0!important}.mv-active85 .mv-active-summary85 .mv-metrics83>div:last-child{border-right:0!important}
@media(min-width:821px){.mv-module87{padding-top:14px!important}.mv-module87>.mv-pagehead87{max-width:1180px;margin-left:auto;margin-right:auto}.mv-module87>.mv-panel87{max-width:1180px;margin-left:auto!important;margin-right:auto!important}.mv-history87,.mv-agenda87,.mv-fleet87,.mv-costs87,.mv-docs87,.mv-backup87,.mv-settings87,.mv-admin87,.mv-reports87,.mv-audit87{max-width:1220px!important}.mv-dashboard85>.mv-panel87{max-width:none!important}.mv-reference-shell85 #app>.nav [data-p].mv-navactive87{background:var(--mv87-blue)!important;color:#fff!important}}
@media(max-width:820px){body.mv-reference-shell85{background:#f6f7f9!important}.mv-module87{padding:11px 10px 92px!important}.mv-pagehead87{margin:0 0 9px}.mv-pagehead87 h1{font-size:18px}.mv-pagehead87 p{font-size:10px}.mv-headback87{width:30px!important;height:30px!important;min-height:30px!important}.mv-panel87{border-radius:7px!important;padding:12px!important;margin-bottom:8px!important}.mv-filterbar87{grid-template-columns:1fr!important;padding:8px!important}.mv-statgrid87{grid-template-columns:repeat(2,minmax(0,1fr))!important}.mv-statgrid87>div{padding:10px!important}.mv-listrow87{padding:10px!important}.mv-sectiontitle87{margin-top:12px!important}.mv-docs87 .row{grid-template-columns:1fr!important}.mv-active85 .mv-active-summary85 .mv-metrics83{grid-template-columns:repeat(2,minmax(0,1fr))!important}.mv-active85 .mv-active-summary85 .mv-metrics83>div:nth-child(2){border-right:0!important}.mv-active85 .mv-active-summary85 .mv-metrics83>div:nth-child(-n+2){border-bottom:1px solid var(--mv87-line)!important}#mvBottomDock85{height:62px!important;padding:5px 7px max(5px,env(safe-area-inset-bottom))!important;border-top:1px solid #dde3eb!important;box-shadow:0 -4px 14px #14233a0c!important}#mvBottomDock85 button{gap:1px!important}#mvBottomDock85 button span{font-size:18px!important}#mvBottomDock85 button small{font-size:9px!important}#mvBottomDock85 button.active{color:var(--mv87-blue)!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.87 css anchor not found');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.87: final reference fidelity and cross-module consistency installed');
