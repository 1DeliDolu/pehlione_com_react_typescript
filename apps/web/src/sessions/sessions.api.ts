import type { ApiResponse } from "@pehlione/shared";

import { apiClient } from "../lib/api";
import { fetchCsrfToken } from "../auth/auth.api";

type SessionItem = {
  sessionId: string;
  isCurrent: boolean;
  createdAt: string | null;
};

export async function fetchSessions() {
  const response = await apiClient.get<ApiResponse<SessionItem[]>>("/sessions");
  return response.data.data ?? [];
}

export async function revokeSession(sessionId: string) {
  const csrfToken = await fetchCsrfToken();
  const response = await apiClient.delete<ApiResponse>(`/sessions/${sessionId}`, {
    headers: { "x-csrf-token": csrfToken },
  });

  return response.data;
}

export async function revokeAllSessions() {
  const csrfToken = await fetchCsrfToken();
  const response = await apiClient.delete<ApiResponse>("/sessions/all", {
    headers: { "x-csrf-token": csrfToken },
  });

  return response.data;
}
