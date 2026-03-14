import { RouteSection } from "../components/routes/RouteSection";

export function AuditLogsPage() {
  return (
    <RouteSection
      eyebrow="Admin area"
      title="Audit logs route guvenlik olaylarini sergiler."
      description="Kritik operasyonlar, auth olaylari ve yonetim degisiklikleri filtrelenebilir tabloda sunulacak."
      actions={["Filter events", "Trace actor", "Inspect metadata"]}
    />
  );
}
