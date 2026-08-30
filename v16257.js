const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.57 neutralized: no gesture interception. v162.58+ owns native typing.
(function(){
  function unlock(){
    ['origem','destino'].forEach(id=>{
      const el=document.getElementById(id);if(!el)return;
      el.disabled=false;el.readOnly=false;
      el.removeAttribute('disabled');el.removeAttribute('readonly');
      el.setAttribute('inputmode','text');
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('touch-action','auto','important');
      el.style.setProperty('user-select','text','important');
      el.style.setProperty('-webkit-user-select','text','important');
      el.tabIndex=0;
    });
  }
  unlock();[100,400,1000].forEach(ms=>setTimeout(unlock,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.57 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.57 neutralized mobile input layer */
body #p-viagem #origem,body #p-viagem #destino{pointer-events:auto!important;touch-action:auto!important;user-select:text!important;-webkit-user-select:text!important;cursor:text!important}
`;
if(!s.includes('</style>'))throw new Error('v162.57 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.57: gesture interception neutralized');
