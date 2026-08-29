const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v162.25: always include planned/saved stops as Google Maps waypoints.
(function(){
  async function resolveWaypoints(t){
    if(Array.isArray(t?.waypoints)&&t.waypoints.length)return t.waypoints.filter(Boolean);
    const tripId=t?.id||((activeTrip&&t===activeTrip)?activeTrip.id:null);
    if(tripId){
      try{
        const r=await sb.from('km_stops').select('place_name,stop_order').eq('trip_id',tripId).order('stop_order',{ascending:true});
        if(!r.error&&Array.isArray(r.data)&&r.data.length)return r.data.map(x=>x.place_name).filter(Boolean);
      }catch(_){}
    }
    if(activeTrip?.id&&tripId===activeTrip.id&&Array.isArray(stops)&&stops.length)return stops.slice().sort((a,b)=>Number(a.stop_order||0)-Number(b.stop_order||0)).map(x=>x.place_name).filter(Boolean);
    if(Array.isArray(globalThis.preTripStopsV127)&&globalThis.preTripStopsV127.length)return globalThis.preTripStopsV127.map(x=>x.place_name).filter(Boolean);
    return [];
  }
  abrirMaps=async function(t){
    t=t||activeTrip||{};
    const origin=t?.origin||origem?.value?.trim()||'';
    const destination=t?.destination||destino?.value?.trim()||'';
    if(!destination)return msg('Informe o destino',true);
    const wp=await resolveWaypoints(t);
    const p=new URLSearchParams({api:'1',destination,travelmode:'driving'});
    if(origin)p.set('origin',origin);
    if(wp.length)p.set('waypoints',wp.join('|'));
    window.open('https://www.google.com/maps/dir/?'+p.toString(),'_blank');
  };
})();
`;
if(!s.includes('carga();'))throw new Error('v162.25 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.25: Google Maps route now includes all trip stops as waypoints');
