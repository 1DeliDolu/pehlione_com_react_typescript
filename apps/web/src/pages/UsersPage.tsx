import { RouteSection } from "../components/routes/RouteSection";

export function UsersPage() {
  return (
    <RouteSection
      eyebrow="Admin area"
      title="Users route kullanici listesi ve filtreleri tasir."
      description="Role, tier ve active status alanlarina gore yonetim tablosu burada olusacak."
      actions={["Search users", "Filter by role", "Filter by tier", "Open detail"]}
    />
  );
}
