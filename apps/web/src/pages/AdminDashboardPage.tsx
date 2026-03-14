import { InfoGrid } from "../components/routes/InfoGrid";
import { RouteSection } from "../components/routes/RouteSection";

export function AdminDashboardPage() {
  return (
    <RouteSection
      eyebrow="Admin area"
      title="Admin dashboard route yonetim merkezini ayirir."
      description="Role bazli kontrol ile audit, users ve system settings modullerine giris bu sayfadan saglanir."
      actions={["System health", "Recent audits", "Pending actions"]}
    >
      <InfoGrid
        cards={[
          {
            title: "Access",
            text: "Bu alan RequireRole('ADMIN') ve permission kontrolu ile korunacak.",
          },
          {
            title: "Operations",
            text: "Kritik yonetim aksiyonlari backend audit kaydina baglanmali.",
          },
          {
            title: "Overview",
            text: "Users, mail ve membership yonetimi icin hizli giris kartlari burada yer alir.",
          },
        ]}
      />
    </RouteSection>
  );
}
