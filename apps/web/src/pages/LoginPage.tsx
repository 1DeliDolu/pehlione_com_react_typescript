import { RouteSection } from "../components/routes/RouteSection";

export function LoginPage() {
  return (
    <RouteSection
      eyebrow="Auth"
      title="Login ekrani icin ayrilmis route."
      description="Form, CSRF ve session tabanli giris akisina baglanacak alan burada konumlanir."
      actions={["Email field", "Password field", "Remember session policy"]}
    />
  );
}
