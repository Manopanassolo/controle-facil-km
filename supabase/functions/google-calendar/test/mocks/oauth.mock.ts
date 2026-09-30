export class OAuthStateMock {
  private readonly states = new Map<string, {
    expiresAt: number;
    used: boolean;
  }>();

  put(hash: string, expiresAt: number) {
    this.states.set(hash, { expiresAt, used: false });
  }

  consume(hash: string, now: number): boolean {
    const state = this.states.get(hash);
    if (!state || state.used || now >= state.expiresAt) return false;

    state.used = true;
    return true;
  }
}
