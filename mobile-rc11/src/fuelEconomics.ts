import {FuelingRecord} from './fueling';

export type FuelReference={id:string;avg_km_per_liter?:number|string|null;reference_fuel_price?:number|string|null};
export type RemoteFuelExpense={amount?:number|string|null;fuel_liters?:number|string|null;expense_type?:string|null};
export type FuelEconomics={mode:'approved-real'|'remote-real'|'estimated'|'unavailable';cost:number;liters:number;costPerKm:number;label:string;approvedCount:number;pendingCount:number;excludedCount:number;pendingAmount:number};

const n=(v:unknown)=>Number(v||0)||0;
const isFuel=(r:RemoteFuelExpense)=>/fuel|combust|gasolina|diesel|etanol/i.test(r.expense_type||'')||n(r.fuel_liters)>0;

export function summarizeFuelEconomics(args:{
  km:number;
  fuelings:FuelingRecord[];
  remoteExpenses:RemoteFuelExpense[];
  vehicleRefs:FuelReference[];
  from:Date;
  to:Date;
}):FuelEconomics{
  const {km,fuelings,remoteExpenses,vehicleRefs,from,to}=args;
  const inPeriod=fuelings.filter(r=>{const t=new Date(r.occurredAt);return t>=from&&t<=to});
  const approved=inPeriod.filter(r=>(r.workflowStatus||(r.status==='valid'?'approved':'review'))==='approved');
  const pending=inPeriod.filter(r=>['submitted','attention','review','correction_requested'].includes(r.workflowStatus||(r.status==='valid'?'approved':'review')));
  const excluded=inPeriod.filter(r=>['rejected','cancelled'].includes(r.workflowStatus||''));
  const approvedCost=approved.reduce((s,r)=>s+n(r.totalAmount),0);
  const approvedLiters=approved.reduce((s,r)=>s+n(r.liters),0);
  const pendingAmount=pending.reduce((s,r)=>s+n(r.totalAmount),0);
  if(approved.length){return{mode:'approved-real',cost:approvedCost,liters:approvedLiters,costPerKm:km>0?approvedCost/km:0,label:'Real aprovado',approvedCount:approved.length,pendingCount:pending.length,excludedCount:excluded.length,pendingAmount};}

  const remoteFuel=remoteExpenses.filter(isFuel);
  const remoteCost=remoteFuel.reduce((s,r)=>s+n(r.amount),0);
  const remoteLiters=remoteFuel.reduce((s,r)=>s+n(r.fuel_liters),0);
  if(remoteCost>0||remoteLiters>0){return{mode:'remote-real',cost:remoteCost,liters:remoteLiters,costPerKm:km>0?remoteCost/km:0,label:'Real sincronizado',approvedCount:0,pendingCount:pending.length,excludedCount:excluded.length,pendingAmount};}

  const refs=vehicleRefs.filter(v=>n(v.avg_km_per_liter)>0&&n(v.reference_fuel_price)>0);
  if(km>0&&refs.length===1){const avg=n(refs[0].avg_km_per_liter),price=n(refs[0].reference_fuel_price);const liters=km/avg,cost=liters*price;return{mode:'estimated',cost,liters,costPerKm:km>0?cost/km:0,label:'Estimado por referência',approvedCount:0,pendingCount:pending.length,excludedCount:excluded.length,pendingAmount};}
  return{mode:'unavailable',cost:0,liters:0,costPerKm:0,label:'Sem base confiável',approvedCount:0,pendingCount:pending.length,excludedCount:excluded.length,pendingAmount};
}
