const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.44: delayed trip content stability probe (test-only).
(function(){
  if(new URLSearchParams(location.search).get('mv_trip_stable_test')!=='1')return;
  setTimeout(()=>{
    document.getElementById('auth')?.classList.add('hide');
    document.getElementById('app')?.classList.remove('hide');
    try{if(typeof show==='function')show('inicio')}catch(_){}
    const b=[...document.querySelectorAll('#p-inicio button,#p-inicio a,#p-inicio [role="button"]')].find(el=>/Novo deslocamento/i.test((el.textContent||''))||el.getAttribute('data-p-jump')==='viagem');
    if(b)b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch'}));
  },300);
  setTimeout(()=>{
    const p=document.getElementById('p-viagem'),f=document.getElementById('novaViagem');
    const visible=el=>!!el&&!el.classList.contains('hide')&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getBoundingClientRect().height>20;
    document.documentElement.dataset.mvTripStableTest=(visible(p)&&visible(f)&&f.children.length>0)?'pass':'fail';
  },3800);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.44 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.44: delayed trip content stability probe installed');
