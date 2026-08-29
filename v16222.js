const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.22: compatibility alias for legacy post-start routines that still reference empresa.
(function(){
  try{
    if(typeof globalThis.empresa==='undefined'){
      Object.defineProperty(globalThis,'empresa',{configurable:true,get:function(){return globalThis.org||null}});
    }
  }catch(_){globalThis.empresa=globalThis.org||null}
})();
`;
if(!s.includes('carga();'))throw new Error('v162.22 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.22: legacy empresa alias restored for trip start');
