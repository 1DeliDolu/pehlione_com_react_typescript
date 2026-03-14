import { FEATURES } from "../auth/AuthContext";
import { InfoGrid } from "../components/routes/InfoGrid";
import { RouteSection } from "../components/routes/RouteSection";

export function AnalyticsPage() {
  return (
    <RouteSection
      eyebrow="Advanced feature"
      title="Analytics route tier ve feature guard altinda."
      description={`Bu sayfa ancak ${FEATURES.ANALYTICS_ADVANCED} entitlement'i olan kullanicilar tarafindan gorulebilir.`}
      actions={["Trend cards", "Advanced charts", "CSV export handoff"]}
    >
      <InfoGrid
        cards={[
          {
            title: "Tier gate",
            text: "Silver ve Gold uyeler bu ekrana gecebilir.",
          },
          {
            title: "Feature gate",
            text: "Entitlement dogrulamasi frontend'de UX, backend'de ise guvenlik icin tekrar enforce edilir.",
          },
          {
            title: "Next integration",
            text: "TanStack Query ile analytics endpoint'leri bu route'ta consume edilebilir.",
          },
        ]}
      />
    </RouteSection>
  );
}
