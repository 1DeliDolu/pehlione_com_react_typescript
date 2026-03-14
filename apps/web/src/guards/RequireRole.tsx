import type { Role } from "@pehlione/shared";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { GuardNotice } from "../components/auth/GuardNotice";

export function RequireRole({ role }: { role: Role }) {
  const { user, isLoading, errorMessage } = useAuth();

  if (isLoading) {
    return (
      <GuardNotice
        actionLabel="Role check"
        title="Rol kontrolu yapiliyor."
        description="Session verisi gelmeden admin route'lari resolve edilmiyor."
      />
    );
  }

  if (errorMessage) {
    return (
      <GuardNotice
        actionLabel="Role check failed"
        title="Rol bilgisi alinamadi."
        description="API hatasi nedeniyle role guard karar veremedi."
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
