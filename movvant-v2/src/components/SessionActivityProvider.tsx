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

export type SessionAppointment = {
  id: string;
  createdAt: string;
  title: string;
  client: string;
  date: string;
  time: string;
  address: string;
  responsible: string;
  status: 'Planejado' | 'Em atendimento' | 'Concluído';
  result?: string;
  nextStep?: string;
  startedAt?: string;
  completedAt?: string;
};

type SessionActivityContextValue = {
  journeys: SessionJourney[];
  routes: SessionRoute[];
  expenses: SessionExpense[];
  appointments: SessionAppointment[];
  addJourney: (journey: Omit<SessionJourney, 'id' | 'createdAt'>) => void;
  addRoute: (route: Omit<SessionRoute, 'id' | 'createdAt'>) => void;
  addExpense: (expense: Omit<SessionExpense, 'id' | 'createdAt'>) => void;
  addAppointment: (appointment: Omit<SessionAppointment, 'id' | 'createdAt' | 'status'>) => void;
  startAppointment: (id: string) => void;
  completeAppointment: (id: string, result: string, nextStep: string) => void;
  clearJourneys: () => void;
  clearRoutes: () => void;
  clearExpenses: () => void;
  clearAppointments: () => void;
  clearAllActivity: () => void;
  totalKm: number;
  totalExpenses: number;
  completedAppointments: number;
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
  const [appointments, setAppointments] = useState<SessionAppointment[]>([]);

  function addJourney(journey: Omit<SessionJourney, 'id' | 'createdAt'>) {
    setJourneys((current) => [{ ...journey, id: createId('journey', current.length), createdAt: new Date().toISOString() }, ...current]);
  }

  function addRoute(route: Omit<SessionRoute, 'id' | 'createdAt'>) {
    setRoutes((current) => [{ ...route, id: createId('route', current.length), createdAt: new Date().toISOString() }, ...current]);
  }

  function addExpense(expense: Omit<SessionExpense, 'id' | 'createdAt'>) {
    setExpenses((current) => [{ ...expense, id: createId('expense', current.length), createdAt: new Date().toISOString() }, ...current]);
  }

  function addAppointment(appointment: Omit<SessionAppointment, 'id' | 'createdAt' | 'status'>) {
    setAppointments((current) => [{ ...appointment, status: 'Planejado', id: createId('appointment', current.length), createdAt: new Date().toISOString() }, ...current]);
  }

  function startAppointment(id: string) {
    const now = new Date().toISOString();
    setAppointments((current) => current.map((appointment) => appointment.id === id && appointment.status === 'Planejado' ? { ...appointment, status: 'Em atendimento', startedAt: now } : appointment));
  }

  function completeAppointment(id: string, result: string, nextStep: string) {
    const now = new Date().toISOString();
    setAppointments((current) => current.map((appointment) => appointment.id === id ? { ...appointment, status: 'Concluído', result, nextStep, completedAt: now, startedAt: appointment.startedAt || now } : appointment));
  }

  function clearJourneys() { setJourneys([]); }
  function clearRoutes() { setRoutes([]); }
  function clearExpenses() { setExpenses([]); }
  function clearAppointments() { setAppointments([]); }
  function clearAllActivity() { setJourneys([]); setRoutes([]); setExpenses([]); setAppointments([]); }

  const totalKm = useMemo(
    () => journeys.reduce((sum, journey) => sum + journey.distance, 0) + routes.reduce((sum, route) => sum + route.distance, 0),
    [journeys, routes]
  );

  const totalExpenses = useMemo(
    () => journeys.reduce((sum, journey) => sum + journey.expenseAmount, 0) + expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [journeys, expenses]
  );

  const completedAppointments = useMemo(() => appointments.filter((appointment) => appointment.status === 'Concluído').length, [appointments]);
  const activityCount = journeys.length + routes.length + expenses.length + appointments.length;
  const value = useMemo(() => ({ journeys, routes, expenses, appointments, addJourney, addRoute, addExpense, addAppointment, startAppointment, completeAppointment, clearJourneys, clearRoutes, clearExpenses, clearAppointments, clearAllActivity, totalKm, totalExpenses, completedAppointments, activityCount }), [journeys, routes, expenses, appointments, totalKm, totalExpenses, completedAppointments, activityCount]);

  return <SessionActivityContext.Provider value={value}>{children}</SessionActivityContext.Provider>;
}

export function useSessionActivity() {
  const context = useContext(SessionActivityContext);
  if (!context) throw new Error('useSessionActivity must be used inside SessionActivityProvider');
  return context;
}
