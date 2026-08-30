const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
// v162.59 compatibility shim only. Do not intercept pointer/touch/click/focus: those capture
// listeners could block Android native input behavior and conflict with v162.61.
const js=`
// v162.59 neutralized: no gesture interception. v162.61+ owns native route typing.
(function(){
  ['origem','destino'].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    el.disabled=false;el.readOnly=false;el.removeAttribute('disabled');el.removeAttribute('readonly');
    el.setAttribute('inputmode','text');el.style.setProperty('pointer-events','auto','important');
    el.style.setProperty('touch-action','auto','important');el.tabIndex=0;
  });
})();
`;
if(!s.includes('carga();'))throw new Error('v162.59 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.59: obsolete gesture interception neutralized');
