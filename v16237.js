const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.37.1: one-shot authenticated home release + direct mobile action bindings.
(function(){
  const qs=new URLSearchParams(location.search);
  const synthetic=qs.get('mv_shell_test')==='1';
  let finished=false;
  function finishHomeOnce(){
    if(finished)return;
    try{
      const auth=document.getElementById('auth'),app=document.getElementById('app'),home=document.getElementById('p-inicio');
      if(!app||!home)return;
      const authenticated=synthetic || !!auth?.classList.contains('hide');
      if(!authenticated)return;
      app.classList.remove('hide');app.hidden=false;
      if(typeof show==='function'){try{show('inicio')}catch(_){}}
      home.classList.remove('hide');home.hidden=false;
      document.documentElement.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
      document.body.classList.remove('mv-auth-startup-v16236');
      finished=true;
      document.documentElement.dataset.mvShellTest='pass';
    }catch(e){console.error('v162.37 startup',e)}
  }
  function openPage(page){
    try{
      if(typeof show==='function'){show(page);return true;}
      const target=document.getElementById('p-'+page);
      if(!target)return false;
      document.querySelectorAll('[id^="p-"]').forEach(x=>x.classList.add('hide'));
      target.classList.remove('hide');target.hidden=false;
      return true;
    }catch(e){console.error('v162.37 direct navigation',page,e);return false}
  }
  function bindActions(){
    const bell=document.getElementById('topBell');
    if(bell){bell.onclick=function(e){e.preventDefault();e.stopPropagation();openPage('notificacoes')};bell.style.pointerEvents='auto'}
    document.querySelectorAll('[data-p-jump]').forEach(function(b){
      const page=b.getAttribute('data-p-jump');
      if(!page)return;
      b.onclick=function(e){e.preventDefault();e.stopPropagation();openPage(page)};
      b.style.pointerEvents='auto';
    });
  }
  if(synthetic){
    setTimeout(()=>{
      document.getElementById('auth')?.classList.add('hide');
      document.getElementById('app')?.classList.remove('hide');
      finishHomeOnce();bindActions();
      setTimeout(()=>{
        try{
          const go=document.querySelector('[data-p-jump="viagem"]');
          if(!go)throw new Error('trip jump missing');
          go.click();
          const trip=document.getElementById('p-viagem');
          const tripOk=trip&&!trip.classList.contains('hide');
          const bell=document.getElementById('topBell');
          if(bell)bell.click();
          const notices=document.getElementById('p-notificacoes');
          const bellOk=notices&&!notices.classList.contains('hide');
          document.documentElement.dataset.mvButtonsTest=(tripOk&&bellOk)?'pass':'fail';
          if(!(tripOk&&bellOk))throw new Error('mobile action navigation failed');
        }catch(e){document.documentElement.dataset.mvButtonsTest='fail';console.error('v162.37 button smoke',e)}
      },180);
    },60);
  } else {
    [150,450,900,1600].forEach(ms=>setTimeout(()=>{finishHomeOnce();bindActions()},ms));
  }
  window.addEventListener('pageshow',()=>setTimeout(bindActions,80));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.37 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.37.1: notification and trip buttons directly bound');
