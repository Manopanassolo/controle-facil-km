'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useSessionActivity } from './SessionActivityProvider';
import { useDriverSession } from './DriverSessionProvider';

export type IncidentSeverity='Baixa'|'Média'|'Alta'|'Crítica';
export type SessionIncident={
 id:string;createdAt:string;vehicle:string;driver:string;date:string;location:string;description:string;notes:string;severity:IncidentSeverity;
 status:'Pendente'|'Em análise'|'Concluído';requiresAction:boolean;actionOwner:string;actionDue:string;resolution?:string;resolvedAt?:string;
};

type IncidentContextValue={incidents:SessionIncident[];pendingIncidents:SessionIncident[];addIncident:(incident:Omit<SessionIncident,'id'|'createdAt'|'status'|'resolution'|'resolvedAt'>)=>void;startIncidentReview:(id:string)=>void;resolveIncident:(id:string,resolution:string)=>void;clearIncidents:()=>void;};
const IncidentContext=createContext<IncidentContextValue|null>(null);

export function IncidentSessionProvider({children}:{children:ReactNode}){
 const{vehicleOptions}=useSessionActivity();
 const{driverOptions}=useDriverSession();
 const[incidents,setIncidents]=useState<SessionIncident[]>([]);
 function addIncident(incident:Omit<SessionIncident,'id'|'createdAt'|'status'|'resolution'|'resolvedAt'>){
  if(!vehicleOptions.includes(incident.vehicle)||!driverOptions.includes(incident.driver))return;
  setIncidents((current)=>[{...incident,id:`incident-${Date.now()}-${current.length+1}`,createdAt:new Date().toISOString(),status:'Pendente'},...current]);
 }
 function startIncidentReview(id:string){setIncidents((current)=>current.map((item)=>item.id===id&&item.status==='Pendente'?{...item,status:'Em análise'}:item));}
 function resolveIncident(id:string,resolution:string){const now=new Date().toISOString();setIncidents((current)=>current.map((item)=>item.id===id?{...item,status:'Concluído',resolution,resolvedAt:now,requiresAction:false}:item));}
 function clearIncidents(){setIncidents([]);}
 const pendingIncidents=useMemo(()=>incidents.filter((item)=>item.requiresAction&&item.status!=='Concluído'),[incidents]);
 return <IncidentContext.Provider value={{incidents,pendingIncidents,addIncident,startIncidentReview,resolveIncident,clearIncidents}}>{children}</IncidentContext.Provider>;
}

export function useIncidentSession(){const context=useContext(IncidentContext);if(!context)throw new Error('useIncidentSession must be used inside IncidentSessionProvider');return context;}
