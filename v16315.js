const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const runtime=`<script id="mvDesktopHeaderRuntime144">
(function(){
 const ID='mvDesktopHeader144';
 const html='<div class="mv-dbrand132"><span class="mv-dmark132">M</span><span><strong>Movvant</strong><small>INTELIGÊNCIA COMERCIAL EM CAMPO</small></span></div><div id="mvDesktopTitle144">Dashboard</div><button class="mv-dbell132" type="button" aria-label="Notificações">●</button>';
 function ensure(){
  if(window.innerWidth<900)return;
  let h=document.getElementById(ID);
  if(!h){h=document.createElement('header');h.id=ID;h.className='mv-desktop-header144';h.innerHTML=html;document.body.appendChild(h)}
  h.style.cssText='display:grid!important;grid-template-columns:minmax(260px,1fr) auto minmax(260px,1fr)!important;align-items:center!important;position:fixed!important;left:0!important;right:0!important;top:0!important;height:56px!important;padding:0 24px!important;background:#082b50!important;color:#fff!important;visibility:visible!important;opacity:1!important;z-index:2147483647!important;box-sizing:border-box!important;border-bottom:1px solid #17446f!important;box-shadow:0 1px 5px rgba(8,32,58,.16)!important';
  const old132=document.getElementById('mvDesktopHeader132');if(old132&&old132!==h)old132.style.setProperty('display','none','important');
  const old143=document.getElementById('mvDesktopHeader143');if(old143&&old143!==h)old143.style.setProperty('display','none','important');
 }
 function boot(){ensure();[50,150,350,700,1200,2000,3200,5000].forEach(t=>setTimeout(ensure,t))}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 window.addEventListener('load',boot,{once:true});window.addEventListener('pageshow',boot,true);window.addEventListener('resize',ensure);
})();
</script>`;
if(!s.includes('</body>')) throw new Error('body close not found');
s=s.replace('</body>',runtime+'\n</body>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.44 document-end desktop header runtime');
