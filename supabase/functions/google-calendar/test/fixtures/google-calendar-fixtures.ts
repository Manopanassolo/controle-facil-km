/**
 * Google Calendar test fixtures.
 * No real credentials or tokens belong in this file.
 */

export const calendars = {
  primary: {
    id: "cal-test-primary",
    summary: "Controle Fácil KM - Teste",
    timeZone: "America/Sao_Paulo",
    accessRole: "owner",
    primary: true,
  },
  secondary: {
    id: "cal-test-secondary",
    summary: "Controle Fácil KM - Secundário",
    timeZone: "America/Sao_Paulo",
    accessRole: "writer",
    primary: false,
  },
  readOnly: {
    id: "cal-test-readonly",
    summary: "Controle Fácil KM - Somente leitura",
    timeZone: "America/Sao_Paulo",
    accessRole: "reader",
    primary: false,
  },
};

export const events = {
  timed: {
    id: "evt-test-001",
    status: "confirmed",
    summary: "Viagem de teste",
    location: "Itajaí, SC",
    description: "Evento utilizado pela suíte automatizada.",
  },
  allDay: {
    id: "evt-test-002",
    status: "confirmed",
    summary: "Evento de dia inteiro",
  },
  cancelled: {
    id: "evt-test-003",
    status: "cancelled",
    summary: "Evento cancelado",
  },
};

export const syncResponses = {
  initial: {
    nextSyncToken: "fixture-sync-token-001",
  },
  incremental: {
    nextSyncToken: "fixture-sync-token-002",
  },
  invalidToken: {
    status: 410,
    reason: "Sync token is no longer valid",
  },
};
