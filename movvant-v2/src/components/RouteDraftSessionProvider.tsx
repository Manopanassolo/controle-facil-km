'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

export type RouteDraft={destination:string;client:string;source:'agenda';};
type RouteDraftContextValue={routeDraft:RouteDraft|null;setRouteDraft:(draft:RouteDraft)=>void;clearRouteDraft:()=>void;};
const RouteDraftContext=createContext<RouteDraftContextValue|null>(null);

export function RouteDraftSessionProvider({children}:{children:ReactNode}){
 const[routeDraft,setRouteDraftState]=useState<RouteDraft|null>(null);
 function setRouteDraft(draft:RouteDraft){setRouteDraftState(draft);}
 function clearRouteDraft(){setRouteDraftState(null);}
 return <RouteDraftContext.Provider value={{routeDraft,setRouteDraft,clearRouteDraft}}>{children}</RouteDraftContext.Provider>;
}

export function useRouteDraftSession(){const context=useContext(RouteDraftContext);if(!context)throw new Error('useRouteDraftSession must be used inside RouteDraftSessionProvider');return context;}
