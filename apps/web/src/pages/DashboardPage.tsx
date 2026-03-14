import { InfoGrid } from "../components/routes/InfoGrid";
import { RouteSection } from "../components/routes/RouteSection";

export function DashboardPage() {
  return (
    <RouteSection
      eyebrow="User area"
      title="Dashboard route kullanici ana deneyimini tasir."
      description="Authenticated alanin girisi; query verileri, membership summary ve quick actions burada toplanir."
      actions={["Recent activity", "Membership summary", "Feature entitlements"]}
    >
      <InfoGrid
        cards={[
          {
            title: "Guard",
            text: "Bu route daha sonra RequireAuth ile sarilacak.",
            items: ["Session me", "Active user check", "Tier aware widgets"],
          },
          {
            title: "Data",
            text: "TanStack Query ile kullanici, session ve entitlement verileri cekilecek.",
          },
          {
            title: "UX",
            text: "Dashboard kartlari responsive ve role-aware sekilde genisleyebilir.",
          },
        ]}
      />
    </RouteSection>
  );
}
