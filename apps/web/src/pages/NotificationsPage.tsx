import { RouteSection } from "../components/routes/RouteSection";

export function NotificationsPage() {
  return (
    <RouteSection
      eyebrow="User area"
      title="Notifications route gathers account feedback."
      description="Separate area for mail events, system alerts and membership change messages."
      actions={["Security alerts", "Plan updates", "Email history"]}
    />
  );
}
