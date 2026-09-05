module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const key=process.env.GOOGLE_MAPS_API_KEY;
  if(!key)return res.status(503).json({configured:false,error:'GOOGLE_MAPS_API_KEY_not_configured'});
  try{
    const isGet=req.method==='GET';
    const isPost=req.method==='POST';
    if(!isGet&&!isPost)return res.status(405).json({configured:true,error:'method_not_allowed'});
    const body=isGet?(req.query||{}):(typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{}));
    const origin=String(body.origin||'').trim(),destination=String(body.destination||'').trim();
    const stops=Array.isArray(body.stops)?body.stops.map(x=>String(x||'').trim()).filter(Boolean).slice(0,8):String(body.stops||'').split('|').map(x=>x.trim()).filter(Boolean).slice(0,8);
    const optimize=body.optimize===true||String(body.optimize||'').toLowerCase()==='true';
    const strategy=String(body.strategy||'all').toLowerCase();
    if(!origin||!destination)return res.status(400).json({configured:true,error:'origin_destination_required'});
    const waypoint=x=>({address:x});
    const fieldMask=['routes.distanceMeters','routes.duration','routes.routeLabels','routes.polyline.encodedPolyline','routes.travelAdvisory.tollInfo','routes.optimizedIntermediateWaypointIndex','routes.legs.distanceMeters','routes.legs.duration','routes.legs.startLocation','routes.legs.endLocation','routes.legs.steps.navigationInstruction.instructions'].join(',');
    const strategies=strategy==='all'?[{id:'rapida',label:'Mais rápida',mod:{avoidTolls:false,avoidHighways:false,avoidFerries:false}},{id:'economica',label:'Menos pedágios',mod:{avoidTolls:true,avoidHighways:false,avoidFerries:false}},{id:'urbana',label:'Evitar rodovias',mod:{avoidTolls:false,avoidHighways:true,avoidFerries:false}}]:[{id:strategy,label:strategy,mod:{avoidTolls:strategy==='economica',avoidHighways:strategy==='urbana',avoidFerries:false}}];
    const money=m=>{if(!m)return null;const units=Number(m.units||0),nanos=Number(m.nanos||0);return {currency:m.currencyCode||'BRL',amount:units+nanos/1e9}};
    const loc=x=>{const p=x?.latLng||x||{};return {latitude:Number(p.latitude||0),longitude:Number(p.longitude||0)}};
    const all=[];
    for(const st of strategies){
      const payload={origin:waypoint(origin),destination:waypoint(destination),intermediates:stops.map(waypoint),travelMode:'DRIVE',routingPreference:'TRAFFIC_AWARE',computeAlternativeRoutes:stops.length===0&&!optimize&&st.id==='rapida',languageCode:'pt-BR',units:'METRIC',extraComputations:['TOLLS'],routeModifiers:st.mod};
      if(optimize&&stops.length>1)payload.optimizeWaypointOrder=true;
      const r=await fetch('https://routes.googleapis.com/directions/v2:computeRoutes',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':fieldMask},body:JSON.stringify(payload)});
      const j=await r.json().catch(()=>({}));
      if(!r.ok){if(st.id==='rapida')return res.status(r.status).json({configured:true,error:j?.error?.message||'routes_api_error',code:j?.error?.status||null,details:j});continue;}
      for(const route of (j.routes||[])){
        const tolls=(route.travelAdvisory?.tollInfo?.estimatedPrice||[]).map(money).filter(Boolean);const tollTotal=tolls.filter(x=>x.currency==='BRL').reduce((a,x)=>a+x.amount,0);const instructions=(route.legs||[]).flatMap(l=>(l.steps||[]).map(s=>s.navigationInstruction?.instructions).filter(Boolean));const ferry=instructions.some(x=>/balsa|ferry|ferryboat|ferry boat/i.test(x));const legs=(route.legs||[]).map(l=>({distanceMeters:Number(l.distanceMeters||0),duration:l.duration||null,startLocation:loc(l.startLocation),endLocation:loc(l.endLocation)}));
        all.push({index:all.length,strategy:st.id,strategyLabel:st.label,distanceMeters:Number(route.distanceMeters||0),duration:route.duration||null,routeLabels:route.routeLabels||[],polyline:route.polyline?.encodedPolyline||null,tolls,tollTotalBRL:tollTotal||0,hasTolls:!!route.travelAdvisory?.tollInfo,hasFerry:ferry,optimizedIntermediateWaypointIndex:route.optimizedIntermediateWaypointIndex||[],legs,instructions:instructions.slice(0,120)});
      }
    }
    const dedup=[];for(const item of all){if(!dedup.some(x=>Math.abs(x.distanceMeters-item.distanceMeters)<100&&x.tollTotalBRL===item.tollTotalBRL))dedup.push(item)}
    return res.status(200).json({configured:true,source:'google_routes',optimized:optimize,items:dedup.slice(0,6)});
  }catch(e){return res.status(500).json({configured:true,error:e?.message||'routes_internal_error'});}
};
