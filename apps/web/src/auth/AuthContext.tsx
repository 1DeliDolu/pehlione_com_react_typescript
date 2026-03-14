import {
  FEATURES,
  type Feature,
  type Permission,
  ROLE_PERMISSIONS,
  TIER_ENTITLEMENTS,
  type UserDto,
} from "@pehlione/shared";
import { useQuery } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext } from "react";

import { fetchCsrfToken, fetchSessionUser } from "./auth.api";
import { queryKeys } from "../lib/queryKeys";

type AuthState = {
  user: UserDto | null;
  permissions: Permission[];
  entitlements: Partial<Record<Feature, string>>;
  csrfToken: string;
  isLoading: boolean;
  isReady: boolean;
  isAuthenticated: boolean;
  errorMessage: string | null;
  hasFeature: (feature: Feature) => boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const meQuery = useQuery({
    queryKey: queryKeys.authMe,
    queryFn: fetchSessionUser,
  });

  const csrfQuery = useQuery({
    queryKey: queryKeys.csrfToken,
    queryFn: fetchCsrfToken,
  });

  const user = meQuery.data ?? null;
  const permissions = user ? ROLE_PERMISSIONS[user.role] : [];
  const entitlements: Partial<Record<Feature, string>> = user
    ? TIER_ENTITLEMENTS[user.membershipTier]
    : {};
  const errorMessage =
    meQuery.error instanceof Error
      ? meQuery.error.message
      : csrfQuery.error instanceof Error
        ? csrfQuery.error.message
        : null;

  const value: AuthState = {
    user,
    permissions,
    entitlements,
    csrfToken: csrfQuery.data ?? "",
    isLoading: meQuery.isLoading || csrfQuery.isLoading,
    isReady: meQuery.isFetched && csrfQuery.isFetched,
    isAuthenticated: Boolean(user),
    errorMessage,
    hasFeature(feature) {
      return entitlements[feature] === "true";
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

export { FEATURES };
