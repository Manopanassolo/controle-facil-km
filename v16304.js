const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 const items=[['inicio','Dashboard'],['painel','Painel ADM'],['viagem','Novo percurso'],['viagens','Viagens'],['agenda','Agenda'],['rotas','Rotas'],['frota','Frota'],['despesas','Despesas'],['equipe','Equipe'],['relatorios','Relatórios']];
 const more=[['avisos','Avisos'],['auditoria','Auditoria'],['backup','Backup'],['config','Configurações'],['perfil','Meu perfil'],['ajuda','Ajuda']];
 function go(route){const old=[...document.querySelectorAll('#app>.nav [data-p]')].find(b=>b.dataset.p===route);if(old)old.click();else if(typeof globalThis.show==='function')globalThis.show(route);setTimeout(sync,40)}
 function button(r,l){return '<button type="button" data-mvroute="'+r+'">'+l+'</button>'}
 function build(){
  document.body.classList.add('mv-web132');
  if(!document.getElementById('mvDesktopHeader132')){
   const h=document.createElement('header');h.id='mvDesktopHeader132';h.innerHTML='<div class="mv-dbrand132"><span class="mv-dmark132">M</span><span><strong>Movvant</strong><small>INTELIGÊNCIA COMERCIAL EM CAMPO</small></span></div><div id="mvDesktopTitle132">Dashboard</div><button class="mv-dbell132" type="button" aria-label="Notificações">●</button>';document.body.appendChild(h);
   const n=document.createElement('nav');n.id='mvDesktopNav132';n.innerHTML='<div class="mv-dprimary132">'+items.map(x=>button(x[0],x[1])).join('')+'</div><div class="mv-dmore132"><button id="mvMore132" type="button">Mais ▾</button><div id="mvMoreMenu132">'+more.map(x=>button(x[0],x[1])).join('')+'</div></div>';document.body.appendChild(n);
   n.addEventListener('click',e=>{const b=e.target.closest('[data-mvroute]');if(b){go(b.dataset.mvroute);document.getElementById('mvMoreMenu132')?.classList.remove('open')}});
   document.getElementById('mvMore132')?.addEventListener('click',e=>{e.stopPropagation();document.getElementById('mvMoreMenu132')?.classList.toggle('open')});document.addEventListener('click',()=>document.getElementById('mvMoreMenu132')?.classList.remove('open'));
  }
  sync();
 }
 function current(){const visible=[...document.querySelectorAll('#app [id^="p-"]')].find(p=>{const c=getComputedStyle(p);return c.display!=='none'&&c.visibility!=='hidden'&&p.getBoundingClientRect().height>20});return visible?.id?.replace(/^p-/,'')||location.hash.match(/p=([^&]+)/)?.[1]||'inicio'}
 function sync(){const r=current();const all=[...items,...more];const label=all.find(x=>x[0]===r)?.[1]||document.querySelector('#app>.nav [data-p].active')?.textContent?.trim()||'Movvant';const t=document.getElementById('mvDesktopTitle132');if(t)t.textContent=label;document.querySelectorAll('#mvDesktopNav132 [data-mvroute]').forEach(b=>b.classList.toggle('active',b.dataset.mvroute===r))}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();[0,100,350,900].forEach(x=>setTimeout(build,x));addEventListener('hashchange',()=>setTimeout(sync,20));addEventListener('pageshow',build,true);
})();`;
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.32 isolated desktop authority */
@media(min-width:900px){
 html,body{width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important;background:#f4f7fb!important}
 body.mv-web132 #mvTopNavV16282,body.mv-web132 #app>.nav{display:none!important;visibility:hidden!important;pointer-events:none!important}
 #mvDesktopHeader132{display:grid!important;position:fixed!important;z-index:2147483600!important;inset:0 0 auto 0!important;width:100%!important;height:56px!important;grid-template-columns:300px minmax(0,1fr) 48px!important;align-items:center!important;gap:16px!important;padding:6px clamp(22px,2.5vw,44px)!important;box-sizing:border-box!important;background:#082b50!important;border-bottom:1px solid #17446f!important;color:#fff!important;box-shadow:0 1px 5px rgba(8,32,58,.16)!important}
 .mv-dbrand132{display:flex;align-items:center;gap:10px}.mv-dmark132{display:grid;place-items:center;width:32px;height:32px;border:2px solid #c8ff00;border-radius:8px;color:#c8ff00;font-weight:900;font-size:18px}.mv-dbrand132 strong{display:block;font-size:15px;line-height:16px}.mv-dbrand132 small{display:block;margin-top:2px;color:#c8ff00;font-size:7px;letter-spacing:.55px}.mv-dbell132{display:grid;place-items:center;width:34px;height:34px;justify-self:end;border:1px solid #2c5b8c;border-radius:8px;background:#123f73;color:#c8ff00;font-size:11px}#mvDesktopTitle132{justify-self:center;color:#d8e6f4;font-size:12px;font-weight:700}
 #mvDesktopNav132{display:flex!important;position:fixed!important;z-index:2147483500!important;top:56px!important;left:0!important;right:0!important;height:46px!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:6px clamp(20px,2.4vw,42px)!important;box-sizing:border-box!important;background:#fff!important;border-bottom:1px solid #dce4ed!important}
 .mv-dprimary132{display:flex;min-width:0;max-width:1240px;align-items:center;justify-content:center;gap:4px;overflow:hidden}.mv-dprimary132 button,#mvMore132,#mvMoreMenu132 button{height:32px;border:0;border-radius:7px;background:transparent;color:#173a5c;font-size:10px;font-weight:650;white-space:nowrap;padding:4px 10px;cursor:pointer}.mv-dprimary132 button.active,#mvMoreMenu132 button.active{background:#087be2;color:#fff}.mv-dmore132{position:relative;flex:0 0 auto}#mvMore132{background:#eef4fa}#mvMoreMenu132{display:none;position:absolute;right:0;top:38px;width:170px;padding:6px;background:#fff;border:1px solid #dce4ed;border-radius:9px;box-shadow:0 8px 24px rgba(18,48,78,.16)}#mvMoreMenu132.open{display:grid}#mvMoreMenu132 button{text-align:left;width:100%}
 body.mv-web132 #app{display:block!important;position:fixed!important;inset:102px 0 0 0!important;width:100%!important;height:calc(100dvh - 102px)!important;max-width:none!important;margin:0!important;padding:0!important;overflow:hidden!important;background:#f4f7fb!important;box-sizing:border-box!important;transform:none!important}
 body.mv-web132 #app [id^="p-"]{position:absolute!important;inset:0!important;width:100%!important;max-width:none!important;height:100%!important;max-height:100%!important;margin:0!important;padding:14px clamp(20px,2.5vw,44px) 20px!important;box-sizing:border-box!important;background:#f4f7fb!important;overflow-y:auto!important;overflow-x:hidden!important;transform:none!important}
 body.mv-web132 #app [id^="p-"].hide,body.mv-web132 #app [id^="p-"][hidden]{display:none!important}body.mv-web132 #app [id^="p-"]:not(.hide):not([hidden]){visibility:visible!important;opacity:1!important}
 body.mv-web132 #app [id^="p-"]>*{box-sizing:border-box!important;max-width:1380px!important;margin-left:auto!important;margin-right:auto!important}
 body.mv-web132 #p-inicio{overflow:hidden!important}body.mv-web132 #mvHome88{width:100%!important;max-width:1380px!important;height:100%!important;margin:0 auto!important;padding:0!important;overflow:hidden!important}
 body.mv-web132 #mvHome88 .mv-head88{min-height:48px!important;margin-bottom:8px!important}body.mv-web132 #mvHome88 .mv-kpis88{min-height:76px!important}body.mv-web132 #mvHome88 .mv-homegrid88{grid-template-columns:minmax(0,1.45fr) minmax(310px,.75fr)!important;gap:12px!important;height:calc(100% - 140px)!important;min-height:0!important}body.mv-web132 #mvHome88 .mv-recent88,body.mv-web132 #mvHome88 .mv-summary88{height:100%!important;min-height:0!important;overflow:hidden!important}
 body.mv-web132 #p-agenda .card,body.mv-web132 #p-agenda .panel,body.mv-web132 #p-agenda .box{height:auto!important;max-height:620px!important;overflow:auto!important}body.mv-web132 #p-agenda table{font-size:12px!important}body.mv-web132 #p-agenda td,body.mv-web132 #p-agenda th{height:46px!important;min-height:46px!important;max-height:54px!important;padding:5px!important}body.mv-web132 #p-agenda [class*="calendar"],body.mv-web132 #p-agenda [id*="calendar"]{width:min(100%,900px)!important;max-width:900px!important;height:auto!important;max-height:610px!important}
 body.mv-web132 #p-viagem,body.mv-web132 #p-rotas{visibility:visible!important;opacity:1!important}body.mv-web132 #p-viagem .card,body.mv-web132 #p-rotas .card{height:auto!important;min-height:0!important}
 body.mv-web132.mv-sidebar-collapsed89 #app{padding-left:0!important}
}
@media(max-width:899px){#mvDesktopHeader132,#mvDesktopNav132{display:none!important}}
`;
s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.32 isolated desktop shell installed');