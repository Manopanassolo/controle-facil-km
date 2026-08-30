const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.36: deterministic authenticated home shell on Android/WebView.
(function(){
  let released=false,started=false;
  const qs=new URLSearchParams(location.search);
  const synthetic=qs.get('mv_shell_test')==='1';
  function visible(el){
    if(!el)return false;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0&&r.width>20&&r.height>40;
  }
  function forceHome(){
    if(released)return;
    try{
      const auth=document.getElementById('auth'),app=document.getElementById('app'),home=document.getElementById('p-inicio');
      if(!app||!home)return;
      const authenticated=synthetic || !!(auth&&auth.classList.contains('hide'));
      if(!authenticated)return;
      started=true;
      document.body.classList.add('mv-auth-startup-v16236');
      app.classList.remove('hide');app.hidden=false;
      app.style.removeProperty('display');app.style.removeProperty('visibility');app.style.removeProperty('opacity');
      [...app.querySelectorAll('[id^="p-"]')].forEach(p=>{
        if(p===home){p.classList.remove('hide');p.hidden=false;p.style.removeProperty('display');p.style.removeProperty('visibility');p.style.removeProperty('opacity')}
        else if(!released){p.classList.add('hide')}
      });
      if(typeof show==='function'){try{show('inicio')}catch(_){}}
      home.classList.remove('hide');home.hidden=false;
      document.documentElement.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
      setTimeout(()=>{
        const ok=visible(home)&&visible(home.querySelector('.c'));
        document.documentElement.dataset.mvShellTest=ok?'pass':'fail';
        if(!ok){
          home.style.setProperty('display','block','important');
          home.style.setProperty('visibility','visible','important');
          home.style.setProperty('opacity','1','important');
          const card=home.querySelector('.c');if(card){card.style.setProperty('display','block','important');card.style.setProperty('visibility','visible','important');card.style.setProperty('opacity','1','important')}
        }
      },120);
    }catch(e){console.error('v162.36 force home',e)}
  }
  document.addEventListener('click',e=>{
    if(!started)return;
    const nav=e.target.closest?.('[data-page],[data-p]');
    if(nav){released=true;document.body.classList.remove('mv-auth-startup-v16236')}
  },true);
  if(synthetic){
    setTimeout(()=>{document.getElementById('auth')?.classList.add('hide');document.getElementById('app')?.classList.remove('hide');forceHome()},60);
  }
  window.addEventListener('pageshow',()=>setTimeout(forceHome,80));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(forceHome,80)});
  [120,350,800,1500,3000,5500,9000].forEach(ms=>setTimeout(forceHome,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.36 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.36 authenticated startup shell */
body.mv-auth-startup-v16236 #app{display:block!important;visibility:visible!important;opacity:1!important}
body.mv-auth-startup-v16236 #p-inicio{display:block!important;visibility:visible!important;opacity:1!important;min-height:300px!important}
body.mv-auth-startup-v16236 #p-inicio>.c:first-child{display:block!important;visibility:visible!important;opacity:1!important}
`;
if(!s.includes('</style>'))throw new Error('v162.36 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.36: deterministic authenticated Android home shell active');
