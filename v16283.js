const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.88: authoritative real-click navigation + true desktop landscape dashboard.
(function(){
 const byId=id=>document.getElementById(id), api=()=>globalThis.mvNavigationV16282;
 const go=p=>{if(!p)return;api()?.navigate?.(p)};
 function killLegacyDock(){document.querySelectorAll('[id^="mvBottomV16249"]').forEach(x=>{x.style.setProperty('display','none','important');x.style.setProperty('pointer-events','none','important');x.setAttribute('aria-hidden','true')})}
 function clickAuthority(e){
   const t=e.target?.closest?.('#mvMenuToggleV16282,#mvBackV16282,#mvHomeV16282,#mvBottomDock85 [data-mv-dock],#app>.nav [data-p],[data-p-jump]');if(!t)return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
   if(t.id==='mvMenuToggleV16282'){document.body.classList.contains('mv-menu-open-v16282')?api()?.closeMenu?.():api()?.openMenu?.();return}
   if(t.id==='mvBackV16282'){api()?.back?.();return}
   if(t.id==='mvHomeV16282'){api()?.home?.();return}
   const dock=t.dataset.mvDock;if(dock){dock==='menu'?api()?.openMenu?.():go(dock);return}
   const p=t.dataset.p||t.dataset.pJump;if(p)go(p);
 }
 document.addEventListener('click',clickAuthority,true);
 function text(id,fallback='0'){const el=byId(id);return (el?.textContent||fallback).trim()||fallback}
 function makeHome(){
   const p=byId('p-inicio');if(!p)return;
   let home=byId('mvHome88');if(!home){
    home=document.createElement('div');home.id='mvHome88';
    home.innerHTML='<header class="mv-homehead88"><div><h1>Dashboard</h1><p>Visão geral da operação</p></div><button type="button" data-mv88="viagem">＋ Novo percurso</button></header>'+
      '<div class="mv-kpis88"><article><span>Quilômetros no mês</span><strong data-sync88="nkm">0 km</strong><small>Distância registrada</small></article><article><span>Despesas no mês</span><strong data-sync88="ndesp">R$ 0,00</strong><small>Custos lançados</small></article><article><span>Deslocamentos</span><strong data-sync88="nv">0</strong><small>Viagens registradas</small></article><article><span>Média por deslocamento</span><strong data-sync88="nmedia">0 km</strong><small>Eficiência do período</small></article></div>'+
      '<div class="mv-homegrid88"><section class="mv-panel88 mv-recent88"><div class="mv-paneltitle88"><div><h2>Atividade recente</h2><p>Últimos deslocamentos e compromissos</p></div><button type="button" data-mv88="historico">Ver viagens</button></div><div class="mv-empty88"><span>▤</span><b>Acompanhe seus deslocamentos</b><p>Os registros mais recentes aparecem aqui conforme a operação acontece.</p><button type="button" data-mv88="viagem">Registrar percurso</button></div></section><aside class="mv-panel88 mv-summary88"><div class="mv-paneltitle88"><div><h2>Resumo do mês</h2><p>Indicadores consolidados</p></div></div><div class="mv-summaryrows88"><div><span>Quilômetros</span><b data-sync88="nkm">0 km</b></div><div><span>Despesas</span><b data-sync88="ndesp">R$ 0,00</b></div><div><span>Deslocamentos</span><b data-sync88="nv">0</b></div></div><hr><h3>Acesso rápido</h3><div class="mv-quick88"><button type="button" data-mv88="agenda">▦ Agenda</button><button type="button" data-mv88="veiculos">▥ Frota</button><button type="button" data-mv88="custos">▣ Despesas</button><button type="button" data-mv88="relatorios">▧ Relatórios</button></div></aside></div>';
    p.insertAdjacentElement('afterbegin',home);
    p.querySelectorAll(':scope > *:not(#mvHome88)').forEach(x=>x.classList.add('mv-homelegacy88'));
   }
   home.querySelectorAll('[data-sync88]').forEach(x=>x.textContent=text(x.dataset.sync88,x.textContent));
 }
 document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-mv88]');if(!b)return;e.preventDefault();e.stopPropagation();go(b.dataset.mv88)},true);
 function desktopState(){document.body.classList.toggle('mv-desktop88',innerWidth>=900);killLegacyDock();makeHome()}
 [0,120,400,900,1800,3200].forEach(ms=>setTimeout(desktopState,ms));
 addEventListener('resize',()=>requestAnimationFrame(desktopState));
 globalThis.mvUiV16288={sync:desktopState};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.88 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.88 interaction authority + desktop landscape */
[id^="mvBottomV16249"]{display:none!important;pointer-events:none!important;visibility:hidden!important}
#mvTopNavV16282,#mvBottomDock85,#app>.nav{pointer-events:auto!important}#mvTopNavV16282{z-index:220!important}#mvBottomDock85{z-index:220!important}.mv-menu-open-v16282 #app>.nav{z-index:230!important}
.mv-homelegacy88{display:none!important}#mvHome88{display:block;width:100%;max-width:1320px;margin:0 auto;padding:18px 22px 34px}.mv-homehead88{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}.mv-homehead88 h1{font-size:22px;margin:0;color:#111827}.mv-homehead88 p{font-size:12px;color:#737e90;margin:3px 0 0}.mv-homehead88 button,.mv-paneltitle88 button,.mv-empty88 button{width:auto!important;min-height:36px!important;padding:0 14px!important;border-radius:6px!important;background:#0968e8!important;color:#fff!important;border:0!important;font-size:12px!important;font-weight:700!important}.mv-kpis88{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));background:#fff;border:1px solid #e1e6ed;border-radius:8px;overflow:hidden;margin-bottom:12px}.mv-kpis88 article{padding:15px 16px;border-right:1px solid #e1e6ed;display:grid;gap:4px}.mv-kpis88 article:last-child{border-right:0}.mv-kpis88 span{font-size:11px;color:#737e90}.mv-kpis88 strong{font-size:21px;color:#173f79}.mv-kpis88 small{font-size:10px;color:#9aa4b3}.mv-homegrid88{display:grid;grid-template-columns:minmax(0,1.75fr) minmax(300px,.75fr);gap:12px;align-items:start}.mv-panel88{background:#fff;border:1px solid #e1e6ed;border-radius:8px;padding:16px;box-shadow:0 1px 2px #10182808}.mv-paneltitle88{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.mv-paneltitle88 h2{font-size:14px;margin:0;color:#202b3c}.mv-paneltitle88 p{font-size:10px;color:#7d8796;margin:3px 0 0}.mv-paneltitle88 button{background:#fff!important;color:#0968e8!important;border:1px solid #cfd9e8!important}.mv-empty88{min-height:280px;border:1px dashed #d7dee8;border-radius:7px;display:grid;place-items:center;align-content:center;text-align:center;padding:28px;color:#6e7989}.mv-empty88 span{font-size:30px;color:#9aa9bc}.mv-empty88 b{color:#26354a;margin-top:7px}.mv-empty88 p{font-size:11px;max-width:420px;margin:5px 0 13px}.mv-summaryrows88{display:grid}.mv-summaryrows88>div{display:flex;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid #edf0f4}.mv-summaryrows88>div:last-child{border-bottom:0}.mv-summaryrows88 span{font-size:11px;color:#697486}.mv-summaryrows88 b{font-size:12px;color:#1c365d}.mv-summary88 hr{border:0;border-top:1px solid #edf0f4;margin:12px 0}.mv-summary88 h3{font-size:11px;color:#344257;margin:0 0 8px}.mv-quick88{display:grid;grid-template-columns:1fr 1fr;gap:7px}.mv-quick88 button{min-height:38px!important;border-radius:6px!important;background:#f7f9fc!important;color:#30425b!important;border:1px solid #dfe5ed!important;font-size:11px!important}
@media(min-width:900px){body.mv-desktop88 #app{padding-left:205px!important;min-height:100vh!important}body.mv-desktop88 #app>.nav{position:fixed!important;left:0!important;top:0!important;bottom:0!important;width:205px!important;height:100vh!important;display:flex!important;flex-direction:column!important;border-radius:0!important;margin:0!important;padding:0 8px 10px!important;background:#071a31!important;box-shadow:none!important}body.mv-desktop88 #mvBottomDock85{display:none!important}body.mv-desktop88 #mvMenuToggleV16282{display:none!important}body.mv-desktop88 #mvTopNavV16282{position:sticky!important;top:0!important;margin:0!important;border-radius:0!important;border:0!important;border-bottom:1px solid #e1e6ed!important;background:#fff!important;box-shadow:none!important;height:50px!important;padding:8px 20px!important}body.mv-desktop88 #app>section{max-width:none!important;margin:0!important;width:100%!important}body.mv-desktop88 #p-inicio{padding:0!important}body.mv-desktop88 #mvHome88{max-width:1440px!important}}
@media(max-width:899px){#mvHome88{padding:12px 10px 92px}.mv-homehead88 h1{font-size:19px}.mv-homehead88 p{font-size:10px}.mv-homehead88 button{font-size:11px;padding:0 10px!important}.mv-kpis88{grid-template-columns:repeat(2,minmax(0,1fr))}.mv-kpis88 article:nth-child(2){border-right:0}.mv-kpis88 article:nth-child(-n+2){border-bottom:1px solid #e1e6ed}.mv-homegrid88{grid-template-columns:1fr}.mv-empty88{min-height:190px}.mv-summary88{margin-bottom:10px}#mvBottomDock85{display:grid!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.88 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.88: real-click navigation and true desktop dashboard installed');
