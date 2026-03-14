import type { MembershipTier } from "@pehlione/shared";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { GuardNotice } from "../components/auth/GuardNotice";

export function RequireTier({ tiers }: { tiers: MembershipTier[] }) {
  const { user, isLoading, errorMessage } = useAuth();

  if (isLoading) {
    return (
      <GuardNotice
        actionLabel="Tier check"
        title="Membership tier kontrolu yapiliyor."
        description="Kullanici plan bilgisi gelmeden protected feature resolve edilmiyor."
      />
    );
  }

  if (errorMessage) {
    return (
      <GuardNotice
        actionLabel="Tier check failed"
        title="Membership bilgisi alinamadi."
        description="API hatasi nedeniyle tier guard karar veremedi."
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
