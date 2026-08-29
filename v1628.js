const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.8 hard reset Menu trigger: clone the button to strip all legacy addEventListener handlers
function v1628ResetMenuButton(){
  const old=document.getElementById('topMenu');
  if(!old||typeof v1626OpenMenu!=='function')return;
  if(old.dataset.v1628Clean==='1')return;
  const clean=old.cloneNode(true);
  clean.dataset.v1628Clean='1';
  clean.onclick=null;clean.onpointerup=null;clean.ontouchend=null;
  old.replaceWith(clean);
  clean.addEventListener('click',v1626OpenMenu,{capture:false});
  clean.addEventListener('pointerup',e=>{
    if(e.pointerType==='touch'){e.preventDefault();v1626OpenMenu(e)}
  },{capture:false});
  clean.setAttribute('aria-controls','movvantMenuOverlayV1626');
  clean.setAttribute('aria-haspopup','dialog');
  clean.setAttribute('aria-expanded','false');
}
function v1628Ensure(){v1628ResetMenuButton();if(typeof v1626BuildMenu==='function')v1626BuildMenu()}
setTimeout(v1628Ensure,0);
setTimeout(v1628Ensure,300);
setTimeout(v1628Ensure,1200);
setTimeout(v1628Ensure,3000);
const v1628RenderBase=render;render=function(){const r=v1628RenderBase();setTimeout(v1628Ensure,0);return r};
`;
if(!s.includes('carga();'))throw new Error('v162.8 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.8: Menu trigger node reset; legacy touch listeners removed');
