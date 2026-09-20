export const TICKET_COOLDOWN_MS = 60_000;

export function ticketChannelName(userId: string): string {
  return `ticket-${userId}`;
}

export class TicketCooldown {
  private readonly lastUsed = new Map<string, number>();

  constructor(private readonly cooldownMs: number = TICKET_COOLDOWN_MS) {}

  // 残りクールダウン秒数。0なら実行可能。
  remaining(userId: string, now: number): number {
    const last = this.lastUsed.get(userId);
    if (last === undefined) return 0;
    const elapsed = now - last;
    if (elapsed >= this.cooldownMs) return 0;
    return Math.ceil((this.cooldownMs - elapsed) / 1000);
  }

  record(userId: string, now: number): void {
    this.lastUsed.set(userId, now);
  }
}
