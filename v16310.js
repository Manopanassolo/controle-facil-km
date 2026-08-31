const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 const primary=[['inicio','Dashboard'],['painel','Painel ADM'],['viagem','Novo percurso'],['historico','Viagens'],['agenda','Agenda'],['rotas','Rotas'],['veiculos','Frota'],['custos','Despesas']];
 const more=[['equipe','Equipe'],['relatorios','Relatórios'],['notificacoes','Avisos'],['auditoria','Auditoria'],['backup','Backup'],['config','Configurações'],['perfil','Meu perfil'],['ajuda','Ajuda']];
 const headerHtml='<div class="mv-dbrand132"><span class="mv-dmark132">M</span><span><strong>Movvant</strong><small>INTELIGÊNCIA COMERCIAL EM CAMPO</small></span></div><div id="mvDesktopTitle132">Dashboard</div><button class="mv-dbell132" type="button" aria-label="Notificações">●</button>';
 function btn(r,l){return '<button type="button" data-mvroute="'+r+'">'+l+'</button>'}
 function go(r){const old=[...document.querySelectorAll('#app>.nav [data-p]')].find(b=>b.dataset.p===r);if(old)old.click();else if(typeof globalThis.show==='function')globalThis.show(r);setTimeout(sync,40)}
 function ensureHeader(){if(innerWidth<900)return;let h=document.getElementById('mvDesktopHeader132');if(!h){h=document.createElement('div');h.id='mvDesktopHeader132';document.body.appendChild(h)}if(!h.querySelector('.mv-dbrand132')||!h.querySelector('#mvDesktopTitle132'))h.innerHTML=headerHtml;h.style.display='grid';h.style.visibility='visible';h.style.opacity='1';h.style.background='#082b50'}
 function ensureNav(){if(innerWidth<900)return;let n=document.getElementById('mvDesktopNav132');if(!n){n=document.createElement('nav');n.id='mvDesktopNav132';document.body.appendChild(n)}if(!n.querySelector('[data-mvroute="inicio"]')||n.querySelectorAll('[data-mvroute]').length<16)n.innerHTML='<div class="mv-dprimary132">'+primary.map(x=>btn(x[0],x[1])).join('')+'</div><div class="mv-dmore132"><button id="mvMore132" type="button">Mais ▾</button><div id="mvMoreMenu132">'+more.map(x=>btn(x[0],x[1])).join('')+'</div></div>';
  if(!n.dataset.mv16339){n.dataset.mv16339='1';n.addEventListener('click',e=>{const r=e.target.closest('[data-mvroute]');if(r){go(r.dataset.mvroute);document.getElementById('mvMoreMenu132')?.classList.remove('open');return}if(e.target.closest('#mvMore132')){e.stopPropagation();document.getElementById('mvMoreMenu132')?.classList.toggle('open')}});document.addEventListener('click',e=>{if(!e.target.closest('#mvDesktopNav132'))document.getElementById('mvMoreMenu132')?.classList.remove('open')})}}
 function routeFromUrl(){return location.hash.match(/(?:^#|[&#])p=([^&]+)/)?.[1]||new URLSearchParams(location.search).get('p')||''}
 function normalizeLanding(){if(innerWidth<900)return;const explicit=routeFromUrl();if(explicit)return;if(sessionStorage.getItem('mv16339Landing')==='1')return;sessionStorage.setItem('mv16339Landing','1');go('inicio')}
 function current(){const explicit=routeFromUrl();if(explicit)return explicit;const v=[...document.querySelectorAll('#app [id^="p-"]')].find(p=>{const c=getComputedStyle(p),r=p.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&r.height>20&&r.width>20});return v?.id?.replace(/^p-/,'')||'inicio'}
 function sync(){if(innerWidth<900)return;ensureHeader();ensureNav();const r=current(),all=[...primary,...more],label=all.find(x=>x[0]===r)?.[1]||'Dashboard';const t=document.getElementById('mvDesktopTitle132');if(t)t.textContent=label;document.querySelectorAll('#mvDesktopNav132 [data-mvroute]').forEach(b=>b.classList.toggle('active',b.dataset.mvroute===r))}
 function boot(){if(innerWidth<900)return;document.body.classList.add('mv-web139');ensureHeader();ensureNav();sync();normalizeLanding();setTimeout(sync,80)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();[0,120,400,900,1800].forEach(x=>setTimeout(boot,x));addEventListener('hashchange',()=>setTimeout(sync,20));addEventListener('pageshow',boot,true);addEventListener('resize',()=>setTimeout(sync,20));
})();`;
s=s.replace('carga();',js+'\ncarga();');
const css=`
@media(min-width:900px){
 #mvDesktopHeader132{display:grid!important;visibility:visible!important;opacity:1!important;background:#082b50!important;color:#fff!important}
 #mvDesktopHeader132 .mv-dbrand132,#mvDesktopHeader132 #mvDesktopTitle132,#mvDesktopHeader132 .mv-dbell132{visibility:visible!important;opacity:1!important}
 #mvDesktopNav132{display:flex!important;visibility:visible!important;overflow:visible!important;gap:5px!important;padding-left:clamp(8px,1.3vw,20px)!important;padding-right:clamp(8px,1.3vw,20px)!important}
 #mvDesktopNav132 .mv-dprimary132{display:flex!important;flex:1 1 auto!important;min-width:0!important;max-width:none!important;justify-content:space-between!important;gap:2px!important;overflow:visible!important}
 #mvDesktopNav132 .mv-dprimary132 button,#mvDesktopNav132 #mvMore132{display:inline-flex!important;align-items:center!important;justify-content:center!important;visibility:visible!important;min-width:0!important;max-width:none!important;padding:4px clamp(5px,.72vw,10px)!important;font-size:clamp(8px,.72vw,10px)!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important}
 #mvDesktopNav132 .mv-dmore132{flex:0 0 auto!important;display:block!important;visibility:visible!important}
}
@media(min-width:900px) and (max-width:1080px){#mvDesktopNav132 .mv-dprimary132 button,#mvDesktopNav132 #mvMore132{padding-left:4px!important;padding-right:4px!important;font-size:8px!important;letter-spacing:-.1px!important}}
`;
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.39 landing, header and full desktop navigation repaired');
