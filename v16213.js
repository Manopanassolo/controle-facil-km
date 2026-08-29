const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.13: reliable first-tap selection on mobile and complete suggestion cleanup.
(function(){
  function clearNativePlaceListsV16213(){
    ['origem','destino','rotaOrigem','rotaDestino','agendaOriginV138','agendaDestV138','agOrigem','agDestino'].forEach(id=>{
      const el=document.getElementById(id);
      if(!el)return;
      const listId=el.getAttribute('list');
      if(listId){document.getElementById(listId)?.remove();el.removeAttribute('list')}
      el.setAttribute('autocomplete','off');
    });
  }
  function closeAllPlacesV16213(){
    document.querySelectorAll('.geo-suggestions-v125').forEach(box=>{box.classList.add('hide');box.innerHTML=''})
  }
  renderGooglePlacesV130=function(el,box,items,q){
    box.innerHTML=items.map((p,i)=>'<button type="button" class="geo-option-v125 geo-option-v128 google-place-v130" data-google-place-v130="'+i+'"><div class="geo-head-v128"><b>'+esc(p.mainText||p.text||'Local')+'</b><em>'+esc(googlePlaceKindV130(p))+'</em></div><span>'+esc(p.secondaryText||p.text||'')+'</span></button>').join('')+'<div class="google-attrib-v130">Resultados fornecidos pelo Google</div>';
    box.classList.remove('hide');
    const choose=(b,e)=>{
      if(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.()}
      if(b.dataset.chosenV16213==='1')return;
      b.dataset.chosenV16213='1';
      const p=items[+b.dataset.googlePlaceV130];
      if(!p)return;
      el.dataset.placeSelectingV16213='1';
      el.value=googlePlaceLabelV130(p);
      el.dataset.placeId=p.placeId||'';
      el.dataset.placeKind=googlePlaceKindV130(p);
      closeAllPlacesV16213();
      el.blur();
      el.dispatchEvent(new Event('change',{bubbles:true}));
      setTimeout(()=>{delete el.dataset.placeSelectingV16213},180);
    };
    box.querySelectorAll('[data-google-place-v130]').forEach(b=>{
      b.addEventListener('pointerdown',e=>choose(b,e),{capture:true});
      b.addEventListener('touchstart',e=>choose(b,e),{capture:true,passive:false});
      b.addEventListener('click',e=>choose(b,e),{capture:true});
    });
  };
  const searchBaseV16213=searchPlacesV125;
  searchPlacesV125=async function(el){
    if(el?.dataset?.placeSelectingV16213==='1')return;
    clearNativePlaceListsV16213();
    document.querySelectorAll('.geo-suggestions-v125').forEach(x=>{if(x.id!=='geo-'+el.id+'-v125'){x.classList.add('hide');x.innerHTML=''}});
    return searchBaseV16213(el);
  };
  document.addEventListener('focusin',e=>{
    const el=e.target;
    if(!el?.id)return;
    if(['origem','destino','rotaOrigem','rotaDestino','agendaOriginV138','agendaDestV138','agOrigem','agDestino'].includes(el.id)){
      document.querySelectorAll('.geo-suggestions-v125').forEach(x=>{if(x.id!=='geo-'+el.id+'-v125'){x.classList.add('hide');x.innerHTML=''}})
    }
  },true);
  document.addEventListener('pointerdown',e=>{
    if(!e.target.closest('.geo-suggestions-v125')&&!e.target.closest('#origem,#destino,#rotaOrigem,#rotaDestino,#agendaOriginV138,#agendaDestV138,#agOrigem,#agDestino'))closeAllPlacesV16213();
  },true);
  const renderBaseV16213=render;
  render=function(){const r=renderBaseV16213();setTimeout(clearNativePlaceListsV16213,0);return r};
  setTimeout(clearNativePlaceListsV16213,100);
  setTimeout(clearNativePlaceListsV16213,1200);
})();
`;
if(!s.includes('carga();'))throw new Error('v162.13 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.13: first-tap place selection and suggestion cleanup fixed');
