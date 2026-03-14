import { RouteSection } from "../components/routes/RouteSection";

export function MailTemplatesPage() {
  return (
    <RouteSection
      eyebrow="Admin area"
      title="Mail templates route keeps communication flows separate."
      description="Verify email, forgot password and system mail templates will be managed on this screen."
      actions={["Template list", "Preview", "Version notes"]}
    />
  );
}
