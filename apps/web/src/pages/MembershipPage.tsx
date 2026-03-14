import { RouteSection } from "../components/routes/RouteSection";

export function MembershipPage() {
  return (
    <RouteSection
      eyebrow="User area"
      title="Membership route aktif plan ve gecmisi ayirir."
      description="Tier bilgisi, entitlement listesi ve upgrade aksiyonlari burada yonetilir."
      actions={["Current plan", "Entitlements", "Upgrade path", "Billing notes"]}
    />
  );
}
