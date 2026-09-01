'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type SessionJourney = {
  id: string;
  createdAt: string;
  vehicle: string;
  kmStart: number;
  client: string;
  visitResult: string;
  expense: string;
  kmEnd: number;
  distance: number;
};

type SessionActivityContextValue = {
  journeys: SessionJourney[];
  addJourney: (journey: Omit<SessionJourney, 'id' | 'createdAt'>) => void;
  clearJourneys: () => void;
  totalKm: number;
};

const SessionActivityContext = createContext<SessionActivityContextValue | null>(null);

export function SessionActivityProvider({ children }: { children: ReactNode }) {
  const [journeys, setJourneys] = useState<SessionJourney[]>([]);

  function addJourney(journey: Omit<SessionJourney, 'id' | 'createdAt'>) {
    setJourneys((current) => [{
      ...journey,
      id: `${Date.now()}-${current.length + 1}`,
      createdAt: new Date().toISOString()
    }, ...current]);
  }

  function clearJourneys() {
    setJourneys([]);
  }

  const totalKm = useMemo(() => journeys.reduce((sum, journey) => sum + journey.distance, 0), [journeys]);

  const value = useMemo(() => ({ journeys, addJourney, clearJourneys, totalKm }), [journeys, totalKm]);

  return <SessionActivityContext.Provider value={value}>{children}</SessionActivityContext.Provider>;
}

export function useSessionActivity() {
  const context = useContext(SessionActivityContext);
  if (!context) throw new Error('useSessionActivity must be used inside SessionActivityProvider');
  return context;
}
