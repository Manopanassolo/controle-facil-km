const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const legacy="update({status:'completed',ended_at:new Date().toISOString(),end_odometer:endKm,distance_km:0})";
const fixed="update({status:'completed',ended_at:new Date().toISOString(),end_odometer:endKm})";
if(s.includes(legacy))s=s.replaceAll(legacy,fixed);
if(/distance_km\s*:\s*0/.test(s))throw new Error('v162.28: legacy distance_km write still present');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.28: legacy generated distance write removed from built app');
