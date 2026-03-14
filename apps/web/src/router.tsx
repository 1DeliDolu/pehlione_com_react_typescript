import { FEATURES, MembershipTier, Role } from "@pehlione/shared";
import { createBrowserRouter } from "react-router-dom";

import { App } from "./App";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AuditLogsPage } from "./pages/AuditLogsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FeatureUnavailablePage } from "./pages/FeatureUnavailablePage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MailTemplatesPage } from "./pages/MailTemplatesPage";
import { MembershipManagementPage } from "./pages/MembershipManagementPage";
import { MembershipPage } from "./pages/MembershipPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PricingPage } from "./pages/PricingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SecurityPage } from "./pages/SecurityPage";
import { SessionsPage } from "./pages/SessionsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { UpgradeRequiredPage } from "./pages/UpgradeRequiredPage";
import { UserDetailPage } from "./pages/UserDetailPage";
import { UsersPage } from "./pages/UsersPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { RequireAuth } from "./guards/RequireAuth";
import { RequireFeature } from "./guards/RequireFeature";
import { RequireRole } from "./guards/RequireRole";
import { RequireTier } from "./guards/RequireTier";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
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
      {
        element: <RequireAuth />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "security", element: <SecurityPage /> },
          { path: "sessions", element: <SessionsPage /> },
          { path: "membership", element: <MembershipPage /> },
          { path: "notifications", element: <NotificationsPage /> },
          {
            element: (
              <RequireTier tiers={[MembershipTier.SILVER, MembershipTier.GOLD]} />
            ),
            children: [
              {
                element: <RequireFeature feature={FEATURES.ANALYTICS_ADVANCED} />,
                children: [{ path: "analytics", element: <AnalyticsPage /> }],
              },
            ],
          },
        ],
      },
      {
        element: <RequireRole role={Role.ADMIN} />,
        children: [
          { path: "admin", element: <AdminDashboardPage /> },
          { path: "admin/users", element: <UsersPage /> },
          { path: "admin/users/:userId", element: <UserDetailPage /> },
          {
            path: "admin/membership-management",
            element: <MembershipManagementPage />,
          },
          { path: "admin/audit-logs", element: <AuditLogsPage /> },
          { path: "admin/mail-templates", element: <MailTemplatesPage /> },
          { path: "admin/settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
