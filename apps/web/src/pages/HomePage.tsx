import { InfoGrid } from "../components/routes/InfoGrid";
import { RouteSection } from "../components/routes/RouteSection";

const cards = [
  {
    title: "Public area",
    text: "Landing, auth ve pricing akisini tek bir public deneyim altinda toplar.",
    items: ["Home", "Login", "Register", "Pricing / Plans"],
  },
  {
    title: "User area",
    text: "Oturumlu kullanicilar icin hesap, guvenlik ve plan ekranlari hazir.",
    items: ["Dashboard", "Profile", "Sessions", "Membership / Plan"],
  },
  {
    title: "Admin area",
    text: "Role-based yonetim katmani audit ve operasyon panellerine ayrildi.",
    items: ["Users", "Audit Logs", "Mail Templates", "Settings"],
  },
];

export function HomePage() {
  return (
    <RouteSection
      eyebrow="Public home"
      title="Membership platform icin modern route tabanli giris."
      description="Bu sayfa artik sadece landing gorevi goruyor. Diger tum alanlar router ile ayrildi ve ortak shell uzerinden render ediliyor."
      actions={["Explore pricing", "Open dashboard", "Review admin flow"]}
    >
      <InfoGrid cards={cards} />
    </RouteSection>
  );
}
