import { RouteSection } from "../components/routes/RouteSection";

export function UpgradeRequiredPage() {
  return (
    <RouteSection
      eyebrow="Upgrade required"
      title="Bu rota daha yuksek membership tier istiyor."
      description="Bronze tier bu ekrani acamaz. Silver veya Gold seviyesine cikmak gerekiyor."
      actions={["Tier mismatch", "Open pricing", "Upgrade flow"]}
    />
  );
}
