import { RouteSection } from "../components/routes/RouteSection";

export function UserDetailPage() {
  return (
    <RouteSection
      eyebrow="Admin area"
      title="User detail route tekil yonetim islemlerini ayirir."
      description="Kullanici profili, sessionlar, audit parcasi ve tier degisiklikleri burada birlesir."
      actions={["Profile data", "Session history", "Tier update", "Disable account"]}
    />
  );
}
