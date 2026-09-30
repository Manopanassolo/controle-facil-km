export type CalendarApiMode =
  | "normal"
  | "http-410"
  | "paginated";

export class GoogleCalendarApiMock {
  private mode: CalendarApiMode = "normal";
  private calls: Array<{ endpoint: string; syncToken?: string | null }> = [];

  setMode(mode: CalendarApiMode) {
    this.mode = mode;
  }

  listCalendars() {
    this.calls.push({ endpoint: "calendarList" });

    return {
      items: [
        {
          id: "cal-test-primary",
          summary: "Controle Fácil KM - Teste",
          timeZone: "America/Sao_Paulo",
          accessRole: "owner",
          primary: true,
        },
      ],
    };
  }

  listEvents(syncToken?: string | null) {
    this.calls.push({
      endpoint: "events",
      syncToken: syncToken ?? null,
    });

    if (this.mode === "http-410") {
      return {
        status: 410,
        body: {
          error: {
            message: "Sync token is no longer valid",
          },
        },
      };
    }

    return {
      status: 200,
      body: {
        items: [],
        nextSyncToken: syncToken
          ? "fixture-next-sync-token-replacement"
          : "fixture-next-sync-token-valid",
      },
    };
  }

  getCalls() {
    return [...this.calls];
  }

  reset() {
    this.calls = [];
    this.mode = "normal";
  }
}
