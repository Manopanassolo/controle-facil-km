import type { VisitRow } from './api';
import type { LocalState, LocalTripRecord } from './offline';

export type TimelineEventType = 'trip' | 'visit' | 'checkin' | 'checkout' | 'km' | 'route_deviation';

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  startedAt: number;
  endedAt?: number | null;
  title: string;
  subtitle?: string;
  distanceMeters?: number;
  durationMs?: number;
  synced?: boolean;
  sourceId?: string;
};

function durationText(ms: number) {
  const minutes = Math.max(0, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}

function distanceText(meters: number) {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
}

function tripToEvent(trip: LocalTripRecord): TimelineEvent {
  return {
    id: `trip-${trip.id}`,
    type: 'trip',
    startedAt: trip.startedAt || trip.finishedAt - trip.elapsedMs,
    endedAt: trip.finishedAt,
    title: trip.returnStart == null ? 'Deslocamento' : 'Deslocamento com retorno',
    subtitle: `${distanceText(trip.distanceMeters)} · ${durationText(trip.elapsedMs)}`,
    distanceMeters: trip.distanceMeters,
    durationMs: trip.elapsedMs,
    synced: trip.synced,
    sourceId: trip.id,
  };
}

export function buildLocalTimeline(local: LocalState): TimelineEvent[] {
  const tripEvents = local.trips.map(tripToEvent);
  const kmEvents: TimelineEvent[] = local.km.map(item => ({
    id: `km-${item.id}`,
    type: 'km',
    startedAt: new Date(item.createdAt).getTime(),
    title: 'Registro de KM',
    subtitle: `${item.vehicle} · ${item.total.toFixed(1)} km${item.reason ? ` · ${item.reason}` : ''}`,
    distanceMeters: item.total * 1000,
    synced: item.synced,
    sourceId: item.id,
  }));
  const deviationEvents: TimelineEvent[] = local.trips.flatMap(trip => (trip.deviations || []).filter(d => d.classification !== 'dismissed').map(d => ({
    id: `route-deviation-${trip.id}-${d.id}`,
    type: 'route_deviation' as const,
    startedAt: new Date(d.detectedAt).getTime(),
    title: d.classification === 'confirmed_visit' ? `Visita extra · ${d.customerName}` : `Parada extra · ${d.customerName}`,
    subtitle: `${Math.max(1, Math.round(d.dwellSeconds / 60))} min · ${Math.round(d.distanceMeters)} m do ponto · ${d.classification === 'confirmed_visit' ? 'visita confirmada' : d.classification === 'occurrence' ? 'ocorrência de rota' : 'aguardando classificação'}`,
    sourceId: trip.id,
    synced: trip.synced,
  })));
  return [...tripEvents, ...kmEvents, ...deviationEvents].sort((a, b) => b.startedAt - a.startedAt);
}

export function buildVisitTimeline(visits: VisitRow[], customerName: (customerId: string) => string): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  for (const visit of visits) {
    const scheduled = visit.scheduled_start ? new Date(visit.scheduled_start).getTime() : 0;
    if (scheduled) {
      events.push({
        id: `visit-${visit.id}`,
        type: 'visit',
        startedAt: scheduled,
        endedAt: visit.scheduled_end ? new Date(visit.scheduled_end).getTime() : null,
        title: customerName(visit.customer_id),
        subtitle: visit.purpose || 'Visita programada',
        sourceId: visit.id,
      });
    }
    if (visit.checkin_at) {
      const checkin = new Date(visit.checkin_at).getTime();
      events.push({
        id: `checkin-${visit.id}`,
        type: 'checkin',
        startedAt: checkin,
        title: `Check-in · ${customerName(visit.customer_id)}`,
        subtitle: visit.geofence_valid === true ? 'Localização validada' : visit.geofence_valid === false ? 'Fora da área configurada' : 'Validação de localização pendente',
        sourceId: visit.id,
      });
    }
    if (visit.checkout_at) {
      const checkout = new Date(visit.checkout_at).getTime();
      const checkin = visit.checkin_at ? new Date(visit.checkin_at).getTime() : null;
      events.push({
        id: `checkout-${visit.id}`,
        type: 'checkout',
        startedAt: checkout,
        title: `Check-out · ${customerName(visit.customer_id)}`,
        subtitle: checkin ? `Permanência ${durationText(checkout - checkin)}` : 'Visita encerrada',
        durationMs: checkin ? checkout - checkin : undefined,
        sourceId: visit.id,
      });
    }
  }
  return events.sort((a, b) => b.startedAt - a.startedAt);
}

export function mergeTimeline(local: LocalState, visits: VisitRow[], customerName: (customerId: string) => string) {
  return [...buildLocalTimeline(local), ...buildVisitTimeline(visits, customerName)].sort((a, b) => b.startedAt - a.startedAt);
}

export function summarizeTimeline(events: TimelineEvent[]) {
  let distanceMeters = 0;
  let tripDurationMs = 0;
  let visitDurationMs = 0;
  let visits = 0;
  for (const event of events) {
    if (event.type === 'trip') {
      distanceMeters += event.distanceMeters || 0;
      tripDurationMs += event.durationMs || 0;
    }
    if (event.type === 'checkin') visits += 1;
    if (event.type === 'checkout') visitDurationMs += event.durationMs || 0;
  }
  return { distanceMeters, tripDurationMs, visitDurationMs, visits };
}
