const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
  const WORKER='https://movvant.panassolofilho.workers.dev';
  const previousFetch=window.fetch.bind(window);
  const isRoute=u=>String(u||'').includes('/api/routes');
  async function parseJsonSafe(resp){try{return await resp.clone().json()}catch(_){return null}}
  async function routeFetch(input,init){
    const raw=typeof input==='string'?input:(input&&input.url)||'';
    if(!isRoute(raw))return previousFetch(input,init);
    let lastResponse=null,lastError=null;
    const attempts=[
      ()=>previousFetch(input,{...(init||{}),cache:'no-store'}),
      ()=>{const u=new URL(raw,location.origin);return previousFetch(WORKER+u.pathname+u.search,{...(init||{}),cache:'no-store',mode:'cors'})}
    ];
    for(let i=0;i<attempts.length;i++){
      try{
        const r=await attempts[i]();lastResponse=r;
        const type=String(r.headers.get('content-type')||'').toLowerCase();
        if(r.ok&&type.includes('application/json')){
          const j=await parseJsonSafe(r);
          if(Array.isArray(j?.items)&&j.items.length)return r;
          lastError=new Error(j?.error||'Nenhum percurso retornado');
        }else{
          const j=await parseJsonSafe(r);lastError=new Error(j?.error||('HTTP '+r.status));
        }
      }catch(e){lastError=e}
      if(i===0)await new Promise(res=>setTimeout(res,220));
    }
    if(lastResponse)return lastResponse;
    throw lastError||new Error('Falha ao calcular percurso');
  }
  window.fetch=routeFetch;
  window.mvRoutesFallbackV16349={worker:WORKER,active:true};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.49 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.49 resilient Routes fallback installed');
