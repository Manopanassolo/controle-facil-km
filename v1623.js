const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.3 bind every visible mobile Menu trigger to the side drawer
function v1623MenuParts(){return {
  nav:document.getElementById('sideMenuV136'),
  shade:document.getElementById('sideMenuShadeV136')
}}
function v1623OpenMenu(e){
  if(e){e.preventDefault();e.stopPropagation()}
  const {nav,shade}=v1623MenuParts();
  if(!nav)return;
  nav.classList.add('open-v136');
  shade?.classList.add('open-v136');
  document.body.classList.add('menu-open-v136');
  nav.style.transform='translateX(0)';
}
function v1623CloseMenu(e){
  if(e){e.preventDefault();e.stopPropagation()}
  const {nav,shade}=v1623MenuParts();
  if(!nav)return;
  nav.classList.remove('open-v136');
  shade?.classList.remove('open-v136');
  document.body.classList.remove('menu-open-v136');
  nav.style.removeProperty('transform');
}
function v1623IsMenuTrigger(el){
  if(!el||el.id==='sideMenuCloseV136')return false;
  if(el.id==='sideMenuOpenV136')return true;
  if(el.matches?.('.header-menu,[data-menu-open],[aria-label*="menu" i]'))return true;
  const txt=(el.textContent||'').replace(/\\s+/g,' ').trim().toLowerCase();
  return txt==='menu'||txt==='☰ menu'||txt.endsWith(' menu');
}
function v1623BindMenu(){
  document.querySelectorAll('button,[role="button"],a').forEach(el=>{
    if(!v1623IsMenuTrigger(el)||el.dataset.v1623Menu==='1')return;
    el.dataset.v1623Menu='1';
    el.addEventListener('click',v1623OpenMenu,{capture:true});
    el.addEventListener('touchend',v1623OpenMenu,{capture:true,passive:false});
  });
  const close=document.getElementById('sideMenuCloseV136'),shade=document.getElementById('sideMenuShadeV136');
  if(close&&!close.dataset.v1623Close){close.dataset.v1623Close='1';close.addEventListener('click',v1623CloseMenu,{capture:true})}
  if(shade&&!shade.dataset.v1623Close){shade.dataset.v1623Close='1';shade.addEventListener('click',v1623CloseMenu,{capture:true})}
}
document.addEventListener('click',e=>{
  const el=e.target?.closest?.('button,[role="button"],a');
  if(v1623IsMenuTrigger(el))v1623OpenMenu(e);
},true);
const v1623RenderBase=render;render=function(){const r=v1623RenderBase();setTimeout(v1623BindMenu,0);return r};
setTimeout(v1623BindMenu,250);
setTimeout(v1623BindMenu,1200);
setTimeout(v1623BindMenu,3500);
`;
if(!s.includes('carga();'))throw new Error('v162.3 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`\n/* v162.3 menu trigger safety */\n.header-menu,#sideMenuOpenV136,[data-menu-open]{pointer-events:auto!important;position:relative;z-index:57!important}\n.nav#sideMenuV136.open-v136{transform:translateX(0)!important;visibility:visible!important;pointer-events:auto!important}\n.side-menu-shade-v136.open-v136{pointer-events:auto!important}\n`;
if(!s.includes('</style>'))throw new Error('v162.3 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.3: visible mobile Menu trigger bound to side drawer');
