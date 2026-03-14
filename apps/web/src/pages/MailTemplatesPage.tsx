import { RouteSection } from "../components/routes/RouteSection";

export function MailTemplatesPage() {
  return (
    <RouteSection
      eyebrow="Admin area"
      title="Mail templates route ile iletisim akislari ayri tutulur."
      description="Verify email, forgot password ve system mail sablonlari bu ekranda yonetilecek."
      actions={["Template list", "Preview", "Version notes"]}
    />
  );
}
