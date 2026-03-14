import { lazy, Suspense } from "react";
import { FEATURES, MembershipTier, Role } from "@pehlione/shared";
import { createBrowserRouter } from "react-router-dom";

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
  return <p style={{ padding: "2rem", textAlign: "center" }}>Yukleniyor…</p>;
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // ── Public ───────────────────────────────────────
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "verify-email", element: <VerifyEmailPage /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "forbidden", element: <ForbiddenPage /> },
      { path: "upgrade-required", element: <UpgradeRequiredPage /> },
      { path: "feature-unavailable", element: <FeatureUnavailablePage /> },

      // ── Authenticated ────────────────────────────────
      {
        element: <RequireAuth />,
        children: [
          { path: "dashboard", element: withSuspense(<DashboardPage />) },
          { path: "profile", element: withSuspense(<ProfilePage />) },
          { path: "security", element: withSuspense(<SecurityPage />) },
          { path: "sessions", element: withSuspense(<SessionsPage />) },
          { path: "membership", element: withSuspense(<MembershipPage />) },
          {
            path: "notifications",
            element: withSuspense(<NotificationsPage />),
          },
          {
            element: (
              <RequireTier
                tiers={[MembershipTier.SILVER, MembershipTier.GOLD]}
              />
            ),
            children: [
              {
                element: (
                  <RequireFeature feature={FEATURES.ANALYTICS_ADVANCED} />
                ),
                children: [
                  {
                    path: "analytics",
                    element: withSuspense(<AnalyticsPage />),
                  },
                ],
              },
            ],
          },
        ],
      },

      // ── Admin ────────────────────────────────────────
      {
        element: <RequireRole role={Role.ADMIN} />,
        children: [
          { path: "admin", element: withSuspense(<AdminDashboardPage />) },
          { path: "admin/users", element: withSuspense(<UsersPage />) },
          {
            path: "admin/users/:userId",
            element: withSuspense(<UserDetailPage />),
          },
          {
            path: "admin/membership-management",
            element: withSuspense(<MembershipManagementPage />),
          },
          {
            path: "admin/audit-logs",
            element: withSuspense(<AuditLogsPage />),
          },
          {
            path: "admin/mail-templates",
            element: withSuspense(<MailTemplatesPage />),
          },
          { path: "admin/settings", element: withSuspense(<SettingsPage />) },
        ],
      },
    ],
  },
]);
