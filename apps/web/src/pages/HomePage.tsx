import { InfoGrid } from "../components/routes/InfoGrid";
import { RouteSection } from "../components/routes/RouteSection";

const cards = [
  {
    title: "Public area",
    text: "Combines landing, auth and pricing flows under a single public experience.",
    items: ["Home", "Login", "Register", "Pricing / Plans"],
  },
  {
    title: "User area",
    text: "Account, security and plan screens ready for authenticated users.",
    items: ["Dashboard", "Profile", "Sessions", "Membership / Plan"],
  },
  {
    title: "Admin area",
    text: "Role-based management layer split into audit and operations panels.",
    items: ["Users", "Audit Logs", "Mail Templates", "Settings"],
  },
];

export function HomePage() {
  return (
    <RouteSection
      eyebrow="Public home"
      title="Modern route-based entry for the membership platform."
      description="This page serves as the landing only. All other areas are separated via the router and rendered through a shared shell."
      actions={["Explore pricing", "Open dashboard", "Review admin flow"]}
    >
      <InfoGrid cards={cards} />
    </RouteSection>
  );
}
