import { RouteSection } from "../components/routes/RouteSection";

export function SettingsPage() {
  return (
    <RouteSection
      eyebrow="Admin area"
      title="Settings route sistem yapilandirmalarini ayirir."
      description="Policy ayarlari, operational config ve genel admin tercihleri bu sayfaya konur."
      actions={["Security policy", "Feature flags", "Operational defaults"]}
    />
  );
}
