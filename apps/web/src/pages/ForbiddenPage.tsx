import { RouteSection } from "../components/routes/RouteSection";

export function ForbiddenPage() {
  return (
    <RouteSection
      eyebrow="Access denied"
      title="Bu alan rol yetkisi gerektiriyor."
      description="Frontend route guard seni burada durdurdu. Gercek uygulamada backend ayni kontrolu tekrar enforce etmeli."
      actions={["Role mismatch", "Admin permission required"]}
    />
  );
}
