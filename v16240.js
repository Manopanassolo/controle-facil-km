const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.40: keep Novo deslocamento open; no delayed startup code may return it to Home.
(function(){
  const test=new URLSearchParams(location.search).get('mv_trip_persist_test')==='1';
  function tripVisible(){
    const trip=document.getElementById('p-viagem');
    return !!trip&&!trip.classList.contains('hide')&&getComputedStyle(trip).display!=='none';
  }
  if(test){
    setTimeout(()=>{
      document.getElementById('auth')?.classList.add('hide');
      document.getElementById('app')?.classList.remove('hide');
      try{if(typeof show==='function')show('inicio')}catch(_){}
      const b=[...document.querySelectorAll('#p-inicio button,#p-inicio a,#p-inicio [role="button"]')].find(el=>/Novo deslocamento/i.test((el.textContent||''))||el.getAttribute('data-p-jump')==='viagem');
      if(b)b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch'}));
      setTimeout(()=>{document.documentElement.dataset.mvTripPersistTest=tripVisible()?'pass':'fail'},2200);
    },300);
  }
})();
`;
if(!s.includes('carga();'))throw new Error('v162.40 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.40: delayed Home-return regression test installed');
