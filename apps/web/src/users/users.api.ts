import type { ApiResponse, UserDto } from "@pehlione/shared";

import { apiClient } from "../lib/api";

export async function fetchUserProfile() {
  const response = await apiClient.get<ApiResponse<UserDto>>("/users/me");
  return response.data.data ?? null;
}
