export function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return toYmd(dt);
}

export function todayYmd(): string {
  return toYmd(new Date());
}

function ymdToEpochDay(ymd: string): number {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return 0;
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

/** `toYmd` から `fromYmd` までの暦日差（正なら to が未来） */
export function diffCalendarDaysYmd(fromYmd: string, toYmd: string): number {
  return ymdToEpochDay(toYmd) - ymdToEpochDay(fromYmd);
}
