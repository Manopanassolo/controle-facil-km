const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.82: persistent page navigation, safe in-app back/home and auto-collapsing mobile menu.
(function(){
  const VERSION='162.82';
  const PAGE_KEY='mv_last_page_v16282';
  const STACK_KEY='mv_nav_stack_v16282';
  const byId=id=>document.getElementById(id);
  const nav=()=>document.querySelector('#app .nav');
  const pages=()=>[...document.querySelectorAll('#app [id^="p-"]')].map(x=>x.id.slice(2));
  const valid=n=>!!n&&pages().includes(n);
  const hashPage=()=>{try{const m=location.hash.match(/(?:^#|[&#])p=([^&]+)/);return m?decodeURIComponent(m[1]):''}catch(_){return''}};
  const safeStored=()=>{try{return localStorage.getItem(PAGE_KEY)||''}catch(_){return''}};
  const initial=()=>{const a=history.state?.mvPage,b=hashPage(),c=safeStored();return valid(a)?a:valid(b)?b:valid(c)?c:'inicio'};
  let current=initial(),restoring=false,restoreDone=false;
  function stackRead(){try{const v=JSON.parse(sessionStorage.getItem(STACK_KEY)||'[]');return Array.isArray(v)?v.filter(valid).slice(-30):[]}catch(_){return[]}}
  function stackWrite(v){try{sessionStorage.setItem(STACK_KEY,JSON.stringify(v.slice(-30)))}catch(_){}}
  function remember(n){try{localStorage.setItem(PAGE_KEY,n)}catch(_){} }
  function urlFor(n){const u=new URL(location.href);u.hash='p='+encodeURIComponent(n);return u.pathname+u.search+u.hash}
  function setHistory(n,replace=false){try{history[replace?'replaceState':'pushState']({...(history.state||{}),mvPage:n,mvVersion:VERSION},'',urlFor(n))}catch(_){} }
  function closeMenu(){const n=nav();if(!n)return;n.classList.add('mv-nav-collapsed-v16282');document.body.classList.remove('mv-menu-open-v16282');const b=byId('mvMenuToggleV16282');if(b)b.setAttribute('aria-expanded','false')}
  function openMenu(){const n=nav();if(!n)return;n.classList.remove('mv-nav-collapsed-v16282');document.body.classList.add('mv-menu-open-v16282');const b=byId('mvMenuToggleV16282');if(b)b.setAttribute('aria-expanded','true')}
  function active(n){document.querySelectorAll('#app .nav [data-p]').forEach(b=>{const on=b.dataset.p===n;b.classList.toggle('mv-current-v16282',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});const title=byId('mvPageTitleV16282'),btn=document.querySelector('#app .nav [data-p="'+CSS.escape(n)+'"]');if(title)title.textContent=btn?.textContent?.trim()||'Movvant';const back=byId('mvBackV16282');if(back)back.disabled=n==='inicio'&&stackRead().length===0}
  function afterShow(n){if(!valid(n))return;current=n;remember(n);active(n);if(matchMedia('(max-width: 820px)').matches)closeMenu();document.body.dataset.mvPage=n}
  let legacyShow=null;
  try{if(typeof show==='function'){legacyShow=show;show=function(n){if(!valid(n))return legacyShow(n);const previous=current;if(!restoring&&previous&&previous!==n){const st=stackRead();st.push(previous);stackWrite(st);setHistory(n,false)}else if(restoring){setHistory(n,true)}const r=legacyShow(n);afterShow(n);return r}}}catch(e){console.warn('v162.82 show wrapper',e)}
  function direct(n,replace=true){if(!valid(n))n='inicio';restoring=true;try{if(legacyShow)legacyShow(n);else{document.querySelectorAll('#app [id^="p-"]').forEach(x=>x.classList.add('hide'));byId('p-'+n)?.classList.remove('hide')}if(replace)setHistory(n,true);afterShow(n)}finally{restoring=false}}
  function navigate(n){if(!valid(n))return;const previous=current;if(previous&&previous!==n){const st=stackRead();st.push(previous);stackWrite(st)}current=n;remember(n);setHistory(n,false);setTimeout(()=>direct(n,true),0)}
  function goHome(){if(current!=='inicio'){const st=stackRead();st.push(current);stackWrite(st)}direct('inicio',true)}
  function goBack(){const st=stackRead();let prev='';while(st.length&&!prev){const x=st.pop();if(valid(x)&&x!==current)prev=x}stackWrite(st);direct(prev||'inicio',true)}
  function installShell(){
    const app=byId('app'),n=nav();if(!app||!n)return;
    let bar=byId('mvTopNavV16282');
    if(!bar){bar=document.createElement('div');bar.id='mvTopNavV16282';bar.className='mv-topnav-v16282';bar.innerHTML='<button type="button" id="mvMenuToggleV16282" aria-label="Abrir menu" aria-expanded="false">☰</button><button type="button" id="mvBackV16282" aria-label="Voltar">←</button><button type="button" id="mvHomeV16282" aria-label="Tela inicial">⌂</button><strong id="mvPageTitleV16282">Movvant</strong>';n.insertAdjacentElement('beforebegin',bar);byId('mvMenuToggleV16282').onclick=()=>document.body.classList.contains('mv-menu-open-v16282')?closeMenu():openMenu();byId('mvBackV16282').onclick=goBack;byId('mvHomeV16282').onclick=goHome}
    document.querySelectorAll('[data-p-jump]').forEach(b=>{if(b.dataset.mvAutoCollapse82)return;b.dataset.mvAutoCollapse82='1';b.addEventListener('click',()=>setTimeout(closeMenu,0))});
    if(matchMedia('(max-width: 820px)').matches&&!document.body.classList.contains('mv-menu-open-v16282'))closeMenu();active(current);
  }
  function tryRestore(){
    installShell();const app=byId('app');if(!app||app.classList.contains('hide')||restoreDone)return;
    const target=initial();restoreDone=true;direct(target,true);
  }
  window.addEventListener('popstate',e=>{const n=valid(e.state?.mvPage)?e.state.mvPage:(valid(hashPage())?hashPage():'inicio');direct(n,false)});
  window.addEventListener('hashchange',()=>{const n=hashPage();if(valid(n)&&n!==current)direct(n,false)});
  window.addEventListener('resize',()=>{installShell();if(!matchMedia('(max-width: 820px)').matches){nav()?.classList.remove('mv-nav-collapsed-v16282');document.body.classList.remove('mv-menu-open-v16282')}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('mv-menu-open-v16282'))closeMenu()});
  document.addEventListener('click',e=>{const b=e.target?.closest?.('#app .nav [data-p]');if(b){const target=b.dataset.p;if(valid(target)){navigate(target);if(matchMedia('(max-width: 820px)').matches)closeMenu()}return}if(!matchMedia('(max-width: 820px)').matches||!document.body.classList.contains('mv-menu-open-v16282'))return;const n=nav(),bar=byId('mvTopNavV16282');if(n&&!n.contains(e.target)&&bar&&!bar.contains(e.target))closeMenu()},true);
  // Observe only structural DOM changes. Watching class mutations caused a self-triggering
  // loop because installShell/active/closeMenu also change classes, which could starve
  // Android's main thread and freeze real keyboard input.
  let queued=false;
  const mo=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;installShell();tryRestore()})});
  try{mo.observe(document.documentElement,{subtree:true,childList:true})}catch(_){}
  [0,120,350,800,1500,2800].forEach(ms=>setTimeout(()=>{installShell();tryRestore()},ms));
  globalThis.mvNavigationV16282={home:goHome,back:goBack,navigate,openMenu,closeMenu,get page(){return current}};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.82 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.82 persistent navigation shell */
.mv-topnav-v16282{display:grid;grid-template-columns:44px 44px 44px minmax(0,1fr);gap:7px;align-items:center;position:sticky;top:8px;z-index:80;background:#0b2d5d;border:1px solid #173e72;border-radius:14px;padding:7px 9px;box-shadow:0 8px 24px #0b234133;margin:8px 0;color:#fff}
.mv-topnav-v16282 button{width:44px!important;height:42px!important;min-height:42px!important;padding:0!important;background:#123e78!important;color:#c8ff00!important;border:1px solid #2a578e!important;border-radius:10px!important;font-size:22px!important;line-height:1!important;font-weight:900!important}
.mv-topnav-v16282 button:disabled{opacity:.38!important}.mv-topnav-v16282 strong{padding-left:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px;color:#c8ff00;letter-spacing:.01em}
#app .nav [data-p].mv-current-v16282{outline:2px solid #c8ff00!important;outline-offset:-2px!important;font-weight:900!important}
@media(max-width:820px){
  .mv-topnav-v16282{top:6px;margin:6px 0 8px}
  #app .nav{position:fixed!important;left:10px!important;right:10px!important;top:66px!important;bottom:auto!important;z-index:79!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important;max-height:calc(100dvh - 82px)!important;overflow:auto!important;padding:10px!important;margin:0!important;border-radius:14px!important;background:#0b2d5d!important;border:1px solid #1d4c82!important;box-shadow:0 18px 50px #06172d88!important}
  #app .nav.mv-nav-collapsed-v16282{display:none!important}
  #app .nav button{width:100%!important;min-width:0!important;min-height:42px!important;padding:10px 8px!important;background:#123e78!important;border:1px solid #2b5689!important;border-radius:9px!important;color:#c8ff00!important;font-size:12px!important;text-align:left!important;white-space:normal!important}
  #app .nav [data-p].mv-current-v16282{background:#1767cf!important;color:#fff!important;border-color:#c8ff00!important}
  #app .nav #sair{grid-column:1/-1!important;background:#f6f8fb!important;color:#173052!important;text-align:center!important}
  body.mv-menu-open-v16282:after{content:'';position:fixed;inset:0;background:#07172966;z-index:70;pointer-events:none}
}
@media(min-width:821px){#mvMenuToggleV16282{display:none!important}.mv-topnav-v16282{grid-template-columns:44px 44px minmax(0,1fr)}#mvBackV16282{grid-column:1}#mvHomeV16282{grid-column:2}#mvPageTitleV16282{grid-column:3}}
`;
if(!s.includes('</style>'))throw new Error('v162.82 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.82: persistent navigation, back/home and auto-collapse installed');