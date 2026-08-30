const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.37: one-shot authenticated home release; never re-lock navigation/buttons.
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
  if(synthetic){
    setTimeout(()=>{
      document.getElementById('auth')?.classList.add('hide');
      document.getElementById('app')?.classList.remove('hide');
      finishHomeOnce();
      setTimeout(()=>{
        try{
          const go=document.querySelector('[data-p-jump="viagem"]');
          if(!go)throw new Error('trip jump missing');
          go.click();
          const trip=document.getElementById('p-viagem');
          const ok=trip&&!trip.classList.contains('hide');
          document.documentElement.dataset.mvButtonsTest=ok?'pass':'fail';
          if(!ok)throw new Error('trip jump click did not navigate');
        }catch(e){document.documentElement.dataset.mvButtonsTest='fail';console.error('v162.37 button smoke',e)}
      },180);
    },60);
  } else {
    [150,450,900,1600].forEach(ms=>setTimeout(finishHomeOnce,ms));
  }
})();
`;
if(!s.includes('carga();'))throw new Error('v162.37 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.37: navigation released after one-shot authenticated startup');
