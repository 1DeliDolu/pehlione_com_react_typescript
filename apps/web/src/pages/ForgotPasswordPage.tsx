import { RouteSection } from "../components/routes/RouteSection";

export function ForgotPasswordPage() {
  return (
    <RouteSection
      eyebrow="Recovery"
      title="Forgot password akisi icin ozel route."
      description="Password reset token istegi, rate limit ve mail feedback bu sayfaya baglanacak."
      actions={["Email request", "Rate limit feedback", "Mail sent state"]}
    />
  );
}
