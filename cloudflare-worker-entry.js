import app from './cloudflare-worker.js';

const corsHeaders={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type, Authorization',
  'Vary':'Origin'
};
const SUPABASE_URL='https://djrrrwbkwvceqmytpgvq.supabase.co';

function withCors(response){
  const headers=new Headers(response.headers);
  for(const [k,v] of Object.entries(corsHeaders)) headers.set(k,v);
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
function json(data,status=200){
  return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
}
function canonicalGoogleCalendarRequest(request){
  const u=new URL(request.url);
  if(!u.pathname.startsWith('/api/google-calendar/')) return request;
  const canonical=new URL(u.pathname+u.search,'https://movvant.com.br');
  return new Request(canonical.toString(),request);
}
async function fetchTimed(url,opts={},timeoutMs=4500){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort('timeout'),timeoutMs);
  try{return await fetch(url,{...opts,signal:controller.signal})}
  finally{clearTimeout(timer)}
}
async function validateSupabaseUser(request,env){
  const h=String(request.headers.get('authorization')||''),m=h.match(/^Bearer\s+(.+)$/i);
  if(!m||!env.SUPABASE_SERVICE_ROLE_KEY)return {user:null,error:'unauthorized'};
  let last='';
  for(let attempt=1;attempt<=2;attempt++){
    try{
      const r=await fetchTimed(SUPABASE_URL+'/auth/v1/user',{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:'Bearer '+m[1],'cache-control':'no-store'}},attempt===1?3500:5000);
      if(r.ok)return {user:await r.json().catch(()=>null),error:null};
      last='HTTP '+r.status;
      if(r.status===401||r.status===403)return {user:null,error:'unauthorized'};
    }catch(e){last=String(e?.name==='AbortError'?'timeout':e?.message||e)}
    if(attempt===1)await new Promise(r=>setTimeout(r,180));
  }
  return {user:null,error:'supabase_auth_unavailable',detail:last};
}
function b64url(bytes){return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function hmac(secret,text){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(text)))}
async function stateSign(env,payload){const raw=b64url(new TextEncoder().encode(JSON.stringify(payload))),sig=b64url(await hmac(env.GOOGLE_OAUTH_STATE_SECRET,raw));return raw+'.'+sig}
async function resilientGoogleCalendarAuthUrl(request,env){
  const configured=!!(env.GOOGLE_OAUTH_CLIENT_ID&&env.GOOGLE_OAUTH_CLIENT_SECRET&&env.GOOGLE_OAUTH_STATE_SECRET&&env.SUPABASE_SERVICE_ROLE_KEY);
  if(!configured)return json({configured:false,error:'google_calendar_backend_not_configured'},503);
  const auth=await validateSupabaseUser(request,env);
  if(!auth.user){
    if(auth.error==='supabase_auth_unavailable')return json({configured:true,error:'supabase_auth_temporarily_unavailable',detail:auth.detail},504);
    return json({configured:true,error:'unauthorized'},401);
  }
  const u=new URL(request.url),org=String(u.searchParams.get('organization_id')||'');
  if(!org)return json({configured:true,error:'organization_id_required'},400);
  const redirect='https://movvant.com.br/api/google-calendar/callback';
  const state=await stateSign(env,{uid:auth.user.id,org,exp:Date.now()+10*60*1000,nonce:crypto.randomUUID()});
  const p=new URLSearchParams({client_id:env.GOOGLE_OAUTH_CLIENT_ID,redirect_uri:redirect,response_type:'code',scope:'openid email https://www.googleapis.com/auth/calendar.events',access_type:'offline',prompt:'consent',include_granted_scopes:'true',state});
  return json({configured:true,url:'https://accounts.google.com/o/oauth2/v2/auth?'+p.toString(),redirect_uri:redirect,authority:'entry-resilient-163.61'});
}

export default {
  async fetch(request,env,ctx){
    const originalUrl=new URL(request.url);
    const path=originalUrl.pathname;
    if(request.method==='OPTIONS'&&path.startsWith('/api/')){
      return new Response(null,{status:204,headers:corsHeaders});
    }
    if(path==='/api/google-calendar/auth-url'){
      const response=await resilientGoogleCalendarAuthUrl(request,env);
      return withCors(response);
    }
    const routedRequest=canonicalGoogleCalendarRequest(request);
    const response=await app.fetch(routedRequest,env,ctx);
    return path.startsWith('/api/')?withCors(response):response;
  }
};
