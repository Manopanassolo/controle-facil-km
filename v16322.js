const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.51: keep v163.50 lifecycle authoritative after every legacy render.
(function(){
  const byId=id=>document.getElementById(id);
  let routeFinishTriggeredFor='';
  function guard(){
    const start=byId('btViagem');
    if(start?.dataset.mvStart16350==='1'){
      start.dataset.mvStartV16229='1';
      start.dataset.mvStartV16221='1';
      start.dataset.mvStartV16219='1';
    }
    const finish=byId('btFinalizar');
    if(finish?.dataset.mvFinish16350==='1'){
      finish.dataset.mv16226='1';
      finish.dataset.v112='1';
    }
    const q=byId('expenseQuickV135');if(q)q.style.setProperty('display','none','important');
  }
  function authority(){
    try{globalThis.mvTripLifecycleV16350?.sync?.()}catch(e){console.warn('v163.51 lifecycle sync',e)}
    guard();
  }
  // Run synchronously before older MutationObserver callbacks get a chance to replace the fresh controls.
  guard();
  authority();
  if(typeof renderActive==='function'&&!renderActive.mvLifecycleAuthority16351){
    const base=renderActive;
    const wrapped=function(){const out=base.apply(this,arguments);authority();return out};
    wrapped.mvLifecycleAuthority16351=true;renderActive=wrapped;try{globalThis.renderActive=wrapped}catch(_){}
  }
  if(typeof render==='function'&&!render.mvLifecycleAuthority16351){
    const base=render;
    const wrapped=function(){const out=base.apply(this,arguments);authority();return out};
    wrapped.mvLifecycleAuthority16351=true;render=wrapped;try{globalThis.render=wrapped}catch(_){}
  }
  // A completed trip must also close any operational GPS execution, but this secondary work never blocks the user confirmation.
  function consolidateRouteExecution(){
    if(document.body.dataset.mvTripState!=='completed')return;
    let data=null;try{data=JSON.parse(sessionStorage.getItem('mv_trip_completed_16350')||'null')}catch(_){}
    const id=data?.id||'completed';if(routeFinishTriggeredFor===id)return;routeFinishTriggeredFor=id;
    setTimeout(async()=>{try{if(typeof globalThis.v141FinishExecution==='function')await globalThis.v141FinishExecution()}catch(e){console.warn('v163.51 route execution consolidation',e)}},0);
  }
  const mo=new MutationObserver(()=>{guard();consolidateRouteExecution()});
  if(document.body)mo.observe(document.body,{attributes:true,attributeFilter:['data-mv-trip-state'],subtree:false});
  [0,60,180,500,1200,2600].forEach(ms=>setTimeout(()=>{authority();consolidateRouteExecution()},ms));
  addEventListener('pageshow',()=>setTimeout(authority,0),true);
  document.documentElement.dataset.mvTripAuthority='163.51';
  globalThis.mvTripAuthorityV16351={sync:authority,guard};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.51 startup anchor not found');
s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.51: exactly one expense category bar; no old horizontal quick-button strip */
#expenseQuickV135,#mvExpenseSelectHint16350{display:none!important}
.mv-expense-select16350{display:block!important;width:100%!important;max-width:none!important;min-height:54px!important;margin:0!important}
`;
if(!s.includes('</style>'))throw new Error('v163.51 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v163.51 canonical trip lifecycle authority locked');
