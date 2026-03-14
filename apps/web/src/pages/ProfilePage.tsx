import { RouteSection } from "../components/routes/RouteSection";

export function ProfilePage() {
  return (
    <RouteSection
      eyebrow="User area"
      title="Profile route kullanici bilgilerini izole eder."
      description="Kisisel bilgi guncelleme, read-self ve update-self izinlerine gore burada yonetilecek."
      actions={["First name", "Last name", "Email state", "Account activity"]}
    />
  );
}
