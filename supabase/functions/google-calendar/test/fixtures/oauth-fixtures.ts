/**
 * OAuth fixtures for deterministic tests.
 * These are synthetic values only.
 */

export const oauthStates = {
  valid: {
    value: "test-state-valid",
    expiresAt: "2099-01-01T00:00:00.000Z",
    usedAt: null,
  },
  expired: {
    value: "test-state-expired",
    expiresAt: "2000-01-01T00:00:00.000Z",
    usedAt: null,
  },
  used: {
    value: "test-state-used",
    expiresAt: "2099-01-01T00:00:00.000Z",
    usedAt: "2026-09-30T00:00:00.000Z",
  },
  invalid: {
    value: "test-state-invalid",
  },
};
