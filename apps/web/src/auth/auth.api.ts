import type { ApiResponse, UserDto } from "@pehlione/shared";
import { isAxiosError } from "axios";

import { apiClient } from "../lib/api";

export async function fetchSessionUser() {
  try {
    const response = await apiClient.get<ApiResponse<UserDto>>("/auth/me");
    return response.data.data ?? null;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function fetchCsrfToken() {
  const response = await apiClient.get<ApiResponse<{ csrfToken: string }>>(
    "/auth/csrf-token",
  );

  return response.data.data?.csrfToken ?? "";
}
