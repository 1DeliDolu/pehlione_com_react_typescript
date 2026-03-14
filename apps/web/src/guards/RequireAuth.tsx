import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "../auth/AuthContext";
import { GuardNotice } from "../components/auth/GuardNotice";

export function RequireAuth() {
  const { user, isLoading, errorMessage } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <GuardNotice
        actionLabel="Session loading"
        title="Verifying session status."
        description="Reading /auth/me and CSRF data before opening the protected route."
      />
    );
  }

  if (errorMessage) {
    return (
      <GuardNotice
        actionLabel="Auth unavailable"
        title="Could not reach the session service."
        description="Check the API server and VITE_API_BASE_URL setting. The guard does not allow the user through in this state."
      />
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (!user.isActive) {
    return (
      <GuardNotice
        actionLabel="Inactive account"
        title="This account is inactive."
        description="Access to protected routes is not granted while the user is inactive."
      />
    );
  }

  return <Outlet />;
}
