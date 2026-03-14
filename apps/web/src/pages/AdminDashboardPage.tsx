import { InfoGrid } from "../components/routes/InfoGrid";
import { RouteSection } from "../components/routes/RouteSection";

export function AdminDashboardPage() {
  return (
    <RouteSection
      eyebrow="Admin area"
      title="Admin dashboard serves as the central management hub."
      description="Access to audit, users and system settings modules is provided from this page via role-based control."
      actions={["System health", "Recent audits", "Pending actions"]}
    >
      <InfoGrid
        cards={[
          {
            title: "Access",
            text: "This area is protected by RequireRole('ADMIN') and permission checks.",
          },
          {
            title: "Operations",
            text: "Critical management actions should be linked to backend audit logs.",
          },
          {
            title: "Overview",
            text: "Quick access cards for users, mail and membership management are placed here.",
          },
        ]}
      />
    </RouteSection>
  );
}
