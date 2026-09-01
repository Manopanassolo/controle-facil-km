const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.58: bind Google Agenda integration to the actually visible Agenda workspace.
(function(){
  const byId=id=>document.getElementById(id);
  const visible=el=>{if(!el)return false;const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'&&cs.opacity!=='0'};
  function visibleAgendaTitle(){
    return [...document.querySelectorAll('h1,h2,h3')].find(h=>visible(h)&&h.textContent.trim()==='Agenda')||null;
  }
  function visibleAgendaHost(){
    const title=visibleAgendaTitle();if(!title)return null;
    let n=title.parentElement;
    for(let i=0;i<6&&n;i++,n=n.parentElement){
      if(!visible(n))continue;
      const txt=n.textContent||'';
      if(txt.includes('Novo compromisso')||txt.includes('Adicionar compromisso')||txt.includes('Próximos compromissos'))return n;
    }
    return title.parentElement||null;
  }
  function buildCard(){
    const x=document.createElement('section');x.id='mvGoogleCalendar16355';x.className='mv-google-cal16355';
    x.innerHTML='<div class="mv-google-cal-head16355"><div><small>INTEGRAÇÃO</small><h3>Google Agenda</h3><p id="mvGoogleCalendarText16355">Verificando conexão...</p></div><span id="mvGoogleCalendarBadge16355">...</span></div><div class="mv-google-cal-actions16355"><button type="button" id="mvGoogleCalendarConnect16355">Conectar Google Agenda</button><button type="button" id="mvGoogleCalendarSync16355" class="sec">Sincronizar pendentes</button><button type="button" id="mvGoogleCalendarDisconnect16355" class="sec">Desconectar</button></div>';
    return x;
  }
  async function directConnect(){
    try{
      const st=await globalThis.mvGoogleCalendarV16355?.refreshStatus?.();if(st?.connected)return;
      const sess=(await sb.auth.getSession()).data.session;const t=sess?.access_token||'';const orgId=globalThis.org?.id||org?.id;if(!t||!orgId)return;
      const r=await fetch('/api/google-calendar/auth-url?organization_id='+encodeURIComponent(orgId),{headers:{Authorization:'Bearer '+t}});const j=await r.json().catch(()=>({}));
      if(j.url)location.href=j.url;else if(typeof msg==='function')msg('Não foi possível iniciar a conexão com o Google.',true);
    }catch(e){console.warn('v163.58 google connect',e);if(typeof msg==='function')msg('Falha ao abrir autorização do Google.',true)}
  }
  function bindButtons(){
    const c=byId('mvGoogleCalendarConnect16355'),s=byId('mvGoogleCalendarSync16355'),d=byId('mvGoogleCalendarDisconnect16355');
    if(c)c.onclick=directConnect;
    if(s)s.onclick=()=>globalThis.mvGoogleCalendarV16355?.syncPending?.();
    if(d)d.onclick=async()=>{try{const sess=(await sb.auth.getSession()).data.session;const t=sess?.access_token||'';const orgId=globalThis.org?.id||org?.id;if(!t||!orgId)return;await fetch('/api/google-calendar/disconnect',{method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify({organization_id:orgId})});await globalThis.mvGoogleCalendarV16355?.refreshStatus?.()}catch(e){console.warn(e)}};
  }
  function place(){
    const host=visibleAgendaHost();if(!host)return false;
    let card=byId('mvGoogleCalendar16355');
    if(!card)card=buildCard();
    if(!visible(card)||!host.contains(card)){
      const title=visibleAgendaTitle();
      const anchor=title?.parentElement||host.firstElementChild;
      if(anchor&&anchor.parentElement===host)anchor.insertAdjacentElement('afterend',card);else host.insertBefore(card,host.firstChild);
    }
    card.hidden=false;card.style.display='block';card.setAttribute('data-mv-visible-agenda','163.58');
    bindButtons();setTimeout(()=>globalThis.mvGoogleCalendarV16355?.refreshStatus?.(),50);return true;
  }
  const run=()=>place();
  [0,100,300,700,1400,2500,4000].forEach(ms=>setTimeout(run,ms));
  document.addEventListener('click',e=>{const t=e.target;if(t.closest?.('[data-p="agenda"],[data-p-jump="agenda"],[data-mv-dock="agenda"]')||(t.textContent||'').trim()==='Agenda')setTimeout(run,80)},true);
  new MutationObserver(()=>{const card=byId('mvGoogleCalendar16355');if(!card||!visible(card))run()}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});
  globalThis.mvGoogleAgendaVisibleV16358={place:run};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.58 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.58 visible Google Agenda binding installed');
