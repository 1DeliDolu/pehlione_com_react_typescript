import { FEATURES } from "../auth/AuthContext";
import { InfoGrid } from "../components/routes/InfoGrid";
import { RouteSection } from "../components/routes/RouteSection";

export function AnalyticsPage() {
  return (
    <RouteSection
      eyebrow="Advanced feature"
      title="Analytics route is under tier and feature guard."
      description={`This page is only visible to users with the ${FEATURES.ANALYTICS_ADVANCED} entitlement.`}
      actions={["Trend cards", "Advanced charts", "CSV export handoff"]}
    >
      <InfoGrid
        cards={[
          {
            title: "Tier gate",
            text: "Silver and Gold members can access this screen.",
          },
          {
            title: "Feature gate",
            text: "Entitlement verification is enforced on frontend for UX and on backend for security.",
          },
          {
            title: "Next integration",
            text: "Analytics endpoints can be consumed on this route via TanStack Query.",
          },
        ]}
      />
    </RouteSection>
  );
}
