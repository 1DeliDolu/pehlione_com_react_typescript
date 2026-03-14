import { RouteSection } from "../components/routes/RouteSection";

export function SecurityPage() {
  return (
    <RouteSection
      eyebrow="User area"
      title="Security route sifre ve hesap guvenligi icin ayrildi."
      description="Password change, suspicious login feedback ve session security bloklari bu sayfaya yerlestirilecek."
      actions={["Change password", "Security notices", "Verification status"]}
    />
  );
}
