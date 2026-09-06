import { BootstrapData } from './api';

export type CommercialHealth = 'good' | 'attention' | 'critical' | 'unknown';

export type CommercialSnapshot = {
  visits30d: number;
  validatedVisits30d: number;
  visitValidationPct: number;
  routes30d: number;
  completedRoutes30d: number;
  routeCompletionPct: number;
  km30d: number;
  orders30d: number;
  revenue30d: number;
  revenuePerVisit: number;
  revenuePerKm: number;
  coverageHealth: CommercialHealth;
  routeHealth: CommercialHealth;
};

const n=(v:unknown)=>Number(v||0)||0;
const pct=(a:number,b:number)=>b>0?(a/b)*100:0;
const health=(value:number,good:number,attention:number):CommercialHealth=>{
  if(!Number.isFinite(value)) return 'unknown';
  if(value>=good) return 'good';
  if(value>=attention) return 'attention';
  return 'critical';
};

export function buildCommercialSnapshot(data:BootstrapData|null):CommercialSnapshot{
  const p=data?.performance;
  const visits30d=n(p?.visits_30d);
  const validatedVisits30d=n(p?.validated_visits_30d);
  const visitValidationPct=n(p?.visit_validation_pct)||pct(validatedVisits30d,visits30d);
  const routes30d=n(p?.routes_30d);
  const completedRoutes30d=n(p?.completed_routes_30d);
  const routeCompletionPct=pct(completedRoutes30d,routes30d);
  const km30d=n(p?.actual_km_30d);
  const orders30d=n(p?.orders_30d);
  const revenue30d=n(p?.revenue_30d);
  return {
    visits30d,
    validatedVisits30d,
    visitValidationPct,
    routes30d,
    completedRoutes30d,
    routeCompletionPct,
    km30d,
    orders30d,
    revenue30d,
    revenuePerVisit:visits30d>0?revenue30d/visits30d:0,
    revenuePerKm:km30d>0?revenue30d/km30d:0,
    coverageHealth:health(visitValidationPct,85,65),
    routeHealth:health(routeCompletionPct,90,70),
  };
}

export type CommercialIntelligenceContract = {
  scope:'self'|'team'|'branch'|'company';
  periodFrom:string;
  periodTo:string;
  branchIds:string[];
  userIds:string[];
  snapshot:CommercialSnapshot;
};

export function createCommercialIntelligenceContract(data:BootstrapData|null,from:string,to:string):CommercialIntelligenceContract{
  return {
    scope:'self',
    periodFrom:from,
    periodTo:to,
    branchIds:data?.branchId?[data.branchId]:[],
    userIds:data?.directory?.user_id?[data.directory.user_id]:[],
    snapshot:buildCommercialSnapshot(data),
  };
}
