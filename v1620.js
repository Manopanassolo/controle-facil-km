const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');

// Version checkpoint
s=s.replaceAll('Gestão de deslocamentos · versão 161.0','Movvant · Inteligência comercial em campo · versão 162.0');
s=s.replaceAll('<span class="tag">161.0</span>','<span class="tag">162.0</span>');
s=s.replaceAll("checks.push(['Versão','161.0']);","checks.push(['Versão','162.0']);");

// Visible product naming. Keep database/table/internal identifiers unchanged.
s=s.replaceAll('Controle Fácil KM','Movvant');
s=s.replaceAll('Controle KM','Movvant');

const js=`
// v162 Movvant visual identity and public-domain readiness
function v162Brand(){
  document.title='Movvant — Inteligência comercial em campo';
  const title=document.querySelector('.classic-title');
  if(title){
    title.textContent='Movvant';
    if(!document.getElementById('movvantSloganV162')){
      const sub=document.createElement('span');
      sub.id='movvantSloganV162';
      sub.className='movvant-slogan-v162';
      sub.textContent='inteligência comercial em campo';
      title.insertAdjacentElement('afterend',sub);
    }
  }
  const logo=document.querySelector('.classic-logo');
  if(logo&&!logo.dataset.movvantV162){
    logo.dataset.movvantV162='1';
    logo.setAttribute('aria-label','Movvant');
    logo.innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4c-7.18 0-13 5.82-13 13 0 9.74 13 19 13 19s13-9.26 13-19c0-7.18-5.82-13-13-13Zm0 18.2a5.2 5.2 0 1 1 0-10.4 5.2 5.2 0 0 1 0 10.4Z" fill="currentColor"/><path d="M14.8 17h10.4M20 11.8v10.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".7"/></svg>';
  }
  const menuHead=document.querySelector('.side-menu-head-v136 b');
  if(menuHead)menuHead.textContent='Movvant';
  document.querySelectorAll('h1,h2,h3,b,span,div,p,button,label').forEach(el=>{
    if(el.children.length===0&&typeof el.textContent==='string'){
      if(el.textContent.includes('Controle Fácil KM'))el.textContent=el.textContent.replaceAll('Controle Fácil KM','Movvant');
      if(el.textContent.includes('Controle KM'))el.textContent=el.textContent.replaceAll('Controle KM','Movvant');
    }
  });
  document.documentElement.dataset.brand='movvant';
}
const renderBaseV162=render;
render=function(){const r=renderBaseV162();setTimeout(v162Brand,0);return r};
window.v162Brand=v162Brand;
setTimeout(v162Brand,1200);
`;

if(!s.includes('carga();')) throw new Error('v162 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');

const css=`
/* v162 Movvant identity */
:root{--movvant-blue:#0b2f66;--movvant-blue-2:#0f3f84;--movvant-lime:#c8ff18;--movvant-lime-soft:#e4ff75;--movvant-white:#ffffff;}
body{accent-color:var(--movvant-lime)}
.classic-app-header{background:linear-gradient(135deg,var(--movvant-blue),var(--movvant-blue-2))!important;border-color:#1d4f91!important;color:#fff!important;}
.classic-logo{background:transparent!important;border:0!important;color:#fff!important;display:grid!important;place-items:center!important;padding:2px!important;box-shadow:none!important;}
.classic-logo svg{width:100%;height:100%;display:block}
.classic-title{color:var(--movvant-lime)!important;font-weight:900!important;letter-spacing:.25px!important;text-shadow:0 0 12px rgba(200,255,24,.18)}
.movvant-slogan-v162{display:block;color:#fff!important;font-size:9px!important;line-height:1.1;margin-top:1px;letter-spacing:.25px;text-transform:none;opacity:.96}
.side-menu-open-v136{background:var(--movvant-blue)!important;color:var(--movvant-lime)!important;}
.side-menu-head-v136{color:var(--movvant-blue)!important}.side-menu-head-v136 b{color:var(--movvant-blue)!important;font-weight:900}
.nav#sideMenuV136 button[data-p].sel,.nav#sideMenuV136 button[data-p][aria-current="page"]{background:var(--movvant-blue)!important;color:var(--movvant-lime)!important;}
button:not(.sec):not(.header-icon):not(.header-menu){background:var(--movvant-blue)!important;color:#fff!important;border-color:var(--movvant-blue)!important;}
button:not(.sec):not(.header-icon):not(.header-menu):hover{filter:brightness(1.06)}
.progress>i,.progress>span,.progress div{background:var(--movvant-lime)!important}
a{color:var(--movvant-blue-2)}
@media(max-width:700px){.movvant-slogan-v162{font-size:8px!important}.classic-title{font-size:14px!important}}
`;
if(!s.includes('</style>')) throw new Error('v162 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.0: brand identity and movvant.com.br readiness applied');
