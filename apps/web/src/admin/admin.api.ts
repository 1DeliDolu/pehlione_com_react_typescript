import type {
  ApiResponse,
  AuditLogDto,
  MembershipTier,
  Role,
  UserDto,
} from "@pehlione/shared";

import { fetchCsrfToken } from "../auth/auth.api";
import { apiClient } from "../lib/api";

type MetaResponse<T> = ApiResponse<T> & {
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
};

export type AdminUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  membershipTier?: MembershipTier;
  isActive?: boolean;
};

export async function fetchAdminUsers(params?: AdminUsersParams) {
  const response = await apiClient.get<MetaResponse<UserDto[]>>(
    "/admin/users",
    {
      params,
    },
  );
  return {
    data: response.data.data ?? [],
    meta: response.data.meta,
  };
}

export async function fetchAdminUser(userId: string) {
  const response = await apiClient.get<ApiResponse<UserDto>>(
    `/admin/users/${userId}`,
  );
  return response.data.data ?? null;
}

export async function fetchAuditLogs() {
  const response =
    await apiClient.get<MetaResponse<AuditLogDto[]>>("/admin/audit-logs");
  return {
    data: response.data.data ?? [],
    meta: response.data.meta,
  };
}

export async function updateAdminUserRole(userId: string, role: Role) {
  const csrfToken = await fetchCsrfToken();
  const response = await apiClient.patch<ApiResponse>(
    `/admin/users/${userId}/role`,
    { role },
    { headers: { "x-csrf-token": csrfToken } },
  );

  return response.data;
}

export async function updateAdminUserTier(
  userId: string,
  membershipTier: MembershipTier,
) {
  const csrfToken = await fetchCsrfToken();
  const response = await apiClient.patch<ApiResponse>(
    `/admin/users/${userId}/membership`,
    { membershipTier },
    { headers: { "x-csrf-token": csrfToken } },
  );

  return response.data;
}

export async function disableAdminUser(userId: string) {
  const csrfToken = await fetchCsrfToken();
  const response = await apiClient.post<ApiResponse>(
    `/admin/users/${userId}/disable`,
    {},
    { headers: { "x-csrf-token": csrfToken } },
  );

  return response.data;
}

export async function enableAdminUser(userId: string) {
  const csrfToken = await fetchCsrfToken();
  const response = await apiClient.post<ApiResponse>(
    `/admin/users/${userId}/enable`,
    {},
    { headers: { "x-csrf-token": csrfToken } },
  );

  return response.data;
}
