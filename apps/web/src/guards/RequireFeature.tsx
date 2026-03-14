import type { Feature } from "@pehlione/shared";
import { Navigate, Outlet } from "react-router";

import { useAuth } from "../auth/AuthContext";
import { GuardNotice } from "../components/auth/GuardNotice";

export function RequireFeature({ feature }: { feature: Feature }) {
  const { hasFeature, user, isLoading, errorMessage } = useAuth();

  if (isLoading) {
    return (
      <GuardNotice
        actionLabel="Feature check"
        title="Checking entitlement."
        description="Feature-based access decision is made after session and tier data are received."
      />
    );
  }

  if (errorMessage) {
    return (
      <GuardNotice
        actionLabel="Feature check failed"
        title="Could not retrieve entitlement information."
        description="Feature guard could not make a decision due to an API error."
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasFeature(feature)) {
    return <Navigate to="/feature-unavailable" replace />;
  }

  return <Outlet />;
}
