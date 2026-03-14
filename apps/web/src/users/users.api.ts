import type {
  ApiResponse,
  ChangePasswordInput,
  UpdateProfileInput,
  UserDto,
} from "@pehlione/shared";

import { apiClient } from "../lib/api";
import { fetchCsrfToken } from "../auth/auth.api";

export async function fetchUserProfile() {
  const response = await apiClient.get<ApiResponse<UserDto>>("/users/me");
  return response.data.data ?? null;
}

export async function updateUserProfileMutation(input: UpdateProfileInput) {
  const csrfToken = await fetchCsrfToken();
  const response = await apiClient.patch<ApiResponse<UserDto>>("/users/me", input, {
    headers: { "x-csrf-token": csrfToken },
  });

  return response.data;
}

export async function changePasswordMutation(input: ChangePasswordInput) {
  const csrfToken = await fetchCsrfToken();
  const response = await apiClient.patch<ApiResponse>(
    "/users/me/password",
    input,
    {
      headers: { "x-csrf-token": csrfToken },
    },
  );

  return response.data;
}
