import { RouteSection } from "../components/routes/RouteSection";

export function ForbiddenPage() {
  return (
    <RouteSection
      eyebrow="Access denied"
      title="This area requires role authorization."
      description="The frontend route guard stopped you here. In a real application the backend should enforce the same check."
      actions={["Role mismatch", "Admin permission required"]}
    />
  );
}
