import { BootstrapData } from './api';

export type CommercialHealth = 'good' | 'attention' | 'critical' | 'unknown';
export type CommercialSignalKind='coverage'|'route'|'productivity'|'mobility-cost'|'data-quality';
export type CommercialSignal={kind:CommercialSignalKind;health:CommercialHealth;title:string;detail:string;priority:1|2|3};

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
  ordersPerVisit:number;
  coverageHealth: CommercialHealth;
  routeHealth: CommercialHealth;
  productivityHealth:CommercialHealth;
};

export type MobilityEconomics={fuelCost?:number;expenseCost?:number;costPerKm?:number;approvedFuel?:boolean;dataReady?:boolean};

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
  const ordersPerVisit=visits30d>0?orders30d/visits30d:0;
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
    ordersPerVisit,
    coverageHealth:visits30d>0?health(visitValidationPct,85,65):'unknown',
    routeHealth:routes30d>0?health(routeCompletionPct,90,70):'unknown',
    productivityHealth:visits30d>0?health(ordersPerVisit,0.55,0.25):'unknown',
  };
}

export function buildCommercialSignals(snapshot:CommercialSnapshot,mobility?:MobilityEconomics):CommercialSignal[]{
  const signals:CommercialSignal[]=[];
  if(snapshot.coverageHealth==='critical')signals.push({kind:'coverage',health:'critical',title:'Cobertura comercial crítica',detail:`Apenas ${snapshot.visitValidationPct.toFixed(0)}% das visitas estão validadas.`,priority:1});
  else if(snapshot.coverageHealth==='attention')signals.push({kind:'coverage',health:'attention',title:'Cobertura abaixo do ideal',detail:`Validação de visitas em ${snapshot.visitValidationPct.toFixed(0)}%.`,priority:2});
  if(snapshot.routeHealth==='critical')signals.push({kind:'route',health:'critical',title:'Execução de rotas crítica',detail:`Conclusão de rotas em ${snapshot.routeCompletionPct.toFixed(0)}%.`,priority:1});
  else if(snapshot.routeHealth==='attention')signals.push({kind:'route',health:'attention',title:'Rotas com baixa conclusão',detail:`Conclusão de rotas em ${snapshot.routeCompletionPct.toFixed(0)}%.`,priority:2});
  if(snapshot.productivityHealth==='critical')signals.push({kind:'productivity',health:'critical',title:'Baixa conversão de visitas',detail:`Média de ${snapshot.ordersPerVisit.toFixed(2)} pedido(s) por visita.`,priority:1});
  else if(snapshot.productivityHealth==='attention')signals.push({kind:'productivity',health:'attention',title:'Conversão de visitas em atenção',detail:`Média de ${snapshot.ordersPerVisit.toFixed(2)} pedido(s) por visita.`,priority:2});
  if(mobility?.dataReady===false)signals.push({kind:'data-quality',health:'attention',title:'Dados de mobilidade incompletos',detail:'Complete veículo, combustível, KM e custos para habilitar indicadores confiáveis de custo por venda.',priority:2});
  if(mobility?.dataReady&&n(mobility.costPerKm)>0&&snapshot.revenuePerKm>0){const ratio=n(mobility.costPerKm)/snapshot.revenuePerKm;if(ratio>0.15)signals.push({kind:'mobility-cost',health:'attention',title:'Custo de deslocamento elevado',detail:`O custo de mobilidade representa aproximadamente ${(ratio*100).toFixed(1)}% da receita por km.`,priority:2});}
  return signals.sort((a,b)=>a.priority-b.priority);
}

export type CommercialIntelligenceContract = {
  version:1;
  scope:'self'|'team'|'branch'|'company';
  periodFrom:string;
  periodTo:string;
  branchIds:string[];
  userIds:string[];
  snapshot:CommercialSnapshot;
  mobility?:MobilityEconomics;
  signals:CommercialSignal[];
};

export function createCommercialIntelligenceContract(data:BootstrapData|null,from:string,to:string,mobility?:MobilityEconomics):CommercialIntelligenceContract{
  const snapshot=buildCommercialSnapshot(data);
  return {
    version:1,
    scope:'self',
    periodFrom:from,
    periodTo:to,
    branchIds:data?.branchId?[data.branchId]:[],
    userIds:data?.directory?.user_id?[data.directory.user_id]:[],
    snapshot,
    mobility,
    signals:buildCommercialSignals(snapshot,mobility),
  };
}
