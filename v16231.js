const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const guard=`<script id="mvStartupGuardV16231">
(function(){
  let firstError='';
  const remember=x=>{if(!firstError)firstError=String(x||'Erro desconhecido').slice(0,240)};
  window.addEventListener('error',e=>remember(e?.message||e?.error?.message));
  window.addEventListener('unhandledrejection',e=>remember(e?.reason?.message||e?.reason));
  function visible(el){if(!el)return false;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0&&r.width>5&&r.height>5}
  function recover(){
    try{
      document.documentElement.style.visibility='visible';document.documentElement.style.opacity='1';
      document.body.style.visibility='visible';document.body.style.opacity='1';document.body.style.display='block';
      const root=document.querySelector('.w'),auth=document.getElementById('auth'),app=document.getElementById('app');
      if(root){root.style.visibility='visible';root.style.opacity='1';if(getComputedStyle(root).display==='none')root.style.display='block'}
      if(visible(root)&&(visible(auth)||visible(app)))return;
      const old=document.getElementById('mvStartupRecoveryV16231');if(old)return;
      const box=document.createElement('div');box.id='mvStartupRecoveryV16231';
      box.style.cssText='position:fixed;inset:12px;z-index:2147483647;background:#fff;color:#17213a;border:1px solid #d7dee8;border-radius:16px;padding:18px;box-shadow:0 12px 40px #0002;font:14px system-ui;overflow:auto';
      box.innerHTML='<b style="font-size:17px">Movvant não concluiu a inicialização</b><p style="line-height:1.45">A tela em branco foi interceptada. O aplicativo não ficará mais sem informação.</p>'+(firstError?'<p style="padding:10px;background:#fff4f2;border-radius:10px;word-break:break-word"><b>Falha detectada:</b> '+firstError.replace(/[&<>]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]))+'</p>':'')+'<button id="mvStartupReloadV16231" style="width:100%;padding:12px;border:0;border-radius:10px;background:#163b78;color:#fff;font-weight:700">Recarregar Movvant</button>';
      document.body.appendChild(box);document.getElementById('mvStartupReloadV16231').onclick=()=>location.reload();
    }catch(_){}
  }
  setTimeout(recover,2200);setTimeout(recover,5000);
})();
</script>`;
if(!s.includes('<body>'))throw new Error('v162.31 body anchor not found');
s=s.replace('<body>','<body>'+guard);
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.31: early blank-screen watchdog and startup recovery active');
