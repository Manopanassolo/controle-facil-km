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
  expenseAmount: number;
  kmEnd: number;
  distance: number;
};

export type SessionRoute = {
  id: string;
  createdAt: string;
  origin: string;
  destination: string;
  vehicle: string;
  purpose: string;
  kmStart: number;
  kmEnd: number;
  distance: number;
};

export type SessionExpense = {
  id: string;
  createdAt: string;
  category: string;
  amount: number;
  date: string;
  vehicle: string;
  km?: number;
  place: string;
};

type SessionActivityContextValue = {
  journeys: SessionJourney[];
  routes: SessionRoute[];
  expenses: SessionExpense[];
  addJourney: (journey: Omit<SessionJourney, 'id' | 'createdAt'>) => void;
  addRoute: (route: Omit<SessionRoute, 'id' | 'createdAt'>) => void;
  addExpense: (expense: Omit<SessionExpense, 'id' | 'createdAt'>) => void;
  clearJourneys: () => void;
  clearRoutes: () => void;
  clearExpenses: () => void;
  clearAllActivity: () => void;
  totalKm: number;
  totalExpenses: number;
  activityCount: number;
};

const SessionActivityContext = createContext<SessionActivityContextValue | null>(null);

function createId(prefix: string, length: number) {
  return `${prefix}-${Date.now()}-${length + 1}`;
}

export function SessionActivityProvider({ children }: { children: ReactNode }) {
  const [journeys, setJourneys] = useState<SessionJourney[]>([]);
  const [routes, setRoutes] = useState<SessionRoute[]>([]);
  const [expenses, setExpenses] = useState<SessionExpense[]>([]);

  function addJourney(journey: Omit<SessionJourney, 'id' | 'createdAt'>) {
    setJourneys((current) => [{ ...journey, id: createId('journey', current.length), createdAt: new Date().toISOString() }, ...current]);
  }

  function addRoute(route: Omit<SessionRoute, 'id' | 'createdAt'>) {
    setRoutes((current) => [{ ...route, id: createId('route', current.length), createdAt: new Date().toISOString() }, ...current]);
  }

  function addExpense(expense: Omit<SessionExpense, 'id' | 'createdAt'>) {
    setExpenses((current) => [{ ...expense, id: createId('expense', current.length), createdAt: new Date().toISOString() }, ...current]);
  }

  function clearJourneys() { setJourneys([]); }
  function clearRoutes() { setRoutes([]); }
  function clearExpenses() { setExpenses([]); }
  function clearAllActivity() { setJourneys([]); setRoutes([]); setExpenses([]); }

  const totalKm = useMemo(
    () => journeys.reduce((sum, journey) => sum + journey.distance, 0) + routes.reduce((sum, route) => sum + route.distance, 0),
    [journeys, routes]
  );

  const totalExpenses = useMemo(
    () => journeys.reduce((sum, journey) => sum + journey.expenseAmount, 0) + expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [journeys, expenses]
  );

  const activityCount = journeys.length + routes.length + expenses.length;
  const value = useMemo(() => ({ journeys, routes, expenses, addJourney, addRoute, addExpense, clearJourneys, clearRoutes, clearExpenses, clearAllActivity, totalKm, totalExpenses, activityCount }), [journeys, routes, expenses, totalKm, totalExpenses, activityCount]);

  return <SessionActivityContext.Provider value={value}>{children}</SessionActivityContext.Provider>;
}

export function useSessionActivity() {
  const context = useContext(SessionActivityContext);
  if (!context) throw new Error('useSessionActivity must be used inside SessionActivityProvider');
  return context;
}
