const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.11 Maps/rotas readiness: autocomplete seguro nos campos de origem/destino.
(function(){
  const ids=['origem','destino','rotaOrigem','rotaDestino','agendaOriginV138','agendaDestV138','agOrigem','agDestino'];
  const bound=new WeakSet();
  function attach(input){
    if(!input||bound.has(input))return;
    bound.add(input);
    input.setAttribute('autocomplete','street-address');
    const list=document.createElement('datalist');
    list.id='mvPlaces_'+Math.random().toString(36).slice(2);
    document.body.appendChild(list);
    input.setAttribute('list',list.id);
    let timer=0,seq=0;
    input.addEventListener('input',()=>{
      clearTimeout(timer);
      const q=input.value.trim();
      if(q.length<3){list.innerHTML='';return;}
      timer=setTimeout(async()=>{
        const mine=++seq;
        try{
          const r=await fetch('/api/places?q='+encodeURIComponent(q),{cache:'no-store'});
          if(!r.ok)return;
          const data=await r.json();
          if(mine!==seq||!Array.isArray(data.items))return;
          list.innerHTML=data.items.slice(0,10).map(x=>'<option value="'+String(x.text||x.mainText||'').replace(/"/g,'&quot;')+'"></option>').join('');
        }catch{}
      },260);
    });
  }
  function bindAll(){ids.forEach(id=>attach(document.getElementById(id)))}
  window.v16211MapsStatus=async function(){
    try{const r=await fetch('/api/maps-health',{cache:'no-store'});return await r.json()}catch(e){return {configured:false,error:String(e?.message||e)}}
  };
  const oldRender=render;
  render=function(){const r=oldRender();setTimeout(bindAll,0);return r};
  setTimeout(bindAll,100);
  setTimeout(bindAll,1200);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.11 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.11: Maps readiness and address autocomplete wired');
