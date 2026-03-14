import { RouteSection } from "../components/routes/RouteSection";

export function ResetPasswordPage() {
  return (
    <RouteSection
      eyebrow="Recovery"
      title="Reset password token dogrulama sayfasi."
      description="Tek kullanımlik token ve yeni parola formu bu route icinde ayrilacak."
      actions={["Token check", "New password", "Confirm password"]}
    />
  );
}
