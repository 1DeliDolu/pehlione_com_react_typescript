import { RouteSection } from "../components/routes/RouteSection";

export function FeatureUnavailablePage() {
  return (
    <RouteSection
      eyebrow="Feature unavailable"
      title="Tier uygun olsa bile entitlement gerekli."
      description="Bu durum, rol ve session dogru oldugunda bile ozellik bayraginin ayri kontrol edildigini gosterir."
      actions={["Entitlement missing", "Review plan", "Contact support"]}
    />
  );
}
