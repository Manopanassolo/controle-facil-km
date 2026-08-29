module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).json({configured:!!process.env.GOOGLE_MAPS_API_KEY,error:'method_not_allowed'});
  const key=process.env.GOOGLE_MAPS_API_KEY;
  if(!key)return res.status(503).json({configured:false,items:[],error:'GOOGLE_MAPS_API_KEY_not_configured'});
  const q=String(req.query?.q||'').trim().slice(0,160);
  if(q.length<2)return res.status(200).json({configured:true,items:[]});
  const headers={'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text,suggestions.placePrediction.types'};
  try{
    const a=await fetch('https://places.googleapis.com/v1/places:autocomplete',{method:'POST',headers,body:JSON.stringify({input:q,includedRegionCodes:['br'],languageCode:'pt-BR',includePureServiceAreaBusinesses:true})});
    const aj=await a.json().catch(()=>({}));
    if(!a.ok)throw new Error(aj?.error?.message||('Google Places HTTP '+a.status));
    let items=(aj.suggestions||[]).map(x=>x.placePrediction).filter(Boolean).map(p=>({placeId:p.placeId||'',text:p.text?.text||'',mainText:p.structuredFormat?.mainText?.text||p.text?.text||'',secondaryText:p.structuredFormat?.secondaryText?.text||'',types:p.types||[]}));
    if(!items.length&&q.length>=5){
      const tr=await fetch('https://places.googleapis.com/v1/places:searchText',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'places.id,places.displayName,places.formattedAddress,places.types'},body:JSON.stringify({textQuery:q,languageCode:'pt-BR',regionCode:'BR',pageSize:8,includePureServiceAreaBusinesses:true})});
      const tj=await tr.json().catch(()=>({}));
      if(tr.ok)items=(tj.places||[]).map(p=>({placeId:p.id||'',text:[p.displayName?.text,p.formattedAddress].filter(Boolean).join(', '),mainText:p.displayName?.text||p.formattedAddress||'',secondaryText:p.formattedAddress||'',types:p.types||[]}));
    }
    return res.status(200).json({configured:true,items:items.slice(0,10)});
  }catch(e){return res.status(502).json({configured:true,items:[],error:String(e?.message||e)})}
};
