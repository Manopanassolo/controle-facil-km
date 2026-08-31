const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.90: eliminate duplicate UI layers and repair login, trip and agenda presentation.
(function(){
 const byId=id=>document.getElementById(id);
 function hideOldHome(){
   const p=byId('p-inicio'),home=byId('mvHome88');if(!p||!home)return;
   [...p.children].forEach(x=>{if(x!==home)x.classList.add('mv-homelegacy90')});
   p.querySelectorAll('.mvDashboardHeadV16285,.mvPageHeadV16286,.mv-pagehead87').forEach(x=>x.classList.add('mv-homelegacy90'));
 }
 function login(){
   const auth=byId('auth');if(!auth)return;
   auth.classList.add('mv-login90');
   const legacy=byId('status')?.closest?.('.c');if(legacy)legacy.classList.add('mv-loginbrand90');
   let brand=byId('mvLoginBrand90');if(!brand){brand=document.createElement('div');brand.id='mvLoginBrand90';brand.innerHTML='<div class="mv-loginmark90">M</div><div><strong>Movvant</strong><small>Inteligência comercial em campo</small></div>';auth.insertAdjacentElement('beforebegin',brand)}
 }
 function trip(){
   const p=byId('p-viagem'),form=byId('novaViagem');if(!p||!form)return;
   p.classList.add('mv-trip90');form.classList.add('mv-tripform90');
   form.style.removeProperty('display');form.style.removeProperty('visibility');form.style.removeProperty('opacity');
   const active=byId('viagemAtiva');
   if(active&&!active.classList.contains('hide'))form.classList.add('mv-tripform-active90');else form.classList.remove('mv-tripform-active90');
 }
 function agenda(){
   const p=byId('p-agenda');if(!p)return;p.classList.add('mv-agenda90');
   const c=p.querySelector(':scope>.c');if(c)c.classList.add('mv-agendaform90');
 }
 function top(){
   const t=byId('mvTopNavV16282');if(!t)return;t.classList.add('mv-top90');
   const p=document.body.dataset.mvPage||'inicio';const title=byId('mvPageTitleV16282');if(title)title.textContent=p==='inicio'?'Início':title.textContent;
 }
 function sync(){hideOldHome();login();trip();agenda();top()}
 [0,100,300,700,1400,2600].forEach(ms=>setTimeout(sync,ms));
 document.addEventListener('click',()=>setTimeout(sync,60),true);
 globalThis.mvRepairV16290={sync};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.90 startup anchor not found');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.90 single-view repair */
#p-inicio>.mv-homelegacy90,#p-inicio .mv-homelegacy90{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}
#p-inicio #mvHome88{display:block!important;padding-top:14px!important}
#p-inicio #mvHome88 .mv-homehead88{margin-top:0!important}
#mvLoginBrand90{display:none}
body:not(.mv-authenticated) #mvLoginBrand90{max-width:680px;margin:34px auto 0;padding:0 20px;display:flex;align-items:center;gap:11px;color:#0b2342}#mvLoginBrand90 .mv-loginmark90{width:42px;height:42px;border-radius:10px;background:#0b63e5;color:#c8ff00;display:grid;place-items:center;font-weight:900;font-size:23px}#mvLoginBrand90 strong{display:block;font-size:24px;line-height:1}#mvLoginBrand90 small{display:block;margin-top:5px;color:#657386;font-size:11px}
.mv-loginbrand90{display:none!important}.mv-login90{max-width:680px!important;margin:18px auto!important;border:1px solid #e0e6ee!important;border-radius:10px!important;padding:24px!important;background:#fff!important;box-shadow:0 8px 28px #14243b0b!important}.mv-login90 h2{font-size:20px!important;color:#142137!important;margin:0 0 16px!important}.mv-login90 .r{grid-template-columns:1fr!important;gap:10px!important}.mv-login90 input{min-height:48px!important;border-radius:7px!important;border-color:#dce3ec!important}.mv-login90 button{min-height:44px!important;border-radius:7px!important}.mv-login90 #entrar{background:#0b63e5!important}.mv-login90 .sec{background:#f1f4f8!important;color:#193253!important}
.mv-trip90,.mv-agenda90{background:#f5f7fa!important}.mv-trip90 .mv-tripform90,.mv-agenda90 .mv-agendaform90{display:block!important;visibility:visible!important;opacity:1!important;max-width:820px!important;margin:0 auto 12px!important;padding:16px!important;background:#fff!important;border:1px solid #e0e6ee!important;border-radius:8px!important;box-shadow:none!important}.mv-tripform90 h2,.mv-agendaform90 h2{display:none!important}.mv-tripform90 input,.mv-tripform90 select,.mv-tripform90 textarea,.mv-agendaform90 input,.mv-agendaform90 select,.mv-agendaform90 textarea{border-radius:6px!important;border:1px solid #dce3ec!important;background:#fff!important;min-height:42px!important}.mv-tripform90 textarea,.mv-agendaform90 textarea{min-height:74px!important}.mv-tripform90 button,.mv-agendaform90 button{border-radius:6px!important;min-height:40px!important}.mv-tripform90 #btViagem{background:#0b63e5!important}.mv-tripform-active90{display:none!important}
@media(max-width:899px){#mvLoginBrand90{margin-top:20px;padding:0 16px}.mv-login90{margin:12px 14px!important;padding:18px!important}.mv-trip90,.mv-agenda90{padding-top:10px!important}.mv-trip90 .mv-tripform90,.mv-agenda90 .mv-agendaform90{padding:12px!important;margin-bottom:90px!important}.mv-tripform90 .r,.mv-agendaform90 .r,.mv-agendaform90 .r3{grid-template-columns:1fr!important}.mv-tripform90 input,.mv-tripform90 select,.mv-agendaform90 input,.mv-agendaform90 select{min-height:46px!important}#p-inicio #mvHome88{padding-top:10px!important}}
`;
if(!s.includes('</style>'))throw new Error('v162.90 css anchor not found');s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v162.90: duplicate dashboard removed; login, new trip and agenda repaired');