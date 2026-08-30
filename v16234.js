const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.34: hard recovery for Android/WebView state where the shell header loads but no page content is visible.
(function(){
  function shown(el){
    if(!el)return false;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0&&r.width>5&&r.height>5;
  }
  function authShown(){return shown(document.getElementById('auth'))}
  function recover(){
    try{
      if(authShown())return;
      const app=document.getElementById('app');
      const home=document.getElementById('p-inicio');
      if(!app||!home)return;
      const pages=[...app.querySelectorAll('section[id^="p-"]')];
      if(pages.some(shown))return;

      // Do not use app geometry as a prerequisite: when all pages are hidden the app may have zero height.
      app.classList.remove('hide');
      app.hidden=false;
      app.style.setProperty('display','block','important');
      app.style.setProperty('visibility','visible','important');
      app.style.setProperty('opacity','1','important');

      pages.forEach(p=>{
        if(p===home){
          p.classList.remove('hide');
          p.hidden=false;
          p.style.setProperty('display','block','important');
          p.style.setProperty('visibility','visible','important');
          p.style.setProperty('opacity','1','important');
        }else{
          p.classList.add('hide');
          p.style.removeProperty('display');
          p.style.removeProperty('visibility');
          p.style.removeProperty('opacity');
        }
      });

      let x=home.parentElement;
      while(x&&x!==document.body){
        if(x===app||app.contains(x)){
          x.hidden=false;
          x.classList.remove('hide');
          if(getComputedStyle(x).display==='none')x.style.setProperty('display','block','important');
          x.style.removeProperty('visibility');
          x.style.removeProperty('opacity');
        }
        if(x===app)break;
        x=x.parentElement;
      }

      ['mv-lock-v1629','menu-open-v136','mv-drawer-open-v1625','mv1626-lock'].forEach(c=>{
        document.documentElement.classList.remove(c);document.body.classList.remove(c);
      });
      document.documentElement.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('height');
      console.warn('Movvant v162.34: Android empty-shell state recovered to home');
    }catch(e){console.error('v162.34 hard content recovery',e)}
  }
  window.addEventListener('pageshow',()=>setTimeout(recover,80));
  window.addEventListener('focus',()=>setTimeout(recover,80));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(recover,80)});
  [150,600,1400,3000,6000].forEach(ms=>setTimeout(recover,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.34 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.34: hard Android empty-shell recovery active');
