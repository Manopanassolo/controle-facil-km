'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type NotificationPreferenceKey='fleet'|'documents'|'incidents'|'agenda'|'field'|'finance';
export type SessionProfile={name:string;email:string;phone:string;role:string;company:string;};
export type NotificationPreferences=Record<NotificationPreferenceKey,boolean>;

type PreferencesContextValue={
 profile:SessionProfile;
 notificationPreferences:NotificationPreferences;
 updateProfile:(patch:Partial<Pick<SessionProfile,'name'|'email'|'phone'>>)=>void;
 setNotificationPreference:(key:NotificationPreferenceKey,enabled:boolean)=>void;
 resetPreferences:()=>void;
 enabledNotificationCount:number;
};

const initialProfile:SessionProfile={name:'Marcos Paulo',email:'usuario@movvant.app',phone:'(47) 99999-0000',role:'Administrador',company:'Movvant'};
const initialNotifications:NotificationPreferences={fleet:true,documents:true,incidents:true,agenda:true,field:true,finance:true};
const PreferencesContext=createContext<PreferencesContextValue|null>(null);

export function PreferencesSessionProvider({children}:{children:ReactNode}){
 const[profile,setProfile]=useState<SessionProfile>(initialProfile);
 const[notificationPreferences,setNotificationPreferences]=useState<NotificationPreferences>(initialNotifications);
 function updateProfile(patch:Partial<Pick<SessionProfile,'name'|'email'|'phone'>>){setProfile((current)=>({...current,...patch}));}
 function setNotificationPreference(key:NotificationPreferenceKey,enabled:boolean){setNotificationPreferences((current)=>({...current,[key]:enabled}));}
 function resetPreferences(){setProfile(initialProfile);setNotificationPreferences(initialNotifications);}
 const enabledNotificationCount=useMemo(()=>Object.values(notificationPreferences).filter(Boolean).length,[notificationPreferences]);
 return <PreferencesContext.Provider value={{profile,notificationPreferences,updateProfile,setNotificationPreference,resetPreferences,enabledNotificationCount}}>{children}</PreferencesContext.Provider>;
}

export function usePreferencesSession(){const context=useContext(PreferencesContext);if(!context)throw new Error('usePreferencesSession must be used inside PreferencesSessionProvider');return context;}
