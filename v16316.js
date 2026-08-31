const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
  const WORKER='https://movvant.panassolofilho.workers.dev';
  const nativeFetch=window.fetch.bind(window);
  const isLocal=/^(127\\.0\\.0\\.1|localhost)$/.test(location.hostname);
  async function fetchPlaces(input,init){
    const raw=typeof input==='string'?input:(input&&input.url)||'';
    if(!raw.includes('/api/places')) return nativeFetch(input,init);
    let first=null;
    try{
      first=await nativeFetch(input,init);
      const type=String(first.headers.get('content-type')||'').toLowerCase();
      if(first.ok&&type.includes('application/json')) return first;
      if(isLocal) return first;
    }catch(e){
      if(isLocal) throw e;
    }
    const u=new URL(raw,location.origin);
    return nativeFetch(WORKER+u.pathname+u.search,{...(init||{}),cache:'no-store',mode:'cors'});
  }
  window.fetch=fetchPlaces;
  window.mvPlacesFallbackV16345={worker:WORKER,active:true};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.45 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.45 resilient Places fallback installed');
