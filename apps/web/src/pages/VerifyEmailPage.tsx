import { RouteSection } from "../components/routes/RouteSection";

export function VerifyEmailPage() {
  return (
    <RouteSection
      eyebrow="Verification"
      title="Email dogrulama sonucu icin route ayrildi."
      description="Token durumu, basari ve tekrar gonderim akislari burada gosterilecek."
      actions={["Token state", "Success feedback", "Resend verification"]}
    />
  );
}
