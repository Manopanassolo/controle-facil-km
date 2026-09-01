function json(data,status=200){
  return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
}

const SUPABASE_URL='https://djrrrwbkwvceqmytpgvq.supabase.co';
function googleReferrer(){return 'https://movvant.com.br/'}
function calendarConfigured(env){return !!(env.GOOGLE_OAUTH_CLIENT_ID&&env.GOOGLE_OAUTH_CLIENT_SECRET&&env.GOOGLE_OAUTH_STATE_SECRET&&env.SUPABASE_SERVICE_ROLE_KEY)}
function b64url(bytes){return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64url(s){s=String(s||'').replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
async function hmac(secret,text){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(text)))}
async function stateSign(env,payload){const raw=b64url(new TextEncoder().encode(JSON.stringify(payload))),sig=b64url(await hmac(env.GOOGLE_OAUTH_STATE_SECRET,raw));return raw+'.'+sig}
async function stateVerify(env,state){try{const [raw,sig]=String(state||'').split('.');if(!raw||!sig)return null;const expected=b64url(await hmac(env.GOOGLE_OAUTH_STATE_SECRET,raw));if(expected!==sig)return null;const p=JSON.parse(new TextDecoder().decode(unb64url(raw)));if(!p?.exp||Date.now()>Number(p.exp))return null;return p}catch{return null}}
function serviceHeaders(env,extra={}){return {'apikey':env.SUPABASE_SERVICE_ROLE_KEY,'authorization':'Bearer '+env.SUPABASE_SERVICE_ROLE_KEY,'content-type':'application/json',...extra}}
async function authUser(request,env){
  if(!env.SUPABASE_SERVICE_ROLE_KEY)return null;
  const h=String(request.headers.get('authorization')||''),m=h.match(/^Bearer\s+(.+)$/i);if(!m)return null;
  const r=await fetch(SUPABASE_URL+'/auth/v1/user',{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:'Bearer '+m[1]}});if(!r.ok)return null;return r.json().catch(()=>null)
}
async function rest(env,path,opts={}){return fetch(SUPABASE_URL+'/rest/v1/'+path,{...opts,headers:serviceHeaders(env,opts.headers||{})})}

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
  const errors=[];let items=[];
  const merge=arr=>{const seen=new Set(items.map(x=>x.placeId||normalize(x.text)));for(const x of arr||[]){const k=x.placeId||normalize(x.text);if(k&&!seen.has(k)){items.push(x);seen.add(k)}}};
  const apiError=(name,status,j)=>errors.push({source:name,status,message:j?.error?.message||j?.error_message||('HTTP '+status),code:j?.error?.status||j?.status||null});
  const referrer=googleReferrer();
  const newHeaders=mask=>({'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':mask,'Referer':referrer});
  try{
    const mask='suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text';
    const r=await fetch('https://places.googleapis.com/v1/places:autocomplete',{method:'POST',headers:newHeaders(mask),body:JSON.stringify({input:q,includedRegionCodes:['br'],languageCode:'pt-BR'})});
    const j=await r.json().catch(()=>({}));if(r.ok)merge(mapSuggestions(j));else apiError('places_new_autocomplete',r.status,j);
  }catch(e){errors.push({source:'places_new_autocomplete',status:0,message:String(e?.message||e)})}
  if(q.length>=3){
    try{
      const mask='suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text';
      const r=await fetch('https://places.googleapis.com/v1/places:autocomplete',{method:'POST',headers:newHeaders(mask),body:JSON.stringify({input:q,includedRegionCodes:['br'],languageCode:'pt-BR',includedPrimaryTypes:['(cities)']})});
      const j=await r.json().catch(()=>({}));if(r.ok)merge(mapSuggestions(j));else apiError('places_new_cities',r.status,j);
    }catch(e){errors.push({source:'places_new_cities',status:0,message:String(e?.message||e)})}
    try{
      const mask='places.id,places.displayName,places.formattedAddress,places.types';
      const r=await fetch('https://places.googleapis.com/v1/places:searchText',{method:'POST',headers:newHeaders(mask),body:JSON.stringify({textQuery:q,languageCode:'pt-BR',regionCode:'BR',pageSize:8})});
      const j=await r.json().catch(()=>({}));
      if(r.ok)merge((j.places||[]).map(p=>({placeId:p.id||'',text:[p.displayName?.text,p.formattedAddress].filter(Boolean).join(', '),mainText:p.displayName?.text||p.formattedAddress||'',secondaryText:p.formattedAddress||'',types:p.types||[]})));else apiError('places_new_text_search',r.status,j);
    }catch(e){errors.push({source:'places_new_text_search',status:0,message:String(e?.message||e)})}
  }
  const nq=normalize(q);
  items.sort((a,b)=>{const aCity=(a.types||[]).some(t=>cityTypes.has(String(t).toLowerCase())),bCity=(b.types||[]).some(t=>cityTypes.has(String(t).toLowerCase()));const aStarts=normalize(a.mainText).startsWith(nq),bStarts=normalize(b.mainText).startsWith(nq),aExact=normalize(a.mainText)===nq,bExact=normalize(b.mainText)===nq;if(aExact!==bExact)return aExact?-1:1;if(aStarts!==bStarts)return aStarts?-1:1;if(aCity!==bCity)return aCity?-1:1;return 0});
  if(items.length)return json({configured:true,items:items.slice(0,10),source:'google_places'});
  return json({configured:true,items:[],error:'google_places_unavailable',diagnostics:errors},502);
}

async function routes(request,env){
  const key=env.GOOGLE_MAPS_API_KEY;if(!key)return json({configured:false,error:'GOOGLE_MAPS_API_KEY_not_configured'},503);
  try{
    const isGet=request.method==='GET',isPost=request.method==='POST';if(!isGet&&!isPost)return json({configured:true,error:'method_not_allowed'},405);
    const url=new URL(request.url);let body={};if(isGet){for(const [k,v] of url.searchParams.entries())body[k]=v}else{body=await request.json().catch(()=>({}))}
    const origin=String(body.origin||'').trim(),destination=String(body.destination||'').trim();const stops=Array.isArray(body.stops)?body.stops.map(x=>String(x||'').trim()).filter(Boolean).slice(0,8):String(body.stops||'').split('|').map(x=>x.trim()).filter(Boolean).slice(0,8);const optimize=body.optimize===true||String(body.optimize||'').toLowerCase()==='true';
    if(!origin||!destination)return json({configured:true,error:'origin_destination_required'},400);
    const waypoint=x=>({address:x});const payload={origin:waypoint(origin),destination:waypoint(destination),intermediates:stops.map(waypoint),travelMode:'DRIVE',routingPreference:'TRAFFIC_AWARE',computeAlternativeRoutes:stops.length===0&&!optimize,languageCode:'pt-BR',units:'METRIC',extraComputations:['TOLLS'],routeModifiers:{avoidTolls:false,avoidHighways:false,avoidFerries:false}};if(optimize&&stops.length>1)payload.optimizeWaypointOrder=true;
    const fieldMask=['routes.distanceMeters','routes.duration','routes.routeLabels','routes.polyline.encodedPolyline','routes.travelAdvisory.tollInfo','routes.optimizedIntermediateWaypointIndex','routes.legs.distanceMeters','routes.legs.duration','routes.legs.startLocation','routes.legs.endLocation','routes.legs.steps.navigationInstruction.instructions'].join(',');
    const r=await fetch('https://routes.googleapis.com/directions/v2:computeRoutes',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':fieldMask,'Referer':googleReferrer()},body:JSON.stringify(payload)});const j=await r.json().catch(()=>({}));if(!r.ok)return json({configured:true,error:j?.error?.message||'routes_api_error',code:j?.error?.status||null,details:j},r.status);
    const money=m=>{if(!m)return null;const units=Number(m.units||0),nanos=Number(m.nanos||0);return {currency:m.currencyCode||'BRL',amount:units+nanos/1e9}};const loc=x=>{const p=x?.latLng||x||{};return {latitude:Number(p.latitude||0),longitude:Number(p.longitude||0)}};
    const items=(j.routes||[]).map((route,index)=>{const tolls=(route.travelAdvisory?.tollInfo?.estimatedPrice||[]).map(money).filter(Boolean);const tollTotal=tolls.filter(x=>x.currency==='BRL').reduce((a,x)=>a+x.amount,0);const instructions=(route.legs||[]).flatMap(l=>(l.steps||[]).map(s=>s.navigationInstruction?.instructions).filter(Boolean));const ferry=instructions.some(x=>/balsa|ferry|ferryboat|ferry boat/i.test(x));const legs=(route.legs||[]).map(l=>({distanceMeters:Number(l.distanceMeters||0),duration:l.duration||null,startLocation:loc(l.startLocation),endLocation:loc(l.endLocation)}));return {index,distanceMeters:Number(route.distanceMeters||0),duration:route.duration||null,routeLabels:route.routeLabels||[],polyline:route.polyline?.encodedPolyline||null,tolls,tollTotalBRL:tollTotal||0,hasTolls:!!route.travelAdvisory?.tollInfo,hasFerry:ferry,optimizedIntermediateWaypointIndex:route.optimizedIntermediateWaypointIndex||[],legs,instructions:instructions.slice(0,120)}});return json({configured:true,source:'google_routes',optimized:optimize,items});
  }catch(e){return json({configured:true,error:e?.message||'routes_internal_error'},500)}
}

async function getConnection(env,userId,orgId){
  const q='km_google_calendar_connections?select=*&user_id=eq.'+encodeURIComponent(userId)+'&organization_id=eq.'+encodeURIComponent(orgId)+'&revoked_at=is.null&limit=1';const r=await rest(env,q);if(!r.ok)return null;return (await r.json().catch(()=>[]))[0]||null
}
async function refreshGoogleToken(env,c){
  if(!c?.refresh_token)throw new Error('google_refresh_token_missing');
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.GOOGLE_OAUTH_CLIENT_ID,client_secret:env.GOOGLE_OAUTH_CLIENT_SECRET,refresh_token:c.refresh_token,grant_type:'refresh_token'})});const j=await r.json().catch(()=>({}));if(!r.ok||!j.access_token)throw new Error(j.error_description||j.error||'google_token_refresh_failed');
  const expiresAt=new Date(Date.now()+Number(j.expires_in||3600)*1000).toISOString();await rest(env,'km_google_calendar_connections?id=eq.'+encodeURIComponent(c.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({access_token:j.access_token,token_type:j.token_type||c.token_type||'Bearer',scope:j.scope||c.scope||null,expires_at:expiresAt,updated_at:new Date().toISOString()})});return {...c,access_token:j.access_token,expires_at:expiresAt}
}
async function usableConnection(env,c){if(!c)return null;if(!c.access_token||!c.expires_at||new Date(c.expires_at).getTime()<Date.now()+90000)return refreshGoogleToken(env,c);return c}

async function googleCalendarHealth(request,env){
  return json({configured:calendarConfigured(env),oauth:!!(env.GOOGLE_OAUTH_CLIENT_ID&&env.GOOGLE_OAUTH_CLIENT_SECRET),storage:!!env.SUPABASE_SERVICE_ROLE_KEY,state_signing:!!env.GOOGLE_OAUTH_STATE_SECRET,callback:new URL(request.url).origin+'/api/google-calendar/callback'});
}
async function googleCalendarStatus(request,env){
  if(!calendarConfigured(env))return json({configured:false,connected:false,error:'google_calendar_backend_not_configured'},503);
  const user=await authUser(request,env);if(!user)return json({configured:true,connected:false,error:'unauthorized'},401);
  const org=String(new URL(request.url).searchParams.get('organization_id')||'');if(!org)return json({configured:true,connected:false,error:'organization_id_required'},400);
  const c=await getConnection(env,user.id,org);return json({configured:true,connected:!!c,email:c?.google_email||null,calendar_id:c?.google_calendar_id||null,connected_at:c?.connected_at||null});
}
async function googleCalendarAuthUrl(request,env){
  if(!calendarConfigured(env))return json({configured:false,error:'google_calendar_backend_not_configured'},503);
  const user=await authUser(request,env);if(!user)return json({configured:true,error:'unauthorized'},401);
  const u=new URL(request.url),org=String(u.searchParams.get('organization_id')||'');if(!org)return json({configured:true,error:'organization_id_required'},400);
  const redirect=u.origin+'/api/google-calendar/callback';const state=await stateSign(env,{uid:user.id,org,exp:Date.now()+10*60*1000,nonce:crypto.randomUUID()});
  const p=new URLSearchParams({client_id:env.GOOGLE_OAUTH_CLIENT_ID,redirect_uri:redirect,response_type:'code',scope:'openid email https://www.googleapis.com/auth/calendar.events',access_type:'offline',prompt:'consent',include_granted_scopes:'true',state});
  return json({configured:true,url:'https://accounts.google.com/o/oauth2/v2/auth?'+p.toString(),redirect_uri:redirect});
}
async function googleCalendarCallback(request,env){
  if(!calendarConfigured(env))return new Response('Google Calendar backend not configured',{status:503});
  const u=new URL(request.url),code=u.searchParams.get('code'),state=await stateVerify(env,u.searchParams.get('state'));if(!code||!state)return new Response('Autorização inválida ou expirada.',{status:400});
  const redirect=u.origin+'/api/google-calendar/callback';
  const tr=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:env.GOOGLE_OAUTH_CLIENT_ID,client_secret:env.GOOGLE_OAUTH_CLIENT_SECRET,redirect_uri:redirect,grant_type:'authorization_code'})});const tj=await tr.json().catch(()=>({}));if(!tr.ok||!tj.access_token)return new Response('Falha ao concluir autorização Google.',{status:502});
  let email=null;try{const ur=await fetch('https://www.googleapis.com/oauth2/v2/userinfo',{headers:{authorization:'Bearer '+tj.access_token}});const uj=await ur.json();email=uj.email||null}catch(_){}
  const old=await getConnection(env,state.uid,state.org);const row={organization_id:state.org,user_id:state.uid,google_email:email,google_calendar_id:'primary',access_token:tj.access_token,refresh_token:tj.refresh_token||old?.refresh_token||null,token_type:tj.token_type||'Bearer',scope:tj.scope||null,expires_at:new Date(Date.now()+Number(tj.expires_in||3600)*1000).toISOString(),connected_at:old?.connected_at||new Date().toISOString(),updated_at:new Date().toISOString(),revoked_at:null};
  const rr=await rest(env,'km_google_calendar_connections?on_conflict=organization_id,user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(row)});if(!rr.ok)return new Response('Falha ao salvar autorização Google.',{status:502});
  const target=u.origin+'/?google_calendar=connected';const html='<!doctype html><meta charset="utf-8"><title>Google Agenda conectado</title><body style="font-family:system-ui;padding:30px;text-align:center"><h2>Google Agenda conectado</h2><p>Você pode voltar ao Movvant.</p><script>try{window.opener&&window.opener.postMessage({type:"movvant-google-calendar",status:"connected"},'+JSON.stringify(u.origin)+')}catch(e){}setTimeout(()=>location.replace('+JSON.stringify(target)+'),900)<\/script></body>';
  return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}})
}
async function googleCalendarSync(request,env){
  if(request.method!=='POST')return json({configured:calendarConfigured(env),error:'method_not_allowed'},405);if(!calendarConfigured(env))return json({configured:false,error:'google_calendar_backend_not_configured'},503);
  const user=await authUser(request,env);if(!user)return json({configured:true,error:'unauthorized'},401);const body=await request.json().catch(()=>({})),scheduleId=String(body.schedule_id||'');if(!scheduleId)return json({configured:true,error:'schedule_id_required'},400);
  const sr=await rest(env,'km_scheduled_trips?select=id,user_id,organization_id,scheduled_at,origin,destination,purpose,notes,google_calendar_event_id&id=eq.'+encodeURIComponent(scheduleId)+'&user_id=eq.'+encodeURIComponent(user.id)+'&limit=1');const schedule=(await sr.json().catch(()=>[]))[0];if(!sr.ok||!schedule)return json({configured:true,error:'schedule_not_found'},404);
  let c=await getConnection(env,user.id,schedule.organization_id);if(!c)return json({configured:true,connected:false,error:'google_calendar_not_connected'},409);
  try{c=await usableConnection(env,c);const start=new Date(schedule.scheduled_at),end=new Date(start.getTime()+60*60*1000),event={summary:'Movvant · '+(schedule.purpose||'Percurso'),description:[schedule.origin&&schedule.destination?(schedule.origin+' → '+schedule.destination):'',schedule.notes||''].filter(Boolean).join('\n'),location:schedule.destination||'',start:{dateTime:start.toISOString(),timeZone:'America/Sao_Paulo'},end:{dateTime:end.toISOString(),timeZone:'America/Sao_Paulo'}};const cal=encodeURIComponent(c.google_calendar_id||'primary'),eid=schedule.google_calendar_event_id?encodeURIComponent(schedule.google_calendar_event_id):null,url='https://www.googleapis.com/calendar/v3/calendars/'+cal+'/events'+(eid?'/'+eid:'');let gr=await fetch(url,{method:eid?'PATCH':'POST',headers:{authorization:'Bearer '+c.access_token,'content-type':'application/json'},body:JSON.stringify(event)});if(gr.status===401){c=await refreshGoogleToken(env,c);gr=await fetch(url,{method:eid?'PATCH':'POST',headers:{authorization:'Bearer '+c.access_token,'content-type':'application/json'},body:JSON.stringify(event)})}const gj=await gr.json().catch(()=>({}));if(!gr.ok)throw new Error(gj?.error?.message||'google_calendar_event_failed');const patch={google_calendar_event_id:gj.id||schedule.google_calendar_event_id,google_calendar_sync_status:'synced',google_calendar_synced_at:new Date().toISOString(),google_calendar_sync_error:null,updated_at:new Date().toISOString()};await rest(env,'km_scheduled_trips?id=eq.'+encodeURIComponent(schedule.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(patch)});return json({configured:true,connected:true,synced:true,event_id:patch.google_calendar_event_id,html_link:gj.htmlLink||null})}catch(e){await rest(env,'km_scheduled_trips?id=eq.'+encodeURIComponent(schedule.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({google_calendar_sync_status:'error',google_calendar_sync_error:String(e?.message||e).slice(0,500),updated_at:new Date().toISOString()})}).catch(()=>{});return json({configured:true,connected:true,synced:false,error:String(e?.message||e)},502)}
}
async function googleCalendarDisconnect(request,env){
  if(request.method!=='POST')return json({configured:calendarConfigured(env),error:'method_not_allowed'},405);if(!calendarConfigured(env))return json({configured:false,error:'google_calendar_backend_not_configured'},503);const user=await authUser(request,env);if(!user)return json({configured:true,error:'unauthorized'},401);const body=await request.json().catch(()=>({})),org=String(body.organization_id||'');if(!org)return json({configured:true,error:'organization_id_required'},400);const c=await getConnection(env,user.id,org);if(c?.access_token)fetch('https://oauth2.googleapis.com/revoke?token='+encodeURIComponent(c.access_token),{method:'POST'}).catch(()=>{});await rest(env,'km_google_calendar_connections?user_id=eq.'+encodeURIComponent(user.id)+'&organization_id=eq.'+encodeURIComponent(org),{method:'DELETE',headers:{Prefer:'return=minimal'}});return json({configured:true,connected:false,disconnected:true})
}

export default {async fetch(request,env){
  const path=new URL(request.url).pathname;
  if(path==='/api/maps-health')return json({configured:!!env.GOOGLE_MAPS_API_KEY,places:'/api/places',routes:'/api/routes'});
  if(path==='/api/places')return places(request,env);
  if(path==='/api/routes')return routes(request,env);
  if(path==='/api/google-calendar/health')return googleCalendarHealth(request,env);
  if(path==='/api/google-calendar/status')return googleCalendarStatus(request,env);
  if(path==='/api/google-calendar/auth-url')return googleCalendarAuthUrl(request,env);
  if(path==='/api/google-calendar/callback')return googleCalendarCallback(request,env);
  if(path==='/api/google-calendar/sync')return googleCalendarSync(request,env);
  if(path==='/api/google-calendar/disconnect')return googleCalendarDisconnect(request,env);
  return env.ASSETS.fetch(request)
}};
