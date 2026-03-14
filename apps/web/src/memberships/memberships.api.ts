import type {
  ApiResponse,
  FeatureEntitlementDto,
  UserMembershipDto,
} from "@pehlione/shared";

import { apiClient } from "../lib/api";

export async function fetchMyMembership() {
  const res =
    await apiClient.get<ApiResponse<UserMembershipDto | null>>(
      "/memberships/me",
    );
  return res.data.data ?? null;
}

export async function fetchMyFeatures() {
  const res = await apiClient.get<ApiResponse<FeatureEntitlementDto[]>>(
    "/memberships/features/me",
  );
  return res.data.data ?? [];
}
