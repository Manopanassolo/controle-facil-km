const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const old="const topMenuV110=document.getElementById('topMenu');if(topMenuV110)topMenuV110.onclick=()=>document.querySelector('.classic-module-nav')?.classList.toggle('nav-expanded');";
const neu="const topMenuV110=document.getElementById('topMenu');if(topMenuV110)topMenuV110.onclick=(e)=>{e?.preventDefault();const nav=document.getElementById('sideMenuV136')||document.querySelector('.classic-module-nav'),shade=document.getElementById('sideMenuShadeV136');if(!nav)return;nav.classList.add('open-v136');shade?.classList.add('open-v136');document.body.classList.add('menu-open-v136');nav.style.transform='translateX(0)'};";
if(!s.includes(old))throw new Error('v162.4 topMenu legacy handler anchor not found');
s=s.replace(old,neu);
const js=`
// v162.4 deterministic header Menu binding
window.v1624OpenMenu=function(e){
  if(e){e.preventDefault();e.stopImmediatePropagation?.();e.stopPropagation?.()}
  const nav=document.getElementById('sideMenuV136')||document.querySelector('.classic-module-nav');
  const shade=document.getElementById('sideMenuShadeV136');
  if(!nav)return false;
  nav.classList.add('open-v136');
  shade?.classList.add('open-v136');
  document.body.classList.add('menu-open-v136');
  nav.style.setProperty('transform','translateX(0)','important');
  nav.style.setProperty('visibility','visible','important');
  nav.style.setProperty('pointer-events','auto','important');
  return false;
};
function v1624Bind(){
  const b=document.getElementById('topMenu');
  if(!b)return;
  b.onclick=window.v1624OpenMenu;
  b.onpointerup=window.v1624OpenMenu;
  b.setAttribute('aria-label','Abrir menu');
}
const v1624RenderBase=render;render=function(){const r=v1624RenderBase();setTimeout(v1624Bind,0);return r};
setTimeout(v1624Bind,100);
setTimeout(v1624Bind,1000);
setInterval(v1624Bind,2500);
`;
if(!s.includes('carga();'))throw new Error('v162.4 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.4: legacy top Menu handler replaced with side drawer open');
