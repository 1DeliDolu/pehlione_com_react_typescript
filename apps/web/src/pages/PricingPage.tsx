import { InfoGrid } from "../components/routes/InfoGrid";
import { RouteSection } from "../components/routes/RouteSection";

const cards = [
  {
    title: "Bronze",
    text: "Basic access and entry-level product features.",
    items: ["Basic analytics", "Core dashboard", "Single-user access"],
  },
  {
    title: "Silver",
    text: "More capabilities and higher limits for growing users.",
    items: ["Advanced reports", "Export CSV", "Higher usage limits"],
  },
  {
    title: "Gold",
    text: "For operational teams and premium support requirements.",
    items: ["Priority support", "Team invites", "Expanded entitlements"],
  },
];

export function PricingPage() {
  return (
    <RouteSection
      eyebrow="Plans"
      title="Membership tier screens are now under separate routes."
      description="Plan descriptions, entitlements and limits can be presented here while maintaining the role-tier separation."
    >
      <InfoGrid cards={cards} />
    </RouteSection>
  );
}
