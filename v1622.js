const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.2 robust mobile interaction layer
function v1622CloseMenu(){
  const nav=document.getElementById('sideMenuV136'),shade=document.getElementById('sideMenuShadeV136');
  nav?.classList.remove('open-v136');shade?.classList.remove('open-v136');document.body.classList.remove('menu-open-v136');
}
function v1622OpenMenu(){
  const nav=document.getElementById('sideMenuV136'),shade=document.getElementById('sideMenuShadeV136');
  nav?.classList.add('open-v136');shade?.classList.add('open-v136');document.body.classList.add('menu-open-v136');
}
function v1622Bind(){
  const open=document.getElementById('sideMenuOpenV136'),close=document.getElementById('sideMenuCloseV136'),shade=document.getElementById('sideMenuShadeV136');
  if(open)open.onclick=v1622OpenMenu;if(close)close.onclick=v1622CloseMenu;if(shade)shade.onclick=v1622CloseMenu;
  document.querySelectorAll('[data-p]').forEach(b=>{b.onclick=()=>{const p=b.dataset.p;if(p&&typeof show==='function'){show(p);v1622CloseMenu()}}});
  document.querySelectorAll('[data-p-jump]').forEach(b=>{b.onclick=()=>{const p=b.dataset.pJump;if(p&&typeof show==='function')show(p)}});
}
if(!window.__movvantInteractionGuard){
  window.__movvantInteractionGuard=1;
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-p],[data-p-jump],#sideMenuOpenV136,#sideMenuCloseV136');if(!b)return;
    if(b.id==='sideMenuOpenV136'){e.preventDefault();v1622OpenMenu();return}
    if(b.id==='sideMenuCloseV136'){e.preventDefault();v1622CloseMenu();return}
    const p=b.dataset.p||b.dataset.pJump;
    if(p&&typeof show==='function'){e.preventDefault();show(p);if(b.dataset.p)v1622CloseMenu()}
  },true);
}
const v1622RenderBase=render;render=function(){const r=v1622RenderBase();setTimeout(v1622Bind,0);return r};
setTimeout(()=>{v1622CloseMenu();v1622Bind()},500);
setTimeout(v1622Bind,2200);
`;
if(!s.includes('carga();'))throw new Error('v162.2 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`\n/* v162.2 interaction safety */\n#app:not(.hide){pointer-events:auto!important}\n.side-menu-shade-v136:not(.open-v136){pointer-events:none!important}\nbutton,[data-p],[data-p-jump]{touch-action:manipulation}\n`;
if(!s.includes('</style>'))throw new Error('v162.2 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.2: mobile navigation and click handling hardened');
