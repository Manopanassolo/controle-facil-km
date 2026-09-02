'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useSessionActivity } from './SessionActivityProvider';

export type SessionDriver={id:string;name:string;role:string;access:string;status:'Ativo'|'Pendente';source:'base'|'session';};

const baseDrivers:SessionDriver[]=[
 {id:'driver-marcos',name:'Marcos Paulo',role:'Administrador',access:'Todas as lojas',status:'Ativo',source:'base'},
 {id:'driver-ana',name:'Ana Costa',role:'Gerente Comercial',access:'Itajaí · Camboriú',status:'Ativo',source:'base'},
 {id:'driver-rafael',name:'Rafael Silva',role:'Vendedor Externo',access:'Balneário Camboriú',status:'Ativo',source:'base'},
 {id:'driver-lucas',name:'Lucas Martins',role:'Supervisor Comercial',access:'Itajaí · Navegantes',status:'Pendente',source:'base'},
 {id:'driver-carla',name:'Carla Freitas',role:'Financeiro',access:'Todas as lojas',status:'Ativo',source:'base'},
 {id:'driver-joao',name:'João Pereira',role:'Vendedor Loja',access:'Camboriú',status:'Ativo',source:'base'}
];

type DriverContextValue={drivers:SessionDriver[];driverOptions:string[];addDriver:(driver:Omit<SessionDriver,'id'|'source'>)=>void;clearSessionDrivers:()=>void;isDriverEligible:(name:string)=>boolean;};
const DriverContext=createContext<DriverContextValue|null>(null);

export function DriverSessionProvider({children}:{children:ReactNode}){
 const{blockedDrivers}=useSessionActivity();
 const[sessionDrivers,setSessionDrivers]=useState<SessionDriver[]>([]);
 const drivers=useMemo(()=>[...sessionDrivers,...baseDrivers],[sessionDrivers]);
 const driverOptions=useMemo(()=>drivers.filter((driver)=>driver.status==='Ativo'&&!blockedDrivers.includes(driver.name)).map((driver)=>driver.name),[drivers,blockedDrivers]);
 function addDriver(driver:Omit<SessionDriver,'id'|'source'>){setSessionDrivers((current)=>[{...driver,id:`driver-${Date.now()}-${current.length+1}`,source:'session'},...current]);}
 function clearSessionDrivers(){setSessionDrivers([]);}
 function isDriverEligible(name:string){return driverOptions.includes(name);}
 return <DriverContext.Provider value={{drivers,driverOptions,addDriver,clearSessionDrivers,isDriverEligible}}>{children}</DriverContext.Provider>;
}

export function useDriverSession(){const context=useContext(DriverContext);if(!context)throw new Error('useDriverSession must be used inside DriverSessionProvider');return context;}
