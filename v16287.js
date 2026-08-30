const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.89: one canonical shell, home-only dashboard, collapsible desktop sidebar.
(function(){
 const byId=id=>document.getElementById(id);
 const nav=()=>document.querySelector('#app>.nav');
 const app=()=>byId('app');
 const isDesktop=()=>innerWidth>=900;
 const COLLAPSE_KEY='mv_sidebar_collapsed_v16289';
 function appVisible(){const a=app();return !!a&&!a.classList.contains('hide')}
 function hideLegacyHeader(){
   const status=byId('status');
   const legacy=status?.closest?.('.c');
   if(legacy&&legacy.parentElement?.classList.contains('w')){
     legacy.classList.add('mv-legacy-shell89');
     legacy.setAttribute('aria-hidden',appVisible()?'true':'false');
   }
 }
 function cleanTop(){
   document.querySelectorAll('#app > header:not(#mvTopNavV16282),#app > .top:not(#mvTopNavV16282),#app > .topbar:not(#mvTopNavV16282),#app > .appbar:not(#mvTopNavV16282),#app > .header:not(#mvTopNavV16282)').forEach(x=>x.classList.add('mv-legacy-shell89'));
   const bar=byId('mvTopNavV16282');
   if(bar){
     bar.classList.add('mv-canonical-top89');
     const title=byId('mvPageTitleV16282');if(title)title.setAttribute('aria-live','polite');
     const menu=byId('mvMenuToggleV16282');if(menu){menu.style.removeProperty('display');menu.setAttribute('aria-label',isDesktop()?'Recolher menu lateral':'Abrir menu')}
   }
 }
 function rebuildSidebar(){
   const n=nav();if(!n||n.dataset.mvCanonical89==='1')return;
   const items=[...n.querySelectorAll('[data-p]')].map(b=>({p:b.dataset.p,label:(b.textContent||'').trim()})).filter(x=>x.p);
   const logout=n.querySelector('#sair');
   n.innerHTML='';n.dataset.mvCanonical89='1';n.classList.add('mv-sidebar89');
   const brand=document.createElement('div');brand.className='mv-sidebrand89';brand.innerHTML='<strong>Movvant</strong><small>Inteligência comercial em campo</small>';n.appendChild(brand);
   const list=document.createElement('div');list.className='mv-sidelinks89';
   items.forEach(x=>{const b=document.createElement('button');b.type='button';b.dataset.p=x.p;b.textContent=x.label;list.appendChild(b)});n.appendChild(list);
   const out=document.createElement('button');out.id='sair';out.type='button';out.className='sec mv-logout89';out.textContent=logout?.textContent?.trim()||'Sair';n.appendChild(out);
 }
 function currentPage(){return document.body.dataset.mvPage||globalThis.mvNavigationV16282?.page||'inicio'}
 function syncPage(){
   const p=currentPage();
   document.body.classList.toggle('mv-home-active89',p==='inicio');
   const home=byId('mvHome88');if(home)home.setAttribute('aria-hidden',p==='inicio'?'false':'true');
 }
 function setCollapsed(v,persist=true){
   if(!isDesktop())v=false;
   document.body.classList.toggle('mv-sidebar-collapsed89',!!v);
   const menu=byId('mvMenuToggleV16282');if(menu){menu.setAttribute('aria-expanded',String(!v));menu.setAttribute('aria-label',v?'Expandir menu lateral':'Recolher menu lateral')}
   if(persist){try{localStorage.setItem(COLLAPSE_KEY,v?'1':'0')}catch(_){}}
 }
 function toggleDesktop(){setCollapsed(!document.body.classList.contains('mv-sidebar-collapsed89'));}
 function restoreCollapse(){let v=false;try{v=localStorage.getItem(COLLAPSE_KEY)==='1'}catch(_){}setCollapsed(v,false)}
 function wrapMenuApi(){
   const a=globalThis.mvNavigationV16282;if(!a||a.__mv89)return false;
   const oldOpen=a.openMenu?.bind(a),oldClose=a.closeMenu?.bind(a);
   a.openMenu=function(){if(isDesktop()){toggleDesktop();return}return oldOpen?.()};
   a.closeMenu=function(){if(isDesktop())return;return oldClose?.()};
   a.__mv89=true;return true
 }
 function sync(){hideLegacyHeader();cleanTop();rebuildSidebar();wrapMenuApi();syncPage();if(isDesktop())restoreCollapse();else document.body.classList.remove('mv-sidebar-collapsed89')}
 [0,80,220,600,1200,2200].forEach(ms=>setTimeout(sync,ms));
 addEventListener('resize',()=>requestAnimationFrame(()=>{cleanTop();if(isDesktop())restoreCollapse();else document.body.classList.remove('mv-sidebar-collapsed89')}));
 const pageObserver=new MutationObserver(()=>requestAnimationFrame(syncPage));
 try{pageObserver.observe(document.body,{attributes:true,attributeFilter:['data-mv-page']})}catch(_){}
 globalThis.mvShellV16289={sync,toggleSidebar:toggleDesktop,setCollapsed};
})();
`;
if(!s.includes('carga();'))throw new Error('v162.89 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.89: canonical shell only */
body #mvHome88{display:none!important}
body[data-mv-page="inicio"] #p-inicio:not(.hide) #mvHome88,body.mv-home-active89 #p-inicio:not(.hide) #mvHome88{display:block!important}
body:not([data-mv-page="inicio"]):not(.mv-home-active89) #mvHome88{display:none!important}
body #p-inicio.hide #mvHome88{display:none!important}
body .mv-legacy-shell89{display:none!important;visibility:hidden!important;pointer-events:none!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}
#app>.nav.mv-sidebar89{overflow:hidden!important}
.mv-sidebrand89{flex:0 0 auto;display:grid;gap:2px;padding:17px 11px 13px;margin:0 2px 8px;border-bottom:1px solid #193553;color:#fff}.mv-sidebrand89 strong{font-size:20px;line-height:1;color:#fff}.mv-sidebrand89 small{font-size:9px;line-height:1.3;color:#c8ff00;letter-spacing:.02em}.mv-sidelinks89{display:flex;flex-direction:column;gap:4px;overflow:auto;min-height:0;flex:1;padding:0 2px}.mv-sidebar89>.mv-sidelinks89>button{flex:0 0 auto}.mv-logout89{flex:0 0 auto;margin-top:8px!important}
@media(min-width:900px){
 #mvMenuToggleV16282{display:block!important;grid-column:1!important}
 #mvBackV16282{grid-column:2!important}#mvHomeV16282{grid-column:3!important}#mvPageTitleV16282{grid-column:4!important}
 #mvTopNavV16282{grid-template-columns:44px 44px 44px minmax(0,1fr)!important}
 body.mv-desktop88 #app>.nav.mv-sidebar89,body.mv-wide88 #app>.nav.mv-sidebar89{display:flex!important;transform:translateX(0);transition:transform .18s ease!important}
 body.mv-sidebar-collapsed89 #app>.nav.mv-sidebar89{transform:translateX(-105%)!important;pointer-events:none!important}
 body.mv-sidebar-collapsed89 #app,body.mv-sidebar-collapsed89.mv-desktop88 #app,body.mv-sidebar-collapsed89.mv-wide88 #app{padding-left:0!important}
 body.mv-sidebar-collapsed89 #p-inicio,body.mv-sidebar-collapsed89 #mvHome88{width:100vw!important;min-width:100vw!important;max-width:100vw!important}
}
@media(max-width:899px){
 .mv-sidebrand89{padding:9px 8px 10px;grid-column:1/-1}.mv-sidebrand89 strong{font-size:17px}.mv-sidebrand89 small{font-size:8px}.mv-sidelinks89{display:contents}.mv-logout89{grid-column:1/-1!important}
}
`;
if(!s.includes('</style>'))throw new Error('v162.89 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.89: canonical shell, home-only dashboard and collapsible desktop sidebar installed');