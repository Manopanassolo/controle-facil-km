import type { CustomerRow } from './api';
import { distanceMeters, Point } from './location';

export type RouteDeviationEvent = {
  id: string;
  customerId: string;
  customerName: string;
  detectedAt: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  dwellSeconds: number;
  planned: boolean;
  classification?: 'detected' | 'confirmed_visit' | 'dismissed' | 'occurrence';
};

type Candidate = { customerId: string; enteredAt: number; lastSeenAt: number; minDistanceMeters: number; fired: boolean };

export class RouteDeviationDetector {
  private candidates = new Map<string, Candidate>();
  private emitted = new Set<string>();
  constructor(
    private customers: CustomerRow[],
    private plannedCustomerIds: Set<string>,
    private radiusMeters = 160,
    private dwellSeconds = 120,
  ) {}

  updateConfig(customers: CustomerRow[], plannedCustomerIds: string[], radiusMeters: number, dwellSeconds: number) {
    this.customers = customers;
    this.plannedCustomerIds = new Set(plannedCustomerIds);
    this.radiusMeters = Math.max(50, radiusMeters || 160);
    this.dwellSeconds = Math.max(30, dwellSeconds || 120);
  }

  push(point: Point, now = Date.now()): RouteDeviationEvent[] {
    const results: RouteDeviationEvent[] = [];
    const nearby = this.customers
      .filter(c => Number.isFinite(Number(c.latitude)) && Number.isFinite(Number(c.longitude)))
      .map(c => ({ c, d: distanceMeters(point, { latitude: Number(c.latitude), longitude: Number(c.longitude), timestamp: point.timestamp }) }))
      .filter(x => x.d <= this.radiusMeters)
      .sort((a,b) => a.d - b.d)
      .slice(0, 5);

    const seen = new Set<string>();
    for (const { c, d } of nearby) {
      seen.add(c.id);
      const existing = this.candidates.get(c.id);
      const candidate: Candidate = existing || { customerId: c.id, enteredAt: now, lastSeenAt: now, minDistanceMeters: d, fired: false };
      candidate.lastSeenAt = now;
      candidate.minDistanceMeters = Math.min(candidate.minDistanceMeters, d);
      this.candidates.set(c.id, candidate);
      const dwell = Math.floor((now - candidate.enteredAt) / 1000);
      if (!candidate.fired && dwell >= this.dwellSeconds && !this.emitted.has(c.id)) {
        candidate.fired = true;
        this.emitted.add(c.id);
        results.push({
          id: `${now}-${c.id}`,
          customerId: c.id,
          customerName: c.trade_name || c.legal_name || 'Cliente',
          detectedAt: new Date(now).toISOString(),
          latitude: point.latitude,
          longitude: point.longitude,
          distanceMeters: Math.round(candidate.minDistanceMeters),
          dwellSeconds: dwell,
          planned: this.plannedCustomerIds.has(c.id),
          classification: 'detected',
        });
      }
    }

    for (const [id, candidate] of this.candidates.entries()) {
      if (!seen.has(id) && now - candidate.lastSeenAt > 90000) this.candidates.delete(id);
    }
    return results.filter(x => !x.planned);
  }

  reset() { this.candidates.clear(); this.emitted.clear(); }
}
