import {FuelingRecord} from './fueling';

export type MobilitySource='planned'|'gps'|'odometer'|'approved-fueling'|'expense'|'manual';
export type MobilityStatus='planned'|'in_progress'|'completed'|'cancelled';
export type MobilityLedgerRow={
 id:string;companyId:string;userId?:string|null;branchId?:string|null;date:string;status:MobilityStatus;
 vehicleId?:string|null;vehiclePlate?:string|null;title:string;plannedKm:number;actualKm:number;kmSource:MobilitySource;
 fuelLiters:number;fuelCost:number;fuelSource:'approved'|'remote'|'estimated'|'none';otherExpenses:number;totalMobilityCost:number;
 varianceKm:number;variancePct:number;hasTrustedActual:boolean;auditFlags:string[];
};
export type MobilityLedgerSummary={rows:number;completed:number;plannedKm:number;actualKm:number;varianceKm:number;fuelLiters:number;fuelCost:number;otherExpenses:number;totalCost:number;trustedActualPct:number;costPerKm:number};
const n=(v:unknown)=>Number(v||0)||0;
export function summarizeMobilityLedger(rows:MobilityLedgerRow[]):MobilityLedgerSummary{
 const active=rows.filter(r=>r.status!=='cancelled');const completed=active.filter(r=>r.status==='completed');
 const plannedKm=completed.reduce((s,r)=>s+n(r.plannedKm),0),actualKm=completed.reduce((s,r)=>s+n(r.actualKm),0),fuelLiters=completed.reduce((s,r)=>s+n(r.fuelLiters),0),fuelCost=completed.reduce((s,r)=>s+n(r.fuelCost),0),otherExpenses=completed.reduce((s,r)=>s+n(r.otherExpenses),0);const totalCost=fuelCost+otherExpenses;
 return{rows:active.length,completed:completed.length,plannedKm,actualKm,varianceKm:actualKm-plannedKm,fuelLiters,fuelCost,otherExpenses,totalCost,trustedActualPct:completed.length?completed.filter(r=>r.hasTrustedActual).length/completed.length*100:0,costPerKm:actualKm>0?totalCost/actualKm:0};
}
export function approvedFuelingsByVehicle(rows:FuelingRecord[]){return rows.filter(r=>r.workflowStatus==='approved').reduce<Record<string,FuelingRecord[]>>((a,r)=>{(a[r.vehicleId]||(a[r.vehicleId]=[])).push(r);return a;},{});}
export function mobilityAuditFlags(input:{status:MobilityStatus;vehicleId?:string|null;plannedKm:number;actualKm:number;kmSource:MobilitySource;fuelSource:string}){const f:string[]=[];if(input.status==='completed'&&!input.vehicleId)f.push('completed_without_vehicle');if(input.status==='completed'&&input.actualKm<=0)f.push('completed_without_actual_km');if(input.actualKm>0&&input.plannedKm>0&&Math.abs(input.actualKm-input.plannedKm)/input.plannedKm>.3)f.push('km_variance_over_30pct');if(input.status==='completed'&&input.kmSource==='manual')f.push('manual_km_requires_attention');if(input.fuelSource==='estimated')f.push('fuel_estimated');return f;}
