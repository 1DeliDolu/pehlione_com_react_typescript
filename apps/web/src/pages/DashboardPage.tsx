import { InfoGrid } from "../components/routes/InfoGrid";
import { RouteSection } from "../components/routes/RouteSection";

export function DashboardPage() {
  return (
    <RouteSection
      eyebrow="User area"
      title="Dashboard route carries the main user experience."
      description="Entry point for the authenticated area; query data, membership summary and quick actions are gathered here."
      actions={[
        "Recent activity",
        "Membership summary",
        "Feature entitlements",
      ]}
    >
      <InfoGrid
        cards={[
          {
            title: "Guard",
            text: "This route will be wrapped with RequireAuth.",
            items: ["Session me", "Active user check", "Tier aware widgets"],
          },
          {
            title: "Data",
            text: "User, session and entitlement data will be fetched via TanStack Query.",
          },
          {
            title: "UX",
            text: "Dashboard cards can expand in a responsive and role-aware manner.",
          },
        ]}
      />
    </RouteSection>
  );
}
