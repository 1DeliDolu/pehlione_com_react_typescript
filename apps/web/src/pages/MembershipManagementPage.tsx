import { RouteSection } from "../components/routes/RouteSection";

export function MembershipManagementPage() {
  return (
    <RouteSection
      eyebrow="Admin area"
      title="Membership management route plan operasyonlarini toplar."
      description="Tier degisimi, entitlement denetimi ve plan gecmisi yonetimi bu alan uzerinden ilerler."
      actions={["Tier update", "Entitlement review", "Plan history"]}
    />
  );
}
