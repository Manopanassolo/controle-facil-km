function json(data,status=200){
  return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
}

async function places(request,env){
  if(request.method!=='GET')return json({configured:!!env.GOOGLE_MAPS_API_KEY,error:'method_not_allowed'},405);
  const key=env.GOOGLE_MAPS_API_KEY;
  if(!key)return json({configured:false,items:[],error:'GOOGLE_MAPS_API_KEY_not_configured'},503);
  const url=new URL(request.url);
  const q=String(url.searchParams.get('q')||'').trim().slice(0,160);
  if(q.length<2)return json({configured:true,items:[]});
  const normalize=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const cityTypes=new Set(['locality','administrative_area_level_1','administrative_area_level_2','postal_town']);
  const mapSuggestions=j=>(j.suggestions||[]).map(x=>x.placePrediction).filter(Boolean).map(p=>({placeId:p.placeId||'',text:p.text?.text||'',mainText:p.structuredFormat?.mainText?.text||p.text?.text||'',secondaryText:p.structuredFormat?.secondaryText?.text||'',types:p.types||[]}));
  const errors=[];
  let items=[];
  const merge=arr=>{
    const seen=new Set(items.map(x=>x.placeId||normalize(x.text)));
    for(const x of arr||[]){const k=x.placeId||normalize(x.text);if(k&&!seen.has(k)){items.push(x);seen.add(k)}}
  };
  const apiError=(name,status,j)=>errors.push({source:name,status,message:j?.error?.message||j?.error_message||('HTTP '+status),code:j?.error?.status||j?.status||null});

  // Places API (New) Autocomplete. Keep the field mask deliberately minimal for maximum compatibility.
  try{
    const headers={'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text'};
    const r=await fetch('https://places.googleapis.com/v1/places:autocomplete',{method:'POST',headers,body:JSON.stringify({input:q,includedRegionCodes:['br'],languageCode:'pt-BR'})});
    const j=await r.json().catch(()=>({}));
    if(r.ok)merge(mapSuggestions(j));else apiError('places_new_autocomplete',r.status,j);
  }catch(e){errors.push({source:'places_new_autocomplete',status:0,message:String(e?.message||e)})}

  // Optional city-oriented pass. Failure here must never kill normal address autocomplete.
  if(q.length>=3){
    try{
      const headers={'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text'};
      const r=await fetch('https://places.googleapis.com/v1/places:autocomplete',{method:'POST',headers,body:JSON.stringify({input:q,includedRegionCodes:['br'],languageCode:'pt-BR',includedPrimaryTypes:['(cities)']})});
      const j=await r.json().catch(()=>({}));
      if(r.ok)merge(mapSuggestions(j));else apiError('places_new_cities',r.status,j);
    }catch(e){errors.push({source:'places_new_cities',status:0,message:String(e?.message||e)})}
  }

  // Text Search is a second independent New-API path, useful for establishments and full street addresses.
  if(q.length>=3){
    try{
      const r=await fetch('https://places.googleapis.com/v1/places:searchText',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'places.id,places.displayName,places.formattedAddress,places.types'},body:JSON.stringify({textQuery:q,languageCode:'pt-BR',regionCode:'BR',pageSize:8})});
      const j=await r.json().catch(()=>({}));
      if(r.ok){
        merge((j.places||[]).map(p=>({placeId:p.id||'',text:[p.displayName?.text,p.formattedAddress].filter(Boolean).join(', '),mainText:p.displayName?.text||p.formattedAddress||'',secondaryText:p.formattedAddress||'',types:p.types||[]})));
      }else apiError('places_new_text_search',r.status,j);
    }catch(e){errors.push({source:'places_new_text_search',status:0,message:String(e?.message||e)})}
  }

  // Legacy Places Autocomplete fallback. This keeps older Google projects working if only the legacy service is enabled.
  if(!items.length){
    try{
      const legacy='https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+encodeURIComponent(q)+'&components=country:br&language=pt-BR&key='+encodeURIComponent(key);
      const r=await fetch(legacy,{headers:{Accept:'application/json'}});
      const j=await r.json().catch(()=>({}));
      if(r.ok&&j.status==='OK'){
        merge((j.predictions||[]).map(p=>({placeId:p.place_id||'',text:p.description||'',mainText:p.structured_formatting?.main_text||p.description||'',secondaryText:p.structured_formatting?.secondary_text||'',types:p.types||[]})));
      }else if(j.status!=='ZERO_RESULTS')apiError('places_legacy_autocomplete',r.status,j);
    }catch(e){errors.push({source:'places_legacy_autocomplete',status:0,message:String(e?.message||e)})}
  }

  const nq=normalize(q);
  items.sort((a,b)=>{
    const aCity=(a.types||[]).some(t=>cityTypes.has(String(t).toLowerCase()));
    const bCity=(b.types||[]).some(t=>cityTypes.has(String(t).toLowerCase()));
    const aStarts=normalize(a.mainText).startsWith(nq),bStarts=normalize(b.mainText).startsWith(nq);
    const aExact=normalize(a.mainText)===nq,bExact=normalize(b.mainText)===nq;
    if(aExact!==bExact)return aExact?-1:1;
    if(aStarts!==bStarts)return aStarts?-1:1;
    if(aCity!==bCity)return aCity?-1:1;
    return 0;
  });
  if(items.length)return json({configured:true,items:items.slice(0,10),source:'google_places'});
  return json({configured:true,items:[],error:'google_places_unavailable',diagnostics:errors},502);
}

async function routes(request,env){
  const key=env.GOOGLE_MAPS_API_KEY;
  if(!key)return json({configured:false,error:'GOOGLE_MAPS_API_KEY_not_configured'},503);
  try{
    const isGet=request.method==='GET',isPost=request.method==='POST';
    if(!isGet&&!isPost)return json({configured:true,error:'method_not_allowed'},405);
    const url=new URL(request.url);
    let body={};
    if(isGet){for(const [k,v] of url.searchParams.entries())body[k]=v}else{body=await request.json().catch(()=>({}))}
    const origin=String(body.origin||'').trim(),destination=String(body.destination||'').trim();
    const stops=Array.isArray(body.stops)?body.stops.map(x=>String(x||'').trim()).filter(Boolean).slice(0,8):String(body.stops||'').split('|').map(x=>x.trim()).filter(Boolean).slice(0,8);
    const optimize=body.optimize===true||String(body.optimize||'').toLowerCase()==='true';
    if(!origin||!destination)return json({configured:true,error:'origin_destination_required'},400);
    const waypoint=x=>({address:x});
    const payload={origin:waypoint(origin),destination:waypoint(destination),intermediates:stops.map(waypoint),travelMode:'DRIVE',routingPreference:'TRAFFIC_AWARE',computeAlternativeRoutes:stops.length===0&&!optimize,languageCode:'pt-BR',units:'METRIC',extraComputations:['TOLLS'],routeModifiers:{avoidTolls:false,avoidHighways:false,avoidFerries:false}};
    if(optimize&&stops.length>1)payload.optimizeWaypointOrder=true;
    const fieldMask=['routes.distanceMeters','routes.duration','routes.routeLabels','routes.polyline.encodedPolyline','routes.travelAdvisory.tollInfo','routes.optimizedIntermediateWaypointIndex','routes.legs.distanceMeters','routes.legs.duration','routes.legs.startLocation','routes.legs.endLocation','routes.legs.steps.navigationInstruction.instructions'].join(',');
    const r=await fetch('https://routes.googleapis.com/directions/v2:computeRoutes',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':fieldMask},body:JSON.stringify(payload)});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)return json({configured:true,error:j?.error?.message||'routes_api_error',code:j?.error?.status||null,details:j},r.status);
    const money=m=>{if(!m)return null;const units=Number(m.units||0),nanos=Number(m.nanos||0);return {currency:m.currencyCode||'BRL',amount:units+nanos/1e9}};
    const loc=x=>{const p=x?.latLng||x||{};return {latitude:Number(p.latitude||0),longitude:Number(p.longitude||0)}};
    const items=(j.routes||[]).map((route,index)=>{const tolls=(route.travelAdvisory?.tollInfo?.estimatedPrice||[]).map(money).filter(Boolean);const tollTotal=tolls.filter(x=>x.currency==='BRL').reduce((a,x)=>a+x.amount,0);const instructions=(route.legs||[]).flatMap(l=>(l.steps||[]).map(s=>s.navigationInstruction?.instructions).filter(Boolean));const ferry=instructions.some(x=>/balsa|ferry|ferryboat|ferry boat/i.test(x));const legs=(route.legs||[]).map(l=>({distanceMeters:Number(l.distanceMeters||0),duration:l.duration||null,startLocation:loc(l.startLocation),endLocation:loc(l.endLocation)}));return {index,distanceMeters:Number(route.distanceMeters||0),duration:route.duration||null,routeLabels:route.routeLabels||[],polyline:route.polyline?.encodedPolyline||null,tolls,tollTotalBRL:tollTotal||0,hasTolls:!!route.travelAdvisory?.tollInfo,hasFerry:ferry,optimizedIntermediateWaypointIndex:route.optimizedIntermediateWaypointIndex||[],legs,instructions:instructions.slice(0,120)}});
    return json({configured:true,source:'google_routes',optimized:optimize,items});
  }catch(e){return json({configured:true,error:e?.message||'routes_internal_error'},500)}
}

export default {
  async fetch(request,env){
    const path=new URL(request.url).pathname;
    if(path==='/api/maps-health')return json({configured:!!env.GOOGLE_MAPS_API_KEY,places:'/api/places',routes:'/api/routes'});
    if(path==='/api/places')return places(request,env);
    if(path==='/api/routes')return routes(request,env);
    return env.ASSETS.fetch(request);
  }
};
