const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.33: mobile shell recovery when header is visible but every content section is hidden.
(function(){
  function isVisible(el){
    if(!el)return false;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0&&r.width>5&&r.height>5;
  }
  function recoverContent(){
    try{
      const app=document.getElementById('app');
      const auth=document.getElementById('auth');
      if(!app||!isVisible(app)||isVisible(auth))return;
      const pages=[...app.querySelectorAll(':scope > section[id^="p-"]')];
      if(!pages.length)return;
      const any=pages.some(isVisible);
      if(any)return;
      const home=document.getElementById('p-inicio');
      if(!home)return;
      pages.forEach(p=>{if(p!==home)p.classList.add('hide')});
      home.classList.remove('hide');
      home.style.removeProperty('display');
      home.style.removeProperty('visibility');
      home.style.removeProperty('opacity');
      app.classList.remove('hide');
      app.style.removeProperty('display');
      document.body.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('overflow');
      console.warn('Movvant v162.33: recovered hidden content shell to home');
    }catch(e){console.error('v162.33 content recovery',e)}
  }
  window.addEventListener('pageshow',()=>setTimeout(recoverContent,100));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(recoverContent,100)});
  setTimeout(recoverContent,500);
  setTimeout(recoverContent,1500);
  setTimeout(recoverContent,3500);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.33 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.33: mobile hidden-content recovery active');
