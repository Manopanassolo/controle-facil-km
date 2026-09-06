module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).json({error:'method_not_allowed'});
  const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.VITE_SUPABASE_URL||process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_PUBLISHABLE_KEY||process.env.SUPABASE_ANON_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||process.env.VITE_SUPABASE_ANON_KEY||process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const auth=String(req.headers.authorization||'');
  if(!url||!key)return res.status(503).json({configured:false,error:'supabase_env_not_configured'});
  if(!auth.startsWith('Bearer '))return res.status(401).json({configured:true,error:'missing_bearer_token'});
  const branchId=String(req.query?.branch_id||'').trim();
  const userId=String(req.query?.user_id||'').trim();
  const qs=new URLSearchParams({select:'company_id,branch_id,user_id,full_name,visits_30d,validated_visits_30d,visit_validation_pct,actual_km_30d,routes_30d,completed_routes_30d,avg_adherence_pct,orders_30d,revenue_30d',limit:'500'});
  if(branchId)qs.set('branch_id',`eq.${branchId}`);
  if(userId)qs.set('user_id',`eq.${userId}`);
  try{
    const r=await fetch(`${String(url).replace(/\/$/,'')}/rest/v1/v_field_commercial_performance_30d?${qs.toString()}`,{headers:{apikey:key,Authorization:auth}});
    const rows=await r.json().catch(()=>[]);
    if(!r.ok)return res.status(r.status).json({configured:true,error:rows?.message||rows?.error||'performance_query_failed'});
    const n=v=>Number(v||0)||0;
    const total=(field)=>rows.reduce((s,x)=>s+n(x[field]),0);
    const visits=total('visits_30d'),validated=total('validated_visits_30d'),routes=total('routes_30d'),completed=total('completed_routes_30d'),km=total('actual_km_30d'),orders=total('orders_30d'),revenue=total('revenue_30d');
    const snapshot={visits30d:visits,validatedVisits30d:validated,visitValidationPct:visits?validated/visits*100:0,routes30d:routes,completedRoutes30d:completed,routeCompletionPct:routes?completed/routes*100:0,km30d:km,orders30d:orders,revenue30d:revenue,revenuePerVisit:visits?revenue/visits:0,revenuePerKm:km?revenue/km:0};
    return res.status(200).json({configured:true,source:'v_field_commercial_performance_30d',snapshot,rows});
  }catch(e){return res.status(500).json({configured:true,error:e?.message||'commercial_intelligence_internal_error'});}
};
