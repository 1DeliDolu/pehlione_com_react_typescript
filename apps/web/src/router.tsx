import { createBrowserRouter } from "react-router-dom";

import { App } from "./App";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AuditLogsPage } from "./pages/AuditLogsPage";
import { DashboardPage } from "./pages/DashboardPage";
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
import { UserDetailPage } from "./pages/UserDetailPage";
import { UsersPage } from "./pages/UsersPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";

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
      { path: "dashboard", element: <DashboardPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "security", element: <SecurityPage /> },
      { path: "sessions", element: <SessionsPage /> },
      { path: "membership", element: <MembershipPage /> },
      { path: "notifications", element: <NotificationsPage /> },
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
]);
