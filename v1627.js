const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
// v162.7 removes legacy listeners/timers that can steal the Menu click after the new menu has already bound.
const replacements=[
  ["setInterval(v1624Bind,2500);","/* v162.7: legacy v162.4 rebinder disabled */"],
  ["document.addEventListener('click',e=>{const b=e.target.closest?.('#topMenu,.header-menu');if(b)v1625OpenDrawer(e)},true);","/* v162.7: legacy v162.5 capture listener disabled */"],
  ["document.addEventListener('touchend',e=>{const b=e.target.closest?.('#topMenu,.header-menu');if(b)v1625OpenDrawer(e)},{capture:true,passive:false});","/* v162.7: legacy v162.5 touch capture listener disabled */"],
  ["document.addEventListener('click',e=>{\n  const el=e.target?.closest?.('button,[role=\"button\"],a');\n  if(v1623IsMenuTrigger(el))v1623OpenMenu(e);\n},true);","/* v162.7: legacy v162.3 capture listener disabled */"]
];
for(const [old,neu] of replacements){if(s.includes(old))s=s.replace(old,neu)}
const js=`
// v162.7 final menu ownership: only v162.6 controls the mobile Menu button
function v1627OwnMenu(){
  const top=document.getElementById('topMenu');
  if(!top||typeof v1626OpenMenu!=='function')return;
  top.onclick=v1626OpenMenu;
  top.onpointerup=null;
  top.ontouchend=null;
  top.setAttribute('aria-controls','movvantMenuOverlayV1626');
  top.setAttribute('aria-haspopup','dialog');
}
setTimeout(v1627OwnMenu,0);
setTimeout(v1627OwnMenu,700);
setTimeout(v1627OwnMenu,1800);
const v1627RenderBase=render;render=function(){const r=v1627RenderBase();setTimeout(v1627OwnMenu,0);return r};
`;
if(!s.includes('carga();'))throw new Error('v162.7 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.7: legacy menu conflicts removed; v162.6 owns Menu deterministically');
