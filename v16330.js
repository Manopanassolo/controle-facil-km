const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.60: final Google Agenda connect authority. Bind the visible button in capture phase
// and fail visibly instead of silently returning when session/org/API routing is unavailable.
(function(){
  const byId=id=>document.getElementById(id);
  let busy=false;
  function orgId(){
    try{if(globalThis.org?.id)return globalThis.org.id}catch(_){ }
    try{if(typeof org!=='undefined'&&org?.id)return org.id}catch(_){ }
    try{if(globalThis.ses?.user?.user_metadata?.organization_id)return globalThis.ses.user.user_metadata.organization_id}catch(_){ }
    return '';
  }
  async function accessToken(){
    try{return (await globalThis.sb?.auth?.getSession?.())?.data?.session?.access_token||''}catch(_){return''}
  }
  function notice(text,isError=true){
    try{if(typeof msg==='function'){msg(text,isError);return}}catch(_){ }
    console[isError?'error':'log']('[Movvant Google Agenda]',text);
    const old=byId('mvGoogleCalendarDiag16360');if(old)old.remove();
    const card=byId('mvGoogleCalendar16355');if(!card)return;
    const x=document.createElement('div');x.id='mvGoogleCalendarDiag16360';x.textContent=text;x.style.cssText='margin-top:8px;padding:8px 10px;border-radius:7px;font-size:10px;font-weight:700;background:'+(isError?'#fff0f0':'#eef8ee')+';color:'+(isError?'#a62929':'#216b35');card.appendChild(x);
  }
  async function connect(e){
    const b=e?.target?.closest?.('#mvGoogleCalendarConnect16355')||byId('mvGoogleCalendarConnect16355');
    if(!b||busy)return;
    busy=true;b.disabled=true;const old=b.textContent;b.textContent='Abrindo Google...';
    try{
      const token=await accessToken();if(!token){notice('Sua sessão expirou. Entre novamente no Movvant e tente conectar o Google Agenda.');return}
      const oid=orgId();if(!oid){notice('Não foi possível identificar a empresa desta sessão. Atualize a página e tente novamente.');return}
      const url='/api/google-calendar/auth-url?organization_id='+encodeURIComponent(oid)+'&_='+Date.now();
      const r=await fetch(url,{method:'GET',headers:{Authorization:'Bearer '+token,Accept:'application/json'},cache:'no-store',credentials:'same-origin'});
      const ct=String(r.headers.get('content-type')||'');let data={};
      if(ct.includes('application/json'))data=await r.json().catch(()=>({}));
      else{const text=await r.text().catch(()=>'');console.error('Google auth-url non-JSON',r.status,ct,text.slice(0,160));notice('A rota de conexão do Google não respondeu corretamente. Código '+r.status+'.');return}
      if(!r.ok){console.error('Google auth-url error',r.status,data);notice(data?.error==='google_calendar_backend_not_configured'?'A integração Google ainda não está configurada no servidor.':'Falha ao iniciar Google Agenda. Código '+r.status+'.');return}
      if(!data?.url){notice('O servidor não retornou a autorização do Google.');return}
      window.location.assign(data.url);
    }catch(err){console.error('v163.60 connect',err);notice('Falha ao abrir a autorização do Google. Verifique a conexão e tente novamente.')}finally{busy=false;if(b&&document.contains(b)){b.disabled=false;b.textContent=old||'Conectar Google Agenda'}}
  }
  document.addEventListener('click',function(e){
    if(!e.target?.closest?.('#mvGoogleCalendarConnect16355'))return;
    e.preventDefault();e.stopImmediatePropagation();connect(e);
  },true);
  function bind(){const b=byId('mvGoogleCalendarConnect16355');if(!b)return;b.disabled=false;b.removeAttribute('aria-disabled');b.style.pointerEvents='auto';b.dataset.mvConnectAuthority='163.60'}
  [0,100,300,800,1600,3000].forEach(ms=>setTimeout(bind,ms));
  new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});
  globalThis.mvGoogleConnectV16360={connect,bind,orgId};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.60 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.60 Google Agenda connect authority installed');
