import app from './cloudflare-worker.js';

const corsHeaders={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type, Authorization',
  'Vary':'Origin'
};

function withCors(response){
  const headers=new Headers(response.headers);
  for(const [k,v] of Object.entries(corsHeaders)) headers.set(k,v);
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}

function canonicalGoogleCalendarRequest(request){
  const u=new URL(request.url);
  if(!u.pathname.startsWith('/api/google-calendar/')) return request;
  const canonical=new URL(u.pathname+u.search,'https://movvant.com.br');
  return new Request(canonical.toString(),request);
}

export default {
  async fetch(request,env,ctx){
    const originalUrl=new URL(request.url);
    const path=originalUrl.pathname;
    if(request.method==='OPTIONS'&&path.startsWith('/api/')){
      return new Response(null,{status:204,headers:corsHeaders});
    }
    const routedRequest=canonicalGoogleCalendarRequest(request);
    const response=await app.fetch(routedRequest,env,ctx);
    return path.startsWith('/api/')?withCors(response):response;
  }
};
