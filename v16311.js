const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 const groups=[
  {label:'Visão geral',route:'inicio',items:[['inicio','Dashboard'],['painel','Painel ADM'],['relatorios','Relatórios']]},
  {label:'Operação',route:'viagem',items:[['viagem','Novo percurso'],['historico','Viagens'],['rotas','Rotas'],['agenda','Agenda']]},
  {label:'Gestão',route:'veiculos',items:[['veiculos','Frota'],['equipe','Equipe'],['custos','Despesas']]},
  {label:'Sistema',route:'config',items:[['notificacoes','Avisos'],['auditoria','Auditoria'],['backup','Backup'],['config','Configurações'],['perfil','Meu perfil'],['ajuda','Ajuda']]}
 ];
 function go(r){const old=[...document.querySelectorAll('#app>.nav [data-p]')].find(b=>b.dataset.p===r);if(old)old.click();else if(typeof globalThis.show==='function')globalThis.show(r);setTimeout(sync,40)}
 function markup(){return groups.map((g,i)=>'<div class="mv-menugroup140"><button class="mv-menutrigger140" type="button" data-mvgroup="'+i+'" data-mvroute-main="'+g.route+'">'+g.label+' <span>▾</span></button><div class="mv-submenu140">'+g.items.map(x=>'<button type="button" data-mvroute="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>').join('')}
 function ensure(){if(innerWidth<900)return;const n=document.getElementById('mvDesktopNav132');if(!n)return;if(!n.classList.contains('mv-grouped140')){n.classList.add('mv-grouped140');n.innerHTML='<div class="mv-navgroups140">'+markup()+'</div>';n.addEventListener('click',e=>{const b=e.target.closest('[data-mvroute]');if(b){go(b.dataset.mvroute);return}const t=e.target.closest('[data-mvroute-main]');if(t&&e.detail===0)go(t.dataset.mvrouteMain)})}}
 function current(){const h=location.hash.match(/(?:^#|[&#])p=([^&]+)/)?.[1];if(h)return h;const v=[...document.querySelectorAll('#app [id^="p-"]')].find(p=>{const c=getComputedStyle(p),r=p.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&r.height>20&&r.width>20});return v?.id?.replace(/^p-/,'')||'inicio'}
 function sync(){if(innerWidth<900)return;ensure();const r=current();document.querySelectorAll('.mv-menugroup140').forEach((g,i)=>{const hit=groups[i].items.some(x=>x[0]===r);g.classList.toggle('active',hit);g.querySelectorAll('[data-mvroute]').forEach(b=>b.classList.toggle('active',b.dataset.mvroute===r))})}
 function boot(){ensure();sync()} if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();[80,300,900].forEach(x=>setTimeout(boot,x));addEventListener('hashchange',()=>setTimeout(sync,30));addEventListener('resize',boot);
})();`;
s=s.replace('carga();',js+'\ncarga();');
const css=`
@media(min-width:900px){
 #mvDesktopNav132.mv-grouped140{display:flex!important;align-items:stretch!important;padding:0 22px!important;overflow:visible!important;background:#fff!important}
 #mvDesktopNav132.mv-grouped140 .mv-navgroups140{width:100%!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important;overflow:visible!important}
 .mv-menugroup140{position:relative!important;min-width:0!important;display:flex!important;align-items:stretch!important}
 .mv-menutrigger140{width:100%!important;border:0!important;background:transparent!important;color:#334155!important;font-size:12px!important;font-weight:750!important;cursor:pointer!important;padding:0 14px!important;border-radius:7px!important;transition:background .16s ease,color .16s ease!important;white-space:nowrap!important}
 .mv-menutrigger140 span{font-size:10px!important;margin-left:5px!important}
 .mv-menugroup140:hover .mv-menutrigger140,.mv-menugroup140:focus-within .mv-menutrigger140,.mv-menugroup140.active .mv-menutrigger140{background:#e9f3ff!important;color:#0867c7!important}
 .mv-submenu140{position:absolute!important;z-index:99999!important;top:calc(100% - 1px)!important;left:0!important;min-width:220px!important;width:max-content!important;max-width:300px!important;background:#fff!important;border:1px solid #d9e2ec!important;border-radius:9px!important;box-shadow:0 14px 34px rgba(15,42,68,.16)!important;padding:7px!important;display:none!important}
 .mv-menugroup140:hover .mv-submenu140,.mv-menugroup140:focus-within .mv-submenu140{display:grid!important;gap:3px!important}
 .mv-menugroup140:last-child .mv-submenu140{left:auto!important;right:0!important}
 .mv-submenu140 button{display:block!important;width:100%!important;text-align:left!important;border:0!important;background:#fff!important;color:#334155!important;padding:9px 11px!important;border-radius:6px!important;font-size:12px!important;font-weight:650!important;cursor:pointer!important;white-space:nowrap!important}
 .mv-submenu140 button:hover,.mv-submenu140 button:focus,.mv-submenu140 button.active{background:#edf6ff!important;color:#0867c7!important;outline:none!important}
}
`;
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.40 grouped hover navigation');
