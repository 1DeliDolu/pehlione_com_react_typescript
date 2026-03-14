import type { MembershipTier } from "@pehlione/shared";
import { Navigate, Outlet } from "react-router";

import { useAuth } from "../auth/AuthContext";
import { GuardNotice } from "../components/auth/GuardNotice";

export function RequireTier({ tiers }: { tiers: MembershipTier[] }) {
  const { user, isLoading, errorMessage } = useAuth();

  if (isLoading) {
    return (
      <GuardNotice
        actionLabel="Tier check"
        title="Checking membership tier."
        description="Protected features are not resolved until the user plan data is received."
      />
    );
  }

  if (errorMessage) {
    return (
      <GuardNotice
        actionLabel="Tier check failed"
        title="Could not retrieve membership information."
        description="Tier guard could not make a decision due to an API error."
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!tiers.includes(user.membershipTier)) {
    return <Navigate to="/upgrade-required" replace />;
  }

  return <Outlet />;
}
