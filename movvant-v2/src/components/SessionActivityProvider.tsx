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

export type SessionVehicle = {
  id: string;
  name: string;
  plate: string;
  model: string;
  year: number;
  currentKm: number;
  responsible: string;
  status: 'Ativo' | 'Reserva' | 'Manutenção';
  source: 'base' | 'session';
};

const baseVehicles: SessionVehicle[] = [
  { id: 'base-suv', name: 'SUV Comercial', plate: 'ABC1D23', model: 'Veículo demonstrativo', year: 2026, currentKm: 12480, responsible: 'Equipe comercial', status: 'Ativo', source: 'base' },
  { id: 'base-hatch', name: 'Hatch Vendas', plate: 'DEF4G56', model: 'Veículo demonstrativo', year: 2025, currentKm: 38210, responsible: 'Equipe comercial', status: 'Ativo', source: 'base' },
  { id: 'base-utilitario', name: 'Utilitário', plate: 'GHI7J89', model: 'Veículo demonstrativo', year: 2024, currentKm: 64990, responsible: 'Logística', status: 'Manutenção', source: 'base' }
];

type SessionActivityContextValue = {
  journeys: SessionJourney[];
  routes: SessionRoute[];
  expenses: SessionExpense[];
  appointments: SessionAppointment[];
  vehicles: SessionVehicle[];
  vehicleOptions: string[];
  addJourney: (journey: Omit<SessionJourney, 'id' | 'createdAt'>) => void;
  addRoute: (route: Omit<SessionRoute, 'id' | 'createdAt'>) => void;
  addExpense: (expense: Omit<SessionExpense, 'id' | 'createdAt'>) => void;
  addAppointment: (appointment: Omit<SessionAppointment, 'id' | 'createdAt' | 'status'>) => void;
  addVehicle: (vehicle: Omit<SessionVehicle, 'id' | 'source'>) => void;
  updateVehicleKm: (vehicleName: string, nextKm: number) => number;
  getVehicleKm: (vehicleName: string) => number;
  startAppointment: (id: string) => void;
  completeAppointment: (id: string, result: string, nextStep: string) => void;
  clearJourneys: () => void;
  clearRoutes: () => void;
  clearExpenses: () => void;
  clearAppointments: () => void;
  clearSessionVehicles: () => void;
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
  const [sessionVehicles, setSessionVehicles] = useState<SessionVehicle[]>([]);
  const [vehicleKm, setVehicleKm] = useState<Record<string, number>>({});

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

  function addVehicle(vehicle: Omit<SessionVehicle, 'id' | 'source'>) {
    setSessionVehicles((current) => [{ ...vehicle, id: createId('vehicle', current.length), source: 'session' }, ...current]);
  }

  const rawVehicles = useMemo(() => [...sessionVehicles, ...baseVehicles], [sessionVehicles]);
  const vehicles = useMemo(
    () => rawVehicles.map((vehicle) => ({ ...vehicle, currentKm: Math.max(vehicle.currentKm, vehicleKm[vehicle.id] ?? vehicle.currentKm) })),
    [rawVehicles, vehicleKm]
  );
  const vehicleOptions = useMemo(() => vehicles.filter((vehicle) => vehicle.status !== 'Manutenção').map((vehicle) => vehicle.name), [vehicles]);

  function getVehicleKm(vehicleName: string) {
    return vehicles.find((vehicle) => vehicle.name === vehicleName)?.currentKm ?? 0;
  }

  function updateVehicleKm(vehicleName: string, nextKm: number) {
    const vehicle = vehicles.find((item) => item.name === vehicleName);
    if (!vehicle) return Math.max(0, nextKm);
    const safeKm = Math.max(vehicle.currentKm, nextKm);
    setVehicleKm((current) => ({ ...current, [vehicle.id]: safeKm }));
    return safeKm;
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
  function clearSessionVehicles() {
    const sessionIds = new Set(sessionVehicles.map((vehicle) => vehicle.id));
    setSessionVehicles([]);
    setVehicleKm((current) => Object.fromEntries(Object.entries(current).filter(([id]) => !sessionIds.has(id))));
  }
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
  const value = useMemo(() => ({ journeys, routes, expenses, appointments, vehicles, vehicleOptions, addJourney, addRoute, addExpense, addAppointment, addVehicle, updateVehicleKm, getVehicleKm, startAppointment, completeAppointment, clearJourneys, clearRoutes, clearExpenses, clearAppointments, clearSessionVehicles, clearAllActivity, totalKm, totalExpenses, completedAppointments, activityCount }), [journeys, routes, expenses, appointments, vehicles, vehicleOptions, totalKm, totalExpenses, completedAppointments, activityCount]);

  return <SessionActivityContext.Provider value={value}>{children}</SessionActivityContext.Provider>;
}

export function useSessionActivity() {
  const context = useContext(SessionActivityContext);
  if (!context) throw new Error('useSessionActivity must be used inside SessionActivityProvider');
  return context;
}
