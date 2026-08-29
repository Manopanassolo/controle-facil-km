const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.12: close Google Places suggestions after selection and avoid reopening.
(function(){
  const originalRenderGooglePlacesV130=renderGooglePlacesV130;
  renderGooglePlacesV130=function(el,box,items,q){
    box.innerHTML=items.map((p,i)=>'<button type="button" class="geo-option-v125 geo-option-v128 google-place-v130" data-google-place-v130="'+i+'"><div class="geo-head-v128"><b>'+esc(p.mainText||p.text||'Local')+'</b><em>'+esc(googlePlaceKindV130(p))+'</em></div><span>'+esc(p.secondaryText||p.text||'')+'</span></button>').join('')+'<div class="google-attrib-v130">Resultados fornecidos pelo Google</div>';
    box.classList.remove('hide');
    box.querySelectorAll('[data-google-place-v130]').forEach(b=>b.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      const p=items[+b.dataset.googlePlaceV130];
      el.value=googlePlaceLabelV130(p);
      el.dataset.placeId=p.placeId||'';
      el.dataset.placeKind=googlePlaceKindV130(p);
      el.dataset.placeSelectedV16212='1';
      box.classList.add('hide');
      box.innerHTML='';
      el.blur();
      el.dispatchEvent(new Event('change',{bubbles:true}));
      setTimeout(()=>{delete el.dataset.placeSelectedV16212},80);
    });
  };
  const originalSearchPlacesV125=searchPlacesV125;
  searchPlacesV125=async function(el){
    if(el?.dataset?.placeSelectedV16212==='1')return;
    document.querySelectorAll('.geo-suggestions-v125').forEach(x=>{if(x.id!=='geo-'+el.id+'-v125')x.classList.add('hide')});
    return originalSearchPlacesV125(el);
  };
})();
`;
if(!s.includes('carga();'))throw new Error('v162.12 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.12: place selection closes cleanly and destination search isolated');
