import { RouteSection } from "../components/routes/RouteSection";

export function UpgradeRequiredPage() {
  return (
    <RouteSection
      eyebrow="Upgrade required"
      title="This route requires a higher membership tier."
      description="Bronze tier cannot access this screen. An upgrade to Silver or Gold level is required."
      actions={["Tier mismatch", "Open pricing", "Upgrade flow"]}
    />
  );
}
