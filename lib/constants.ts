export const pageSize = 10;

export const CACHE = {
  STANDARD: 5 * 60 * 1000, // 5 min — most data
  FREQUENT: 60 * 1000, // 1 min — session, applications
  REALTIME: 30 * 1000, // 30s — notifications
} as const;
