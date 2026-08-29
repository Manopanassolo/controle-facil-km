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
    if(!origin||!destination)return res.status(400).json({configured:true,error:'origin_destination_required'});
    const waypoint=x=>({address:x});
    const payload={
      origin:waypoint(origin),destination:waypoint(destination),intermediates:stops.map(waypoint),
      travelMode:'DRIVE',routingPreference:'TRAFFIC_AWARE',computeAlternativeRoutes:stops.length===0,
      languageCode:'pt-BR',units:'METRIC',extraComputations:['TOLLS'],
      routeModifiers:{avoidTolls:false,avoidHighways:false,avoidFerries:false}
    };
    const fieldMask=['routes.distanceMeters','routes.duration','routes.routeLabels','routes.polyline.encodedPolyline','routes.travelAdvisory.tollInfo','routes.legs.distanceMeters','routes.legs.duration','routes.legs.steps.navigationInstruction.instructions'].join(',');
    const r=await fetch('https://routes.googleapis.com/directions/v2:computeRoutes',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':fieldMask},body:JSON.stringify(payload)});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)return res.status(r.status).json({configured:true,error:j?.error?.message||'routes_api_error',code:j?.error?.status||null,details:j});
    const money=(m)=>{if(!m)return null;const units=Number(m.units||0),nanos=Number(m.nanos||0);return {currency:m.currencyCode||'BRL',amount:units+nanos/1e9}};
    const items=(j.routes||[]).map((route,index)=>{
      const tolls=(route.travelAdvisory?.tollInfo?.estimatedPrice||[]).map(money).filter(Boolean);
      const tollTotal=tolls.filter(x=>x.currency==='BRL').reduce((a,x)=>a+x.amount,0);
      const instructions=(route.legs||[]).flatMap(l=>(l.steps||[]).map(s=>s.navigationInstruction?.instructions).filter(Boolean));
      const ferry=instructions.some(x=>/balsa|ferry|ferryboat|ferry boat/i.test(x));
      return {index,distanceMeters:Number(route.distanceMeters||0),duration:route.duration||null,routeLabels:route.routeLabels||[],polyline:route.polyline?.encodedPolyline||null,tolls,tollTotalBRL:tollTotal||0,hasTolls:!!route.travelAdvisory?.tollInfo,hasFerry:ferry,instructions:instructions.slice(0,120)};
    });
    return res.status(200).json({configured:true,source:'google_routes',items});
  }catch(e){return res.status(500).json({configured:true,error:e?.message||'routes_internal_error'});}
};
