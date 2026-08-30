const fs=require('fs');
const s=fs.readFileSync('dist/index.html','utf8');
const worker=fs.readFileSync('cloudflare-worker.js','utf8');
const checks=[
  ['v162.26 active-trip patch present',/Movvant v162\.26|mvRouteCalcV16226|recalcActiveTripV16226/],
  ['v162.29 safe trip-start patch present',/Movvant v162\.29|mvStartV16229/],
  ['trip start tolerates missing DOM globals',/const byId=id=>document\.getElementById\(id\)/],
  ['trip start uses homologation vehicle fixture',/__mv_demo_vehicle__/],
  ['trip start uses homologation unit fixture',/__mv_demo_location__/],
  ['saved stops queried by trip',/from\('km_stops'\)\.select\('\*'\)\.eq\('trip_id',tripId\)\.order\('stop_order'/],
  ['Google Maps receives waypoints',/qs\.set\('waypoints',ss\.map\(x=>x\.place_name\)\.join\('\|'\)\)/],
  ['route recalculation sends all stops',/body:JSON\.stringify\(\{origin,destination,stops:ss\.map\(x=>x\.place_name\),optimize:false\}\)/],
  ['automatic toll expense sync exists',/syncAutoToll\(activeTrip\.id,toll\)/],
  ['automatic toll can be inserted',/from\('km_expenses'\)\.insert\(\{\.\.\.row,trip_id:tripId\}\)/],
  ['automatic toll can be updated',/from\('km_expenses'\)\.update\(row\)\.eq\('id',auto\.id\)/],
  ['automatic toll can be removed',/from\('km_expenses'\)\.delete\(\)\.eq\('id',auto\.id\)/],
  ['adding a stop triggers recalculation',/await recalcActiveTrip\(\{silent:true\}\)/],
  ['trip finalization marks completed',/from\('km_trips'\)\.update\(\{end_odometer:end,ended_at:new Date\(\)\.toISOString\(\),status:'completed'/],
  ['homologation route execution cleanup exists',/cleanupHomologationRouteExecution\(\)/],
  ['generated distance column is not written by latest close flow',/update\(\{status:'completed',ended_at:new Date\(\)\.toISOString\(\),end_odometer:endKm\}\)/],
  ['v162.30 resilient map patch present',/Movvant v162\.30|mv-map-summary-v16230/],
  ['map summary shows origin',/mv-map-route-v16230[\s\S]*Origem/],
  ['map summary shows stops',/Parada '\+\(i\+1\)/],
  ['map summary shows destination',/mv-map-route-v16230[\s\S]*Destino/],
  ['map renders route polyline',/L\.polyline\(pts,\{weight:6,opacity:\.9\}\)/],
  ['map adds route markers',/addMarkers\(L,routeMapV133,item,pts\)/],
  ['map has fallback tile provider',/basemaps\.cartocdn\.com\/light_all/],
  ['map handles missing polyline visibly',/Rota calculada, mas sem desenho retornado pelo Google/],
  ['map handles visual load failure visibly',/Mapa visual indisponível/],
  ['v162.32 guided trip wizard present',/Movvant v162\.32|mvTripWizardV16232/],
  ['wizard has four stages',/const maxStep=4/],
  ['wizard has back navigation',/mvTripBackV16232/],
  ['wizard has next navigation',/mvTripNextV16232/],
  ['wizard validates destination before advancing',/Informe o destino para avançar/],
  ['wizard validates initial odometer before confirmation',/Informe o KM inicial para avançar/],
  ['wizard shows confirmation summary',/mvTripSummaryV16232/],
];
const workerChecks=[
  ['worker routes endpoint exists',/path==='\/api\/routes'/],
  ['worker requests route polyline',/routes\.polyline\.encodedPolyline/],
  ['worker requests route legs',/routes\.legs\.startLocation/],
  ['worker requests toll data',/routes\.travelAdvisory\.tollInfo/],
  ['worker returns route legs',/polyline:route\.polyline\?\.encodedPolyline\|\|null[\s\S]*legs,instructions/],
  ['worker sends intermediate stops',/intermediates:stops\.map\(waypoint\)/],
  ['worker computes toll total',/tollTotalBRL:tollTotal\|\|0/],
];
let failed=0;
for(const [name,re] of checks){const ok=re.test(s);console.log((ok?'PASS ':'FAIL ')+name);if(!ok)failed++;}
for(const [name,re] of workerChecks){const ok=re.test(worker);console.log((ok?'PASS ':'FAIL ')+name);if(!ok)failed++;}
if(/distance_km\s*:\s*0/.test(s)){console.error('FAIL generated distance_km is still explicitly written');failed++;}
if(/Cannot set properties of null \(setting 'textContent'\)/.test(s)){console.error('FAIL known null textContent error text leaked into build');failed++;}
if(failed){console.error(`Core flow regression checks failed: ${failed}`);process.exit(1)}
console.log('Core trip + map + wizard regression contract: PASS');
