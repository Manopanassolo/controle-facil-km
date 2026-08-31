const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const css=`
/* v163.46: desktop shell consolidation — compact navigation, safe header spacing */
@media(min-width:900px){
  body.mv-reference-shell85 #app{padding-top:64px!important}
  body.mv-reference-shell85 .mv-topnav-v16282{
    top:64px!important;
    width:min(760px,calc(100% - 230px))!important;
    min-height:42px!important;
    height:42px!important;
    margin:10px auto 16px!important;
    padding:5px 10px!important;
    border:1px solid #e2e8f0!important;
    border-radius:8px!important;
    box-shadow:0 2px 9px rgba(8,43,80,.06)!important;
  }
  body.mv-reference-shell85 .mv-topnav-v16282 button{
    width:30px!important;
    min-width:30px!important;
    height:30px!important;
    min-height:30px!important;
    padding:0!important;
    font-size:15px!important;
  }
  body.mv-reference-shell85 #mvPageTitleV16282{
    font-size:12px!important;
    line-height:1.2!important;
    white-space:nowrap!important;
    overflow:hidden!important;
    text-overflow:ellipsis!important;
    text-align:center!important;
  }
  body.mv-reference-shell85 #app>section{padding-top:8px!important}
}
`;
if(!s.includes('</style>'))throw new Error('v163.46 style anchor not found');
s=s.replace('</style>',css+'\n</style>');
const runtime=`<script id="mvDesktopShellRuntime146">
(function(){
 const titles={inicio:'Dashboard',viagem:'Novo percurso',historico:'Viagens',agenda:'Agenda',rotas:'Rotas',veiculos:'Frota',custos:'Despesas',equipe:'Equipe',relatorios:'Relatórios',ajuda:'Ajuda',perfil:'Meu perfil',painel:'Painel ADM',notificacoes:'Avisos',auditoria:'Auditoria',backup:'Backup',config:'Configurações',recursos:'Recursos',assinatura:'Assinatura'};
 function page(){
  const visible=[...document.querySelectorAll('#app>section[id^="p-"]')].find(x=>!x.classList.contains('hide')&&getComputedStyle(x).display!=='none');
  return document.body.dataset.mvPage||globalThis.mvNavigationV16282?.page||visible?.id?.replace(/^p-/,'')||'inicio';
 }
 function sync(){
  if(innerWidth<900)return;
  const p=page(),title=titles[p]||'Movvant';
  const h=document.getElementById('mvDesktopHeader144')||document.getElementById('mvDesktopHeader143');
  const ht=document.getElementById('mvDesktopTitle144')||document.getElementById('mvDesktopTitle143');
  const nt=document.getElementById('mvPageTitleV16282');
  if(h){h.style.setProperty('display','grid','important');h.style.setProperty('visibility','visible','important');h.style.setProperty('opacity','1','important')}
  if(ht)ht.textContent=title;
  if(nt)nt.textContent=title;
  document.documentElement.dataset.mvShellV16346='1';
 }
 function boot(){sync();[60,180,420,900,1800,3200].forEach(t=>setTimeout(sync,t))}
 document.addEventListener('click',e=>{if(e.target?.closest?.('[data-p],[data-p-jump],[data-mv-dock],#mvBackV16282,#mvHomeV16282'))setTimeout(sync,35)},true);
 window.addEventListener('popstate',()=>setTimeout(sync,25));
 window.addEventListener('pageshow',boot,true);
 window.addEventListener('resize',sync);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 globalThis.mvDesktopShellV16346={sync,page,titles};
})();
</script>`;
if(!s.includes('</body>'))throw new Error('v163.46 body anchor not found');
s=s.replace('</body>',runtime+'\n</body>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.46 desktop shell consolidated');
