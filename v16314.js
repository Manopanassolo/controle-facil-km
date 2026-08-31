const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
 const ID='mvDesktopHeader143';
 const html='<div class="mv-dbrand132"><span class="mv-dmark132">M</span><span><strong>Movvant</strong><small>INTELIGÊNCIA COMERCIAL EM CAMPO</small></span></div><div id="mvDesktopTitle143">Dashboard</div><button class="mv-dbell132" type="button" aria-label="Notificações">●</button>';
 function ensure(){
  if(innerWidth<900)return;
  let h=document.getElementById(ID);
  if(!h){h=document.createElement('header');h.id=ID;h.className='mv-desktop-header143';document.body.appendChild(h)}
  if(!h.querySelector('.mv-dbrand132'))h.innerHTML=html;
  h.style.cssText='display:grid!important;grid-template-columns:minmax(260px,1fr) auto minmax(260px,1fr)!important;align-items:center!important;position:fixed!important;left:0!important;right:0!important;top:0!important;height:56px!important;padding:0 24px!important;background:#082b50!important;color:#fff!important;visibility:visible!important;opacity:1!important;z-index:2147483000!important;box-sizing:border-box!important;';
  const old=document.getElementById('mvDesktopHeader132');if(old&&old!==h)old.style.setProperty('display','none','important');
 }
 function boot(){ensure();[50,150,400,900,1800,3200].forEach(t=>setTimeout(ensure,t))}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 addEventListener('load',boot,{once:true});addEventListener('pageshow',boot,true);addEventListener('resize',ensure);
})();`;
const marker='carga();';
const i=s.lastIndexOf(marker);
if(i<0)throw new Error('carga marker not found');
s=s.slice(0,i+marker.length)+'\n'+js+s.slice(i+marker.length);
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.43 independent desktop header authority');
