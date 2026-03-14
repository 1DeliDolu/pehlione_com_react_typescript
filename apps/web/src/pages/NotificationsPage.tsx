import { RouteSection } from "../components/routes/RouteSection";

export function NotificationsPage() {
  return (
    <RouteSection
      eyebrow="User area"
      title="Notifications route hesap geri bildirimlerini toplar."
      description="Mail olaylari, system uyarilari ve membership degisim mesajlari icin ayri alan."
      actions={["Security alerts", "Plan updates", "Email history"]}
    />
  );
}
