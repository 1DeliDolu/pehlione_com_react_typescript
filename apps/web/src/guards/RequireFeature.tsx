import type { Feature } from "@pehlione/shared";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { GuardNotice } from "../components/auth/GuardNotice";

export function RequireFeature({ feature }: { feature: Feature }) {
  const { hasFeature, user, isLoading, errorMessage } = useAuth();

  if (isLoading) {
    return (
      <GuardNotice
        actionLabel="Feature check"
        title="Entitlement kontrolu yapiliyor."
        description="Ozellik bazli erisim karari session ve tier verisi geldikten sonra verilir."
      />
    );
  }

  if (errorMessage) {
    return (
      <GuardNotice
        actionLabel="Feature check failed"
        title="Entitlement bilgisi alinamadi."
        description="API hatasi nedeniyle feature guard karar veremedi."
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
