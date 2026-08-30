const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.35: always resolve an authenticated fresh load to the Movvant home page.
(function(){
  let done=false;
  function goHome(){
    if(done)return;
    try{
      const auth=document.getElementById('auth');
      const app=document.getElementById('app');
      const home=document.getElementById('p-inicio');
      if(!app||!home)return;
      const authVisible=auth&&getComputedStyle(auth).display!=='none'&&!auth.classList.contains('hide');
      if(authVisible)return;
      done=true;
      if(typeof show==='function'){
        try{show('inicio')}catch(_){}
      }
      app.classList.remove('hide');app.hidden=false;
      app.style.setProperty('display','block','important');
      [...app.querySelectorAll('section[id^="p-"]')].forEach(p=>{
        if(p===home){p.classList.remove('hide');p.hidden=false;p.style.setProperty('display','block','important')}
        else{p.classList.add('hide');p.style.removeProperty('display')}
      });
      home.style.setProperty('visibility','visible','important');
      home.style.setProperty('opacity','1','important');
      document.documentElement.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
      console.warn('Movvant v162.35: startup resolved to home');
    }catch(e){console.error('v162.35 home startup',e)}
  }
  window.addEventListener('pageshow',()=>setTimeout(goHome,120));
  setTimeout(goHome,400);
  setTimeout(goHome,1200);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.35 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.35: authenticated startup returns to home');
