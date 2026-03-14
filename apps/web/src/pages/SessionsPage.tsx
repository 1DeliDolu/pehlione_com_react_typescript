import { RouteSection } from "../components/routes/RouteSection";

export function SessionsPage() {
  return (
    <RouteSection
      eyebrow="User area"
      title="Sessions route aktif cihazlari gosterir."
      description="Kullanici kendi session kayitlarini gorup gerekirse revoke edebilecek."
      actions={["Current session", "Other devices", "Revoke action"]}
    />
  );
}
