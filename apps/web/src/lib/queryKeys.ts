export const queryKeys = {
  authMe: ["auth", "me"] as const,
  csrfToken: ["auth", "csrf-token"] as const,
  userProfile: ["users", "me"] as const,
  userSessions: ["sessions", "me"] as const,
};
