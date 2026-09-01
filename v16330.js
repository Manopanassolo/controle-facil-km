const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.60: single visible Google Agenda authority.
(function(){
  const byId=id=>document.getElementById(id);
  let busy=false;
  const visible=el=>{if(!el)return false;const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity)!==0};
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
  function agendaTitle(){return [...document.querySelectorAll('h1,h2,h3')].find(h=>visible(h)&&h.textContent.trim()==='Agenda')||null}
  function agendaHost(){
    const title=agendaTitle();if(!title)return byId('p-agenda');let n=title.parentElement;
    for(let i=0;i<6&&n;i++,n=n.parentElement){if(!visible(n))continue;const txt=n.textContent||'';if(txt.includes('Novo compromisso')||txt.includes('Adicionar compromisso')||txt.includes('Próximos compromissos'))return n}
    return title.parentElement||byId('p-agenda');
  }
  function buildCard(){
    const x=document.createElement('section');x.id='mvGoogleCalendar16355';x.className='mv-google-cal16355';
    x.innerHTML='<div class="mv-google-cal-head16355"><div><small>INTEGRAÇÃO</small><h3>Google Agenda</h3><p id="mvGoogleCalendarText16355">Verificando conexão...</p></div><span id="mvGoogleCalendarBadge16355">...</span></div><div class="mv-google-cal-actions16355"><button type="button" id="mvGoogleCalendarConnect16355">Conectar Google Agenda</button><button type="button" id="mvGoogleCalendarSync16355" class="sec">Sincronizar pendentes</button><button type="button" id="mvGoogleCalendarDisconnect16355" class="sec">Desconectar</button></div>';
    return x;
  }
  function place(){
    const host=agendaHost();if(!host)return null;let card=byId('mvGoogleCalendar16355');if(!card)card=buildCard();
    if(!host.contains(card)){const title=agendaTitle(),anchor=title?.parentElement;if(anchor&&anchor.parentElement===host)anchor.insertAdjacentElement('afterend',card);else host.insertBefore(card,host.firstChild)}
    card.hidden=false;card.style.display='block';card.dataset.mvGoogleAuthority='163.60';return card;
  }
  function connectButton(){const card=place();if(!card)return null;return card.querySelector('#mvGoogleCalendarConnect16355')||[...card.querySelectorAll('button')].find(b=>(b.textContent||'').trim().includes('Conectar Google Agenda'))||null}
  function stripLegacyConnectHandler(){
    const b=connectButton();if(!b)return null;if(b.dataset.mvConnectAuthority==='163.60'){b.disabled=false;b.removeAttribute('disabled');b.removeAttribute('aria-disabled');b.style.pointerEvents='auto';return b}
    const clean=b.cloneNode(true);clean.disabled=false;clean.hidden=false;clean.removeAttribute('disabled');clean.removeAttribute('aria-disabled');clean.style.pointerEvents='auto';clean.dataset.mvConnectAuthority='163.60';b.replaceWith(clean);return clean;
  }
  async function connect(e){
    const b=e?.target?.closest?.('#mvGoogleCalendar16355 button')||connectButton();if(!b||busy)return;
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
  async function disconnect(){
    try{const token=await accessToken(),oid=orgId();if(!token||!oid)return notice('Não foi possível identificar a sessão para desconectar.');const r=await fetch('/api/google-calendar/disconnect',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({organization_id:oid})});if(!r.ok)return notice('Não foi possível desconectar o Google Agenda. Código '+r.status+'.');await globalThis.mvGoogleCalendarV16355?.refreshStatus?.()}catch(err){console.error(err);notice('Falha ao desconectar o Google Agenda.')}
  }
  document.addEventListener('click',function(e){
    const b=e.target?.closest?.('#mvGoogleCalendar16355 button');if(!b)return;
    if(b.id==='mvGoogleCalendarConnect16355'||(b.textContent||'').includes('Conectar Google Agenda')){e.preventDefault();e.stopImmediatePropagation();connect(e);return}
    if(b.id==='mvGoogleCalendarSync16355'){e.preventDefault();e.stopImmediatePropagation();globalThis.mvGoogleCalendarV16355?.syncPending?.();return}
    if(b.id==='mvGoogleCalendarDisconnect16355'){e.preventDefault();e.stopImmediatePropagation();disconnect();return}
  },true);
  function bind(){place();stripLegacyConnectHandler()}
  [0,100,300,800,1600,3000].forEach(ms=>setTimeout(bind,ms));
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-p="agenda"],[data-p-jump="agenda"],[data-mv-dock="agenda"],[data-mvroute="agenda"]')||(e.target?.textContent||'').trim()==='Agenda')[60,180,420].forEach(ms=>setTimeout(bind,ms))},true);
  globalThis.mvGoogleConnectV16360={connect,disconnect,bind,place,orgId,accessToken};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.60 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.60 single visible Google Agenda authority installed');
