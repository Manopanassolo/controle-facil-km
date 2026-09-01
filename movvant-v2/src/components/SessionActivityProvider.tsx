'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type SessionJourney = { id:string; createdAt:string; vehicle:string; kmStart:number; client:string; visitResult:string; expense:string; expenseAmount:number; kmEnd:number; distance:number; };
export type SessionRoute = { id:string; createdAt:string; origin:string; destination:string; vehicle:string; purpose:string; kmStart:number; kmEnd:number; distance:number; };
export type SessionExpense = { id:string; createdAt:string; category:string; amount:number; date:string; vehicle:string; km?:number; place:string; };
export type SessionAppointment = { id:string; createdAt:string; title:string; client:string; date:string; time:string; address:string; responsible:string; status:'Planejado'|'Em atendimento'|'Concluído'; result?:string; nextStep?:string; startedAt?:string; completedAt?:string; };
export type MaintenanceState = 'ok' | 'proxima' | 'vencida';
export type SessionVehicle = {
  id:string; name:string; plate:string; model:string; year:number; currentKm:number; responsible:string;
  status:'Ativo'|'Reserva'|'Manutenção'; source:'base'|'session'; nextMaintenanceKm:number; nextMaintenanceDate:string;
};
export type MaintenanceAlert = { vehicleId:string; vehicle:string; plate:string; state:MaintenanceState; remainingKm:number; remainingDays:number; dueKm:number; dueDate:string; };

const baseVehicles: SessionVehicle[] = [
  { id:'base-suv', name:'SUV Comercial', plate:'ABC1D23', model:'Veículo demonstrativo', year:2026, currentKm:12480, responsible:'Equipe comercial', status:'Ativo', source:'base', nextMaintenanceKm:13000, nextMaintenanceDate:'2026-09-18' },
  { id:'base-hatch', name:'Hatch Vendas', plate:'DEF4G56', model:'Veículo demonstrativo', year:2025, currentKm:38210, responsible:'Equipe comercial', status:'Ativo', source:'base', nextMaintenanceKm:40000, nextMaintenanceDate:'2026-11-15' },
  { id:'base-utilitario', name:'Utilitário', plate:'GHI7J89', model:'Veículo demonstrativo', year:2024, currentKm:64990, responsible:'Logística', status:'Manutenção', source:'base', nextMaintenanceKm:65000, nextMaintenanceDate:'2026-08-30' }
];

const MAINTENANCE_WARNING_KM = 750;
const MAINTENANCE_WARNING_DAYS = 14;

function dayDiff(date: string) {
  if (!date) return Number.POSITIVE_INFINITY;
  const due = new Date(`${date}T12:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

function maintenanceFor(vehicle: SessionVehicle): MaintenanceAlert {
  const remainingKm = vehicle.nextMaintenanceKm - vehicle.currentKm;
  const remainingDays = dayDiff(vehicle.nextMaintenanceDate);
  const state: MaintenanceState = remainingKm <= 0 || remainingDays < 0 ? 'vencida' : remainingKm <= MAINTENANCE_WARNING_KM || remainingDays <= MAINTENANCE_WARNING_DAYS ? 'proxima' : 'ok';
  return { vehicleId:vehicle.id, vehicle:vehicle.name, plate:vehicle.plate, state, remainingKm, remainingDays, dueKm:vehicle.nextMaintenanceKm, dueDate:vehicle.nextMaintenanceDate };
}

type SessionActivityContextValue = {
  journeys:SessionJourney[]; routes:SessionRoute[]; expenses:SessionExpense[]; appointments:SessionAppointment[]; vehicles:SessionVehicle[];
  vehicleOptions:string[]; maintenanceAlerts:MaintenanceAlert[]; maintenancePendingCount:number;
  addJourney:(journey:Omit<SessionJourney,'id'|'createdAt'>)=>void; addRoute:(route:Omit<SessionRoute,'id'|'createdAt'>)=>void;
  addExpense:(expense:Omit<SessionExpense,'id'|'createdAt'>)=>void; addAppointment:(appointment:Omit<SessionAppointment,'id'|'createdAt'|'status'>)=>void;
  addVehicle:(vehicle:Omit<SessionVehicle,'id'|'source'>)=>void; updateVehicleKm:(vehicleName:string,km:number)=>number; getVehicleKm:(vehicleName:string)=>number;
  startAppointment:(id:string)=>void; completeAppointment:(id:string,result:string,nextStep:string)=>void;
  clearJourneys:()=>void; clearRoutes:()=>void; clearExpenses:()=>void; clearAppointments:()=>void; clearSessionVehicles:()=>void; clearAllActivity:()=>void;
  totalKm:number; totalExpenses:number; completedAppointments:number; activityCount:number;
};

const SessionActivityContext = createContext<SessionActivityContextValue|null>(null);
function createId(prefix:string,length:number){ return `${prefix}-${Date.now()}-${length+1}`; }

export function SessionActivityProvider({children}:{children:ReactNode}){
  const [journeys,setJourneys]=useState<SessionJourney[]>([]);
  const [routes,setRoutes]=useState<SessionRoute[]>([]);
  const [expenses,setExpenses]=useState<SessionExpense[]>([]);
  const [appointments,setAppointments]=useState<SessionAppointment[]>([]);
  const [sessionVehicles,setSessionVehicles]=useState<SessionVehicle[]>([]);
  const [baseKmOverrides,setBaseKmOverrides]=useState<Record<string,number>>({});

  const vehicles=useMemo(()=>[
    ...sessionVehicles,
    ...baseVehicles.map((vehicle)=>({...vehicle,currentKm:Math.max(vehicle.currentKm,baseKmOverrides[vehicle.id]||vehicle.currentKm)}))
  ],[sessionVehicles,baseKmOverrides]);
  const maintenanceAlerts=useMemo(()=>vehicles.map(maintenanceFor),[vehicles]);
  const operationalIds=useMemo(()=>new Set(maintenanceAlerts.filter((alert)=>alert.state!=='vencida').map((alert)=>alert.vehicleId)),[maintenanceAlerts]);
  const vehicleOptions=useMemo(()=>vehicles.filter((vehicle)=>vehicle.status!=='Manutenção'&&operationalIds.has(vehicle.id)).map((vehicle)=>vehicle.name),[vehicles,operationalIds]);
  const maintenancePendingCount=maintenanceAlerts.filter((alert)=>alert.state!=='ok').length;

  function addJourney(journey:Omit<SessionJourney,'id'|'createdAt'>){ setJourneys((current)=>[{...journey,id:createId('journey',current.length),createdAt:new Date().toISOString()},...current]); }
  function addRoute(route:Omit<SessionRoute,'id'|'createdAt'>){ setRoutes((current)=>[{...route,id:createId('route',current.length),createdAt:new Date().toISOString()},...current]); }
  function addExpense(expense:Omit<SessionExpense,'id'|'createdAt'>){ setExpenses((current)=>[{...expense,id:createId('expense',current.length),createdAt:new Date().toISOString()},...current]); }
  function addAppointment(appointment:Omit<SessionAppointment,'id'|'createdAt'|'status'>){ setAppointments((current)=>[{...appointment,status:'Planejado',id:createId('appointment',current.length),createdAt:new Date().toISOString()},...current]); }
  function addVehicle(vehicle:Omit<SessionVehicle,'id'|'source'>){ setSessionVehicles((current)=>[{...vehicle,id:createId('vehicle',current.length),source:'session'},...current]); }

  function getVehicleKm(vehicleName:string){ return vehicles.find((vehicle)=>vehicle.name===vehicleName)?.currentKm||0; }
  function updateVehicleKm(vehicleName:string,km:number){
    const vehicle=vehicles.find((item)=>item.name===vehicleName);
    if(!vehicle) return Math.max(0,km);
    const safeKm=Math.max(vehicle.currentKm,km);
    if(vehicle.source==='session') setSessionVehicles((current)=>current.map((item)=>item.id===vehicle.id?{...item,currentKm:Math.max(item.currentKm,safeKm)}:item));
    else setBaseKmOverrides((current)=>({...current,[vehicle.id]:Math.max(current[vehicle.id]||vehicle.currentKm,safeKm)}));
    return safeKm;
  }

  function startAppointment(id:string){ const now=new Date().toISOString(); setAppointments((current)=>current.map((a)=>a.id===id&&a.status==='Planejado'?{...a,status:'Em atendimento',startedAt:now}:a)); }
  function completeAppointment(id:string,result:string,nextStep:string){ const now=new Date().toISOString(); setAppointments((current)=>current.map((a)=>a.id===id?{...a,status:'Concluído',result,nextStep,completedAt:now,startedAt:a.startedAt||now}:a)); }
  function clearJourneys(){setJourneys([]);} function clearRoutes(){setRoutes([]);} function clearExpenses(){setExpenses([]);} function clearAppointments(){setAppointments([]);} function clearSessionVehicles(){setSessionVehicles([]);} function clearAllActivity(){setJourneys([]);setRoutes([]);setExpenses([]);setAppointments([]);}

  const totalKm=useMemo(()=>journeys.reduce((s,j)=>s+j.distance,0)+routes.reduce((s,r)=>s+r.distance,0),[journeys,routes]);
  const totalExpenses=useMemo(()=>journeys.reduce((s,j)=>s+j.expenseAmount,0)+expenses.reduce((s,e)=>s+e.amount,0),[journeys,expenses]);
  const completedAppointments=useMemo(()=>appointments.filter((a)=>a.status==='Concluído').length,[appointments]);
  const activityCount=journeys.length+routes.length+expenses.length+appointments.length;
  const value=useMemo(()=>({journeys,routes,expenses,appointments,vehicles,vehicleOptions,maintenanceAlerts,maintenancePendingCount,addJourney,addRoute,addExpense,addAppointment,addVehicle,updateVehicleKm,getVehicleKm,startAppointment,completeAppointment,clearJourneys,clearRoutes,clearExpenses,clearAppointments,clearSessionVehicles,clearAllActivity,totalKm,totalExpenses,completedAppointments,activityCount}),[journeys,routes,expenses,appointments,vehicles,vehicleOptions,maintenanceAlerts,maintenancePendingCount,totalKm,totalExpenses,completedAppointments,activityCount]);
  return <SessionActivityContext.Provider value={value}>{children}</SessionActivityContext.Provider>;
}

export function useSessionActivity(){ const context=useContext(SessionActivityContext); if(!context) throw new Error('useSessionActivity must be used inside SessionActivityProvider'); return context; }
