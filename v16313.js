const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 const headerHtml='<div class="mv-dbrand132"><span class="mv-dmark132">M</span><span><strong>Movvant</strong><small>INTELIGÊNCIA COMERCIAL EM CAMPO</small></span></div><div id="mvDesktopTitle132">Dashboard</div><button class="mv-dbell132" type="button" aria-label="Notificações">●</button>';
 function ensure(){
  if(innerWidth<900)return;
  let h=document.getElementById('mvDesktopHeader132');
  if(!h){h=document.createElement('header');h.id='mvDesktopHeader132';document.body.insertBefore(h,document.body.firstChild)}
  if(!h.querySelector('.mv-dbrand132')||!h.querySelector('#mvDesktopTitle132'))h.innerHTML=headerHtml;
  h.style.setProperty('display','grid','important');h.style.setProperty('visibility','visible','important');h.style.setProperty('opacity','1','important');h.style.setProperty('background','#082b50','important');
 }
 function boot(){ensure();setTimeout(ensure,60);setTimeout(ensure,300);setTimeout(ensure,1000);setTimeout(ensure,2200)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 addEventListener('pageshow',boot,true);addEventListener('resize',ensure);
})();`;
const marker='carga();';
const i=s.lastIndexOf(marker);
if(i<0)throw new Error('carga marker not found');
s=s.slice(0,i+marker.length)+'\n'+js+s.slice(i+marker.length);
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.42 post-start desktop header authority');
