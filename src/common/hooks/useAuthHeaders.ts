// Auth is cookie-based — no explicit headers needed.
// Kept as a no-op in case callers reference it during migration.
export const useAuthHeaders = (): Record<string, string> => ({});
