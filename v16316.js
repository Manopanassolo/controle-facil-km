const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
(function(){
  const WORKER='https://movvant.panassolofilho.workers.dev';
  const nativeFetch=window.fetch.bind(window);
  async function fetchPlaces(input,init){
    const raw=typeof input==='string'?input:(input&&input.url)||'';
    if(!raw.includes('/api/places')) return nativeFetch(input,init);
    try{
      const r=await nativeFetch(input,init);
      const type=String(r.headers.get('content-type')||'').toLowerCase();
      if(r.ok&&type.includes('application/json')) return r;
    }catch(_){ }
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
