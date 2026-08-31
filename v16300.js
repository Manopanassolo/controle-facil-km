const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.16: dense dashboard composition using existing operational data only.
(function(){
 const byId=id=>document.getElementById(id);
 function sync(){
  const home=byId('mvHome88'); if(!home)return;
  home.classList.add('mv-dense116');
  const recent=home.querySelector('.mv-recent88');
  const summary=home.querySelector('.mv-summary88');
  if(recent){
   const empty=recent.querySelector('.mv-empty88');
   if(empty) empty.classList.add('mv-empty-dense116');
  }
  if(summary){
   let foot=summary.querySelector('.mv-dashfoot116');
   if(!foot){
    foot=document.createElement('div');foot.className='mv-dashfoot116';
    foot.innerHTML='<div><b>Operação</b><span>Indicadores, agenda e atalhos reunidos em uma única visão.</span></div><button type="button" data-mv88="agenda">Abrir agenda</button>';
    summary.appendChild(foot);
   }
  }
 }
 [0,120,400,900,1800].forEach(ms=>setTimeout(sync,ms));
 addEventListener('pageshow',sync,true);
 globalThis.mvDashboardV16316={sync};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.16 startup anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.16 dashboard: balanced full-width composition, no false empty holes */
#mvHome88.mv-dense116{max-width:none!important;padding-bottom:24px!important}
#mvHome88.mv-dense116 .mv-kpis88{margin-bottom:12px!important}
#mvHome88.mv-dense116 .mv-homegrid88{grid-template-columns:minmax(0,1.55fr) minmax(330px,.85fr)!important;align-items:stretch!important}
#mvHome88.mv-dense116 .mv-panel88{height:100%!important;box-sizing:border-box!important}
#mvHome88.mv-dense116 .mv-recent88{display:flex!important;flex-direction:column!important;min-height:360px!important}
#mvHome88.mv-dense116 .mv-empty-dense116{flex:1!important;min-height:0!important;border:0!important;background:#f8fafc!important;align-content:center!important;margin-top:2px!important}
#mvHome88.mv-dense116 .mv-summary88{display:flex!important;flex-direction:column!important;min-height:360px!important}
#mvHome88.mv-dense116 .mv-quick88{grid-template-columns:repeat(2,minmax(0,1fr))!important}
.mv-dashfoot116{margin-top:auto;padding-top:14px;border-top:1px solid #edf0f4;display:flex;align-items:center;justify-content:space-between;gap:12px}
.mv-dashfoot116 div{display:grid;gap:3px}.mv-dashfoot116 b{font-size:11px;color:#26354a}.mv-dashfoot116 span{font-size:10px;color:#7d8796;max-width:260px}.mv-dashfoot116 button{width:auto!important;min-height:34px!important;padding:0 12px!important;border-radius:6px!important;border:1px solid #cfd9e8!important;background:#fff!important;color:#0968e8!important;font-size:11px!important;font-weight:700!important}
@media(min-width:900px){body.mv-desktop88 #mvHome88.mv-dense116{padding:16px 18px 24px!important;width:100%!important}body.mv-desktop88 #mvHome88.mv-dense116 .mv-homehead88{margin-bottom:12px!important}body.mv-desktop88 #mvHome88.mv-dense116 .mv-kpis88 article{min-height:92px!important}body.mv-desktop88 #mvHome88.mv-dense116 .mv-homegrid88{min-height:calc(100vh - 202px)!important}body.mv-desktop88 #mvHome88.mv-dense116 .mv-recent88,body.mv-desktop88 #mvHome88.mv-dense116 .mv-summary88{min-height:100%!important}}
@media(max-width:899px){#mvHome88.mv-dense116 .mv-homegrid88{grid-template-columns:1fr!important}#mvHome88.mv-dense116 .mv-recent88,#mvHome88.mv-dense116 .mv-summary88{min-height:auto!important}.mv-dashfoot116{align-items:flex-start;flex-direction:column}.mv-dashfoot116 button{width:100%!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.16 css anchor');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.16: dense dashboard without empty visual gaps installed');
