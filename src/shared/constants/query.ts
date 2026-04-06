export const STALE_TIME = {
  SHORT: 30 * 1000, // 30s — active sessions, real-time data
  MEDIUM: 2 * 60 * 1000, // 2min — task lists, notes list
  LONG: 10 * 60 * 1000, // 10min — subjects, folders, settings
  INFINITE: Infinity, // never stale — static lookups
} as const;
