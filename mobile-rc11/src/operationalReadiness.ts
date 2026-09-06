import { BootstrapData, VehicleRow } from './api';

export type ReadinessItem = {
  key: string;
  label: string;
  ok: boolean;
  critical: boolean;
  detail?: string;
};

export type OperationalReadiness = {
  ready: boolean;
  score: number;
  completed: number;
  total: number;
  vehicle?: VehicleRow;
  items: ReadinessItem[];
};

const n = (v: unknown) => Number(v || 0) || 0;

export function evaluateOperationalReadiness(data: BootstrapData | null): OperationalReadiness {
  const activeAssignments = (data?.assignments || []).filter(a => a.active && (!a.ends_at || new Date(a.ends_at).getTime() > Date.now()));
  const assignedIds = new Set(activeAssignments.map(a => a.vehicle_id));
  const assignedVehicles = (data?.vehicles || []).filter(v => v.active && assignedIds.has(v.id));
  const vehicle = assignedVehicles.length === 1 ? assignedVehicles[0] : undefined;

  const items: ReadinessItem[] = [
    { key: 'company', label: 'Empresa vinculada', ok: Boolean(data?.companyId), critical: true },
    { key: 'profile', label: 'Perfil e função identificados', ok: Boolean(data?.directory?.full_name && (data?.directory?.job_title || data?.directory?.role_name)), critical: true },
    { key: 'branch', label: 'Loja/unidade definida', ok: Boolean(data?.branchId || data?.directory?.branch_name), critical: true },
    { key: 'vehicle', label: 'Veículo de trabalho atribuído', ok: assignedVehicles.length === 1, critical: true, detail: assignedVehicles.length > 1 ? 'Há mais de um veículo ativo; selecione o veículo antes do deslocamento.' : undefined },
    { key: 'odometer', label: 'KM atual do veículo', ok: Boolean(vehicle && n(vehicle.current_odometer_km) >= 0 && vehicle.current_odometer_km !== null && vehicle.current_odometer_km !== undefined), critical: true },
    { key: 'fuelType', label: 'Tipo de combustível', ok: Boolean(vehicle?.fuel_type), critical: true },
    { key: 'consumption', label: 'Média de referência (km/l)', ok: n(vehicle?.avg_km_per_liter) > 0, critical: true },
    { key: 'fuelPrice', label: 'Preço de referência por litro', ok: n(vehicle?.reference_fuel_price) > 0, critical: true },
    { key: 'tank', label: 'Capacidade do tanque', ok: n(vehicle?.tank_capacity_liters) > 0, critical: true },
  ];

  const completed = items.filter(x => x.ok).length;
  const total = items.length;
  const ready = items.filter(x => x.critical).every(x => x.ok);
  return { ready, score: total ? Math.round((completed / total) * 100) : 0, completed, total, vehicle, items };
}

export function readinessMessage(r: OperationalReadiness) {
  if (r.ready) return 'Cadastro operacional completo. Os cálculos de KM, combustível e deslocamento têm base identificada.';
  const missing = r.items.filter(x => x.critical && !x.ok).map(x => x.label);
  return `Complete antes do primeiro deslocamento: ${missing.join(', ')}.`;
}
