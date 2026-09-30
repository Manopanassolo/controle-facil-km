/**
 * Synchronization fixtures.
 * Synthetic values only; never place production tokens here.
 */

export const syncTokens = {
  initial: null,
  valid: "fixture-next-sync-token-valid",
  replacement: "fixture-next-sync-token-replacement",
  invalid: "fixture-next-sync-token-invalid",
};

export const eventChanges = {
  created: {
    id: "evt-created-001",
    status: "confirmed",
    summary: "Novo evento",
  },
  updated: {
    id: "evt-created-001",
    status: "confirmed",
    summary: "Evento atualizado",
  },
  cancelled: {
    id: "evt-created-001",
    status: "cancelled",
  },
};

export const http410 = {
  status: 410,
  message: "Sync token is no longer valid",
};
