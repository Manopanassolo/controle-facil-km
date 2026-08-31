const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const css=`
/* v163.47: final shell polish */
@media(min-width:900px){
  #mvDesktopNav132.mv-grouped140{top:66px!important;height:34px!important}
  #mvDesktopNav132.mv-grouped140 .mv-navgroups140{min-width:0!important;width:min(560px,calc(100vw - 80px))!important;max-width:560px!important;gap:10px!important;padding:0!important}
  .mv-menugroup140{height:28px!important}
  .mv-menutrigger140{min-width:0!important;height:28px!important;padding:0 11px!important;font-size:10.5px!important;border-radius:6px!important}
  .mv-submenu140{top:31px!important;min-width:180px!important;padding:5px!important}
  .mv-submenu140 button{padding:7px 9px!important;font-size:10.5px!important}
  body.mv-reference-shell85 .mv-topnav-v16282{display:none!important}
  body.mv-reference-shell85 #app{padding-top:112px!important}
  body.mv-reference-shell85 #app>section{padding-top:10px!important}
  .mv-dashboard85>.mv-pagehead85{margin-top:0!important}
  .mv-dashboard85 .mv-pagehead85 h1{font-size:22px!important}
  .mv-dashboard85 .mv-pagehead85 button{min-height:36px!important;padding:0 14px!important;font-size:12px!important}
  .mv-dashboard85 .mv-kpis85>div{padding:12px 14px!important}
  .mv-dashboard85 .mv-kpis85 b{font-size:19px!important}
  .mv-dashboard85 .mv-agenda-card94{min-height:0!important;height:auto!important;align-self:start!important}
  .mv-dashboard85 .mv-agenda-card94 .mv-agenda-list94{min-height:0!important}
}
@media(max-width:899px){
  #mvBottomDock85{grid-template-columns:repeat(5,minmax(0,1fr))!important}
  #mvBottomDock85 button{min-width:0!important;padding-left:2px!important;padding-right:2px!important}
  #mvBottomDock85 small{font-size:9px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  #app>section{padding-bottom:86px!important}
  .mv-formpage85{padding-bottom:8px!important}
  .mv-route-planner118 input{font-size:16px!important}
}
`;
if(!s.includes('</style>'))throw new Error('v163.47 style anchor not found');
s=s.replace('</style>',css+'\n</style>');
const runtime=`<script id="mvFinalPolish147">
(function(){
 function sync(){
  document.documentElement.dataset.mvFinalPolish='163.47';
  if(innerWidth>=900){
   const top=document.querySelector('.mv-topnav-v16282');if(top)top.setAttribute('aria-hidden','true');
   const nav=document.getElementById('mvDesktopNav132');if(nav)nav.setAttribute('aria-label','Menu principal Movvant');
  }
 }
 function boot(){sync();[80,250,700,1500].forEach(t=>setTimeout(sync,t))}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 addEventListener('pageshow',boot,true);addEventListener('resize',sync);
})();</script>`;
if(!s.includes('</body>'))throw new Error('v163.47 body anchor not found');
s=s.replace('</body>',runtime+'\n</body>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.47 final shell polish installed');
