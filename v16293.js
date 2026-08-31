const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.96: route planner authority opens the progressive panel whenever planning starts.
(function(){
  function install(){
    const fn=globalThis.planRouteV16272;
    if(typeof fn!=='function'||fn.__mv16296)return false;
    function wrapped(...args){
      const fold=document.getElementById('mvRouteFold93');
      if(fold&&!fold.open){
        fold.open=true;
        fold.dispatchEvent(new Event('toggle'));
      }
      const result=fn.apply(this,args);
      setTimeout(()=>{
        const map=globalThis.mvRouteMapV16278;
        try{map?.invalidateSize?.()}catch(_){}
      },80);
      return result;
    }
    wrapped.__mv16296=true;
    globalThis.planRouteV16272=wrapped;
    return true;
  }
  if(!install()){
    let tries=0;
    const timer=setInterval(()=>{tries++;if(install()||tries>40)clearInterval(timer)},100);
  }
})();
`;
if(!s.includes('carga();'))throw new Error('v162.96 startup anchor');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.96: progressive planner opens safely before route calculation');
