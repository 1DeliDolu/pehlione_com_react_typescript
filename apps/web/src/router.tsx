import { lazy, Suspense } from "react";
import { FEATURES, MembershipTier, Role } from "@pehlione/shared";
import { Routes, Route } from "react-router";

import { App } from "./App";
import { RequireAuth } from "./guards/RequireAuth";
import { RequireFeature } from "./guards/RequireFeature";
import { RequireRole } from "./guards/RequireRole";
import { RequireTier } from "./guards/RequireTier";

// ── Public pages (eager — needed for first paint) ────────────────────────────
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { PricingPage } from "./pages/PricingPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { UpgradeRequiredPage } from "./pages/UpgradeRequiredPage";
import { FeatureUnavailablePage } from "./pages/FeatureUnavailablePage";

// ── User pages (lazy-loaded) ─────────────────────────────────────────────────
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const SecurityPage = lazy(() =>
  import("./pages/SecurityPage").then((m) => ({ default: m.SecurityPage })),
);
const SessionsPage = lazy(() =>
  import("./pages/SessionsPage").then((m) => ({ default: m.SessionsPage })),
);
const MembershipPage = lazy(() =>
  import("./pages/MembershipPage").then((m) => ({ default: m.MembershipPage })),
);
const NotificationsPage = lazy(() =>
  import("./pages/NotificationsPage").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const AnalyticsPage = lazy(() =>
  import("./pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })),
);

// ── Admin pages (lazy-loaded) ────────────────────────────────────────────────
const AdminDashboardPage = lazy(() =>
  import("./pages/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
const UsersPage = lazy(() =>
  import("./pages/UsersPage").then((m) => ({ default: m.UsersPage })),
);
const UserDetailPage = lazy(() =>
  import("./pages/UserDetailPage").then((m) => ({ default: m.UserDetailPage })),
);
const MembershipManagementPage = lazy(() =>
  import("./pages/MembershipManagementPage").then((m) => ({
    default: m.MembershipManagementPage,
  })),
);
const AuditLogsPage = lazy(() =>
  import("./pages/AuditLogsPage").then((m) => ({ default: m.AuditLogsPage })),
);
const MailTemplatesPage = lazy(() =>
  import("./pages/MailTemplatesPage").then((m) => ({
    default: m.MailTemplatesPage,
  })),
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);

// ── Shared suspense fallback ─────────────────────────────────────────────────
function RouteFallback() {
  return <p style={{ padding: "2rem", textAlign: "center" }}>Loading…</p>;
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        {/* ── Public ─────────────────────────────────── */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route path="upgrade-required" element={<UpgradeRequiredPage />} />
        <Route
          path="feature-unavailable"
          element={<FeatureUnavailablePage />}
        />

        {/* ── Authenticated ──────────────────────────── */}
        <Route element={<RequireAuth />}>
          <Route path="dashboard" element={withSuspense(<DashboardPage />)} />
          <Route path="profile" element={withSuspense(<ProfilePage />)} />
          <Route path="security" element={withSuspense(<SecurityPage />)} />
          <Route path="sessions" element={withSuspense(<SessionsPage />)} />
          <Route path="membership" element={withSuspense(<MembershipPage />)} />
          <Route
            path="notifications"
            element={withSuspense(<NotificationsPage />)}
          />
          <Route
            element={
              <RequireTier
                tiers={[MembershipTier.SILVER, MembershipTier.GOLD]}
              />
            }
          >
            <Route
              element={<RequireFeature feature={FEATURES.ANALYTICS_ADVANCED} />}
            >
              <Route
                path="analytics"
                element={withSuspense(<AnalyticsPage />)}
              />
            </Route>
          </Route>
        </Route>

        {/* ── Admin ──────────────────────────────────── */}
        <Route element={<RequireRole role={Role.ADMIN} />}>
          <Route path="admin" element={withSuspense(<AdminDashboardPage />)} />
          <Route path="admin/users" element={withSuspense(<UsersPage />)} />
          <Route
            path="admin/users/:userId"
            element={withSuspense(<UserDetailPage />)}
          />
          <Route
            path="admin/membership-management"
            element={withSuspense(<MembershipManagementPage />)}
          />
          <Route
            path="admin/audit-logs"
            element={withSuspense(<AuditLogsPage />)}
          />
          <Route
            path="admin/mail-templates"
            element={withSuspense(<MailTemplatesPage />)}
          />
          <Route
            path="admin/settings"
            element={withSuspense(<SettingsPage />)}
          />
        </Route>
      </Route>
    </Routes>
  );
}
