export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString();
}

/** Returns "YYYY-MM-DD" for API params (zero-padded). */
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Validates and returns "HH:MM" (24h). Returns empty string on invalid input. */
export function formatTime(time: string | null | undefined): string {
  if (!time) return '';
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return '';
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

/** Returns "09:00 – 17:00", just start, or empty string. */
export function formatTimeRange(
  start?: string | null,
  end?: string | null,
): string {
  const s = formatTime(start);
  if (!s) return '';
  const e = formatTime(end);
  if (!e) return s;
  return `${s} – ${e}`;
}

/** Human-readable duration: "1h 30m", "45m 30s", or "30s". */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}

/** Timer display: "02:45:30" if hours > 0, else "45:30". Zero-padded. */
export function formatTimerTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  if (h > 0) return `${String(h).padStart(2, '0')}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

/** Returns the Monday of the given date's week. */
export function mondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Signed days until target date (positive=future, negative=past, 0=today). */
export function daysUntil(targetDateStr: string): number {
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** Human label: "Today", "3 days", "2 days ago". */
export function daysLabel(days: number): string {
  if (days === 0) return 'Today';
  if (days > 0) return days === 1 ? '1 day' : `${days} days`;
  const abs = Math.abs(days);
  return abs === 1 ? '1 day ago' : `${abs} days ago`;
}
