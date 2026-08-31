import app from './cloudflare-worker.js';

const corsHeaders={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type',
  'Vary':'Origin'
};

function withCors(response){
  const headers=new Headers(response.headers);
  for(const [k,v] of Object.entries(corsHeaders)) headers.set(k,v);
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}

export default {
  async fetch(request,env,ctx){
    const path=new URL(request.url).pathname;
    if(request.method==='OPTIONS'&&path.startsWith('/api/')){
      return new Response(null,{status:204,headers:corsHeaders});
    }
    const response=await app.fetch(request,env,ctx);
    return path.startsWith('/api/')?withCors(response):response;
  }
};
