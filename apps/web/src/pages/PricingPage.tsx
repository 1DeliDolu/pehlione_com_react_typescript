import { InfoGrid } from "../components/routes/InfoGrid";
import { RouteSection } from "../components/routes/RouteSection";

const cards = [
  {
    title: "Bronze",
    text: "Temel erisim ve baslangic seviyesinde urun ozellikleri.",
    items: ["Basic analytics", "Core dashboard", "Single-user access"],
  },
  {
    title: "Silver",
    text: "Buyuyen kullanicilar icin daha fazla capability ve limit.",
    items: ["Advanced reports", "Export CSV", "Higher usage limits"],
  },
  {
    title: "Gold",
    text: "Operasyonel takimlar ve premium destek gereksinimleri icin.",
    items: ["Priority support", "Team invites", "Expanded entitlements"],
  },
];

export function PricingPage() {
  return (
    <RouteSection
      eyebrow="Plans"
      title="Membership tier ekranlari artik ayri route altinda."
      description="Role ile tier ayrimini koruyacak bicimde plan anlatimi, haklar ve limitler burada sunulabilir."
    >
      <InfoGrid cards={cards} />
    </RouteSection>
  );
}
