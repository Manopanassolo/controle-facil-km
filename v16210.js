const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
// v162.10: remove page-level scroll locking from the clean mobile menu.
// The fixed overlay already intercepts touches; only the drawer itself needs vertical scrolling.
s=s.replace("    document.documentElement.classList.add('mv-lock-v1629');\n    document.body.classList.add('mv-lock-v1629');","    document.documentElement.classList.remove('mv-lock-v1629');\n    document.body.classList.remove('mv-lock-v1629');\n    document.documentElement.style.removeProperty('overflow');\n    document.body.style.removeProperty('overflow');");
const js=`
// v162.10 scroll recovery: never leave the application body locked after the menu closes
function v16210UnlockPage(){
  const ov=document.getElementById('mvMenuV1629');
  if(ov && ov.classList.contains('open')) return;
  ['mv-lock-v1629','menu-open-v136','mv-drawer-open-v1625','mv1626-lock'].forEach(c=>{
    document.documentElement.classList.remove(c);
    document.body.classList.remove(c);
  });
  document.documentElement.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('position');
  document.documentElement.style.removeProperty('height');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('position');
  document.body.style.removeProperty('height');
  document.body.style.removeProperty('touch-action');
}
document.addEventListener('click',e=>{
  if(e.target.closest?.('#mvCloseV1629,[data-page],[data-logout]')) setTimeout(v16210UnlockPage,0);
},true);
window.addEventListener('pageshow',()=>setTimeout(v16210UnlockPage,0));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(v16210UnlockPage,0)});
setTimeout(v16210UnlockPage,100);
setTimeout(v16210UnlockPage,1200);
`;
if(!s.includes('carga();'))throw new Error('v162.10 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.10 scroll safety */
html,body{overscroll-behavior-y:auto!important}
#mvMenuV1629{touch-action:auto!important}
#mvMenuV1629 .mv-panel-v1629{-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;touch-action:pan-y!important}
`;
if(!s.includes('</style>'))throw new Error('v162.10 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.10: page scrolling restored; menu panel remains independently scrollable');
