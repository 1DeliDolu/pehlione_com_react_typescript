import type { Role } from "@pehlione/shared";
import { Navigate, Outlet } from "react-router";

import { useAuth } from "../auth/AuthContext";
import { GuardNotice } from "../components/auth/GuardNotice";

export function RequireRole({ role }: { role: Role }) {
  const { user, isLoading, errorMessage } = useAuth();

  if (isLoading) {
    return (
      <GuardNotice
        actionLabel="Role check"
        title="Checking role."
        description="Admin routes are not resolved until session data is received."
      />
    );
  }

  if (errorMessage) {
    return (
      <GuardNotice
        actionLabel="Role check failed"
        title="Could not retrieve role information."
        description="Role guard could not make a decision due to an API error."
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
