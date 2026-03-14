import type {
  ApiResponse,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "@pehlione/shared";

import { apiClient } from "../lib/api";
import { fetchCsrfToken } from "./auth.api";

async function withCsrf<T>(callback: (csrfToken: string) => Promise<T>) {
  const csrfToken = await fetchCsrfToken();
  return callback(csrfToken);
}

export async function loginMutation(input: LoginInput) {
  return withCsrf(async (csrfToken) => {
    const response = await apiClient.post<ApiResponse>("/auth/login", input, {
      headers: { "x-csrf-token": csrfToken },
    });

    return response.data;
  });
}

export async function registerMutation(input: RegisterInput) {
  return withCsrf(async (csrfToken) => {
    const response = await apiClient.post<ApiResponse>("/auth/register", input, {
      headers: { "x-csrf-token": csrfToken },
    });

    return response.data;
  });
}

export async function forgotPasswordMutation(input: ForgotPasswordInput) {
  return withCsrf(async (csrfToken) => {
    const response = await apiClient.post<ApiResponse>(
      "/auth/forgot-password",
      input,
      {
        headers: { "x-csrf-token": csrfToken },
      },
    );

    return response.data;
  });
}

export async function resetPasswordMutation(input: ResetPasswordInput) {
  return withCsrf(async (csrfToken) => {
    const response = await apiClient.post<ApiResponse>(
      "/auth/reset-password",
      input,
      {
        headers: { "x-csrf-token": csrfToken },
      },
    );

    return response.data;
  });
}

export async function logoutMutation() {
  const csrfToken = await fetchCsrfToken();
  const response = await apiClient.post<ApiResponse>(
    "/auth/logout",
    {},
    {
      headers: { "x-csrf-token": csrfToken },
    },
  );

  return response.data;
}
