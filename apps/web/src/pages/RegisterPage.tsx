import { RouteSection } from "../components/routes/RouteSection";

export function RegisterPage() {
  return (
    <RouteSection
      eyebrow="Auth"
      title="Register sayfasi bagimsiz route olarak hazir."
      description="Uyelik olusturma formu, validation ve verify-email baslangici icin temiz bir giris noktasi sunar."
      actions={["Name fields", "Email", "Password strength", "Terms acceptance"]}
    />
  );
}
