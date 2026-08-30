const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.58: restore native browser input behavior for Origem/Destino.
(function(){
  function unlock(){
    ['origem','destino'].forEach(id=>{
      const el=document.getElementById(id);if(!el)return;
      el.disabled=false;el.readOnly=false;
      el.removeAttribute('disabled');el.removeAttribute('readonly');
      el.setAttribute('inputmode','text');
      el.setAttribute('autocomplete','off');
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('touch-action','auto','important');
      el.style.setProperty('user-select','text','important');
      el.style.setProperty('-webkit-user-select','text','important');
      el.style.setProperty('caret-color','#172033','important');
      el.tabIndex=0;
    });
  }
  // Important: no pointer/touch/click interception here. Android must receive the native tap gesture.
  unlock();
  [100,400,1000,2000].forEach(ms=>setTimeout(unlock,ms));
})();
`;
if(!s.includes('carga();'))throw new Error('v162.58 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v162.58 native mobile text entry */
body #p-viagem #origem,body #p-viagem #destino{pointer-events:auto!important;touch-action:auto!important;user-select:text!important;-webkit-user-select:text!important;cursor:text!important;caret-color:#172033!important;position:relative!important;z-index:20!important}
`;
if(!s.includes('</style>'))throw new Error('v162.58 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.58: native Android typing restored');
