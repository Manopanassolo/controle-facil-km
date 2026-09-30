export type MockConnection = {
  id: string;
  userId: string;
  calendarId: string | null;
  nextSyncToken: string | null;
  syncStatus: string;
  revokedAt: string | null;
};

export class SupabaseMock {
  private connections = new Map<string, MockConnection>();
  private events = new Map<string, Record<string, unknown>>();

  saveConnection(connection: MockConnection) {
    this.connections.set(connection.id, { ...connection });
  }

  getConnection(id: string) {
    return this.connections.get(id) ?? null;
  }

  saveEvent(connectionId: string, googleEventId: string, event: Record<string, unknown>) {
    this.events.set(
      `${connectionId}:${googleEventId}`,
      { ...event, connectionId, googleEventId },
    );
  }

  countEvent(connectionId: string, googleEventId: string) {
    return this.events.has(`${connectionId}:${googleEventId}`) ? 1 : 0;
  }

  revokeConnection(id: string) {
    const connection = this.connections.get(id);
    if (!connection) return;

    this.connections.set(id, {
      ...connection,
      revokedAt: new Date().toISOString(),
      syncStatus: "revoked",
    });
  }
}
