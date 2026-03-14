import { RouteSection } from "../components/routes/RouteSection";

export function FeatureUnavailablePage() {
  return (
    <RouteSection
      eyebrow="Feature unavailable"
      title="Entitlement required even if tier is eligible."
      description="This case shows that the feature flag is checked separately even when role and session are valid."
      actions={["Entitlement missing", "Review plan", "Contact support"]}
    />
  );
}
