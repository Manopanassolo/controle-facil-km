const fs=require('fs');
const s=fs.readFileSync('dist/index.html','utf8');
const checks=[
  ['v162.26 active-trip patch present',/Movvant v162\.26|mvRouteCalcV16226|recalcActiveTripV16226/],
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
];
let failed=0;
for(const [name,re] of checks){const ok=re.test(s);console.log((ok?'PASS ':'FAIL ')+name);if(!ok)failed++;}
if(/distance_km\s*:\s*0/.test(s)){console.error('FAIL generated distance_km is still explicitly written');failed++;}
if(failed){console.error(`Core flow regression checks failed: ${failed}`);process.exit(1)}
console.log('Core active-trip regression contract: PASS');
