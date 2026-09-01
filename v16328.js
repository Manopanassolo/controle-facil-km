const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.56: authoritative authentication surface. Never leave the app visible behind a clipped login card.
(function(){
  const byId=id=>document.getElementById(id);
  let syncing=false,bound=false;
  function authClient(){
    try{if(typeof sb!=='undefined'&&sb?.auth)return sb}catch(_){ }
    try{if(globalThis.sb?.auth)return globalThis.sb}catch(_){ }
    return null;
  }
  function showLoggedOut(){
    const auth=byId('auth'),app=byId('app');
    document.body.dataset.mvAuth='logged-out';
    if(app)app.classList.add('hide');
    if(auth){auth.classList.remove('hide');auth.hidden=false;auth.setAttribute('aria-hidden','false')}
    document.querySelectorAll('#mvBottomDock85,#mvSideMenu82,.mv-desktop-nav85').forEach(x=>x.setAttribute('aria-hidden','true'));
  }
  function showLoggedIn(){
    const auth=byId('auth'),app=byId('app');
    document.body.dataset.mvAuth='logged-in';
    if(auth){auth.classList.add('hide');auth.hidden=true;auth.setAttribute('aria-hidden','true')}
    if(app)app.classList.remove('hide');
    document.querySelectorAll('#mvBottomDock85,#mvSideMenu82,.mv-desktop-nav85').forEach(x=>x.removeAttribute('aria-hidden'));
    setTimeout(()=>{try{globalThis.mvUiAuthorityV16354?.sync?.()}catch(_){ }try{globalThis.mvGoogleConnectV16360?.bind?.()}catch(_){ }},60);
  }
  async function syncAuth(){
    if(syncing)return;const client=authClient();if(!client)return;syncing=true;
    try{
      const r=await client.auth.getSession();const session=r?.data?.session||null;
      if(session){showLoggedIn();setTimeout(()=>{try{globalThis.mvGoogleCalendarV16355?.refreshStatus?.()}catch(_){ }},120)}
      else showLoggedOut();
    }catch(e){console.warn('v163.56 auth sync',e);showLoggedOut()}finally{syncing=false}
  }
  function bind(){
    if(bound)return;const client=authClient();if(!client)return;bound=true;
    try{client.auth.onAuthStateChange((_event,session)=>{session?showLoggedIn():showLoggedOut();if(session)setTimeout(()=>{try{globalThis.mvGoogleCalendarV16355?.refreshStatus?.()}catch(_){ }},120)})}catch(_){bound=false}
  }
  [0,150,500,1200,2500].forEach(ms=>setTimeout(()=>{syncAuth();bind()},ms));
  addEventListener('pageshow',()=>setTimeout(syncAuth,50),true);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncAuth()});
  globalThis.mvAuthAuthorityV16356={syncAuth,showLoggedOut,showLoggedIn,authClient};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.56 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.56 auth authority */
body[data-mv-auth="logged-out"]{overflow:auto!important;background:#f4f7fb!important}
body[data-mv-auth="logged-out"] #auth{display:block!important;position:relative!important;z-index:10000!important;max-width:520px!important;width:calc(100% - 32px)!important;margin:56px auto!important;padding:24px!important;background:#fff!important;border:1px solid #dfe6ee!important;border-radius:14px!important;box-shadow:0 18px 60px #10233f22!important;transform:none!important;inset:auto!important;opacity:1!important;visibility:visible!important;overflow:visible!important;height:auto!important;max-height:none!important}
body[data-mv-auth="logged-out"] #auth h2{margin:0 0 16px!important;color:#10284b!important}
body[data-mv-auth="logged-out"] #auth .r{display:grid!important;grid-template-columns:1fr!important;gap:10px!important}
body[data-mv-auth="logged-out"] #auth input,body[data-mv-auth="logged-out"] #auth button{display:block!important;width:100%!important;min-height:44px!important;visibility:visible!important;opacity:1!important}
body[data-mv-auth="logged-out"] #app{display:none!important}
body[data-mv-auth="logged-out"] #mvBottomDock85,body[data-mv-auth="logged-out"] #mvSideMenu82,body[data-mv-auth="logged-out"] .mv-desktop-nav85{display:none!important}
@media(max-width:820px){body[data-mv-auth="logged-out"] #auth{margin:24px auto!important;width:calc(100% - 20px)!important;padding:18px!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.56 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.56 authoritative authentication surface installed');
