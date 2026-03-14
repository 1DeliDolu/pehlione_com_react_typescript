import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { GuardNotice } from "../components/auth/GuardNotice";

export function RequireAuth() {
  const { user, isLoading, errorMessage } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <GuardNotice
        actionLabel="Session loading"
        title="Session durumu dogrulaniyor."
        description="Protected route acilmadan once /auth/me ve CSRF verisi okunuyor."
      />
    );
  }

  if (errorMessage) {
    return (
      <GuardNotice
        actionLabel="Auth unavailable"
        title="Session servisine ulasilamadi."
        description="API ayagini ve VITE_API_BASE_URL ayarini kontrol et. Guard bu durumda kullaniciyi gecirmiyor."
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
        title="Bu hesap aktif degil."
        description="Kullanici aktif olmadan protected route'lara erisim verilmez."
      />
    );
  }

  return <Outlet />;
}
