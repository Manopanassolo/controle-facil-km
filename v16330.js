const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.60: single Google Agenda connect authority.
(function(){
  const byId=id=>document.getElementById(id);
  let busy=false;
  function orgId(){
    try{if(typeof org!=='undefined'&&org?.id)return org.id}catch(_){ }
    try{if(globalThis.org?.id)return globalThis.org.id}catch(_){ }
    try{if(typeof ses!=='undefined'&&ses?.user?.user_metadata?.organization_id)return ses.user.user_metadata.organization_id}catch(_){ }
    try{if(globalThis.ses?.user?.user_metadata?.organization_id)return globalThis.ses.user.user_metadata.organization_id}catch(_){ }
    return '';
  }
  async function accessToken(){
    try{if(typeof sb!=='undefined'&&sb?.auth?.getSession){return (await sb.auth.getSession())?.data?.session?.access_token||''}}catch(_){ }
    try{if(globalThis.sb?.auth?.getSession){return (await globalThis.sb.auth.getSession())?.data?.session?.access_token||''}}catch(_){ }
    try{if(typeof ses!=='undefined'&&ses?.access_token)return ses.access_token}catch(_){ }
    try{if(globalThis.ses?.access_token)return globalThis.ses.access_token}catch(_){ }
    return '';
  }
  function notice(text,isError=true){
    console[isError?'error':'log']('[Movvant Google Agenda]',text);
    try{if(typeof msg==='function')msg(text,isError)}catch(_){ }
    const old=byId('mvGoogleCalendarDiag16360');if(old)old.remove();
    const card=byId('mvGoogleCalendar16355');if(!card)return;
    const x=document.createElement('div');x.id='mvGoogleCalendarDiag16360';x.textContent=text;x.style.cssText='margin-top:8px;padding:8px 10px;border-radius:7px;font-size:10px;font-weight:700;background:'+(isError?'#fff0f0':'#eef8ee')+';color:'+(isError?'#a62929':'#216b35');card.appendChild(x);
  }
  function connectButton(){
    const card=byId('mvGoogleCalendar16355');
    if(!card)return byId('mvGoogleCalendarConnect16355');
    return card.querySelector('#mvGoogleCalendarConnect16355')||[...card.querySelectorAll('button')].find(b=>(b.textContent||'').trim().includes('Conectar Google Agenda'))||null;
  }
  function stripLegacyConnectHandler(){
    const b=connectButton();if(!b)return null;
    if(b.dataset.mvConnectAuthority==='163.60')return b;
    const clean=b.cloneNode(true);
    clean.disabled=false;clean.hidden=false;clean.removeAttribute('disabled');clean.removeAttribute('aria-disabled');clean.style.pointerEvents='auto';clean.dataset.mvConnectAuthority='163.60';
    b.replaceWith(clean);return clean;
  }
  async function connect(e){
    const b=e?.target?.closest?.('#mvGoogleCalendar16355 button')||connectButton();
    if(!b||busy)return;
    busy=true;b.disabled=true;const old=b.textContent;b.textContent='Abrindo Google...';
    try{
      const token=await accessToken();if(!token){notice('Não foi possível obter a sessão atual. Atualize a página e tente novamente.');return}
      const oid=orgId();if(!oid){notice('Não foi possível identificar a empresa desta sessão. Atualize a página e tente novamente.');return}
      const url='/api/google-calendar/auth-url?organization_id='+encodeURIComponent(oid)+'&_='+Date.now();
      const r=await fetch(url,{method:'GET',headers:{Authorization:'Bearer '+token,Accept:'application/json'},cache:'no-store',credentials:'same-origin'});
      const ct=String(r.headers.get('content-type')||'');let data={};
      if(ct.includes('application/json'))data=await r.json().catch(()=>({}));
      else{const text=await r.text().catch(()=>'');console.error('Google auth-url non-JSON',r.status,ct,text.slice(0,200));notice('A rota do Google Agenda respondeu em formato inválido. Código '+r.status+'.');return}
      if(!r.ok){console.error('Google auth-url error',r.status,data);notice(data?.error==='google_calendar_backend_not_configured'?'O servidor não reconheceu a integração Google Agenda configurada.':'Falha ao iniciar Google Agenda. Código '+r.status+'.');return}
      if(!data?.url){notice('O servidor não retornou a URL de autorização do Google.');return}
      window.location.assign(data.url);
    }catch(err){console.error('v163.60 connect',err);notice('Falha ao abrir a autorização do Google. Verifique a conexão e tente novamente.')}finally{busy=false;if(b&&document.contains(b)){b.disabled=false;b.textContent=old||'Conectar Google Agenda'}}
  }
  document.addEventListener('click',function(e){
    const b=e.target?.closest?.('#mvGoogleCalendar16355 button');if(!b)return;
    const isConnect=b.id==='mvGoogleCalendarConnect16355'||(b.textContent||'').includes('Conectar Google Agenda');if(!isConnect)return;
    e.preventDefault();e.stopImmediatePropagation();connect(e);
  },true);
  function bind(){const b=stripLegacyConnectHandler();if(!b)return;b.disabled=false;b.removeAttribute('aria-disabled');b.style.pointerEvents='auto'}
  [0,100,300,800,1600,3000].forEach(ms=>setTimeout(bind,ms));
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-p="agenda"],[data-p-jump="agenda"],[data-mv-dock="agenda"],[data-mvroute="agenda"]'))setTimeout(bind,120)},true);
  globalThis.mvGoogleConnectV16360={connect,bind,orgId,accessToken};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.60 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.60 single Google Agenda connect authority installed');
