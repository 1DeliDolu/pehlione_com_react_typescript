import { RouteSection } from "../components/routes/RouteSection";

export function SettingsPage() {
  return (
    <RouteSection
      eyebrow="Admin area"
      title="Settings route separates system configurations."
      description="Policy settings, operational config and general admin preferences are placed on this page."
      actions={["Security policy", "Feature flags", "Operational defaults"]}
    />
  );
}
