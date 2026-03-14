import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

import { useAuth } from "../auth/AuthContext";
import { DataState } from "../components/data/DataState";
import { KeyValueList } from "../components/data/KeyValueList";
import { RouteSection } from "../components/routes/RouteSection";
import { getApiErrorMessage } from "../lib/api-errors";
import {
  fetchMyMembership,
  fetchMyFeatures,
} from "../memberships/memberships.api";

export function MembershipPage() {
  const { user } = useAuth();

  const membershipQuery = useQuery({
    queryKey: ["memberships", "me"],
    queryFn: fetchMyMembership,
  });

  const featuresQuery = useQuery({
    queryKey: ["memberships", "features", "me"],
    queryFn: fetchMyFeatures,
  });

  const membership = membershipQuery.data;
  const features = featuresQuery.data ?? [];

  return (
    <RouteSection
      eyebrow="User area"
      title="Membership and plan details"
      description="You can view your active plan, feature entitlements and plan history."
    >
      {/* Current tier badge */}
      <section className="route-panel">
        <p className="feature-card__kicker">Active plan</p>
        <KeyValueList
          items={[
            { label: "Tier", value: user?.membershipTier ?? "—" },
            {
              label: "Status",
              value: membership?.status ?? "No active record",
            },
            {
              label: "Start date",
              value: membership?.startedAt
                ? new Date(membership.startedAt).toLocaleDateString("en-US")
                : "—",
            },
          ]}
        />
        <Link
          className="button button--secondary"
          to="/pricing"
          style={{ marginTop: 12 }}
        >
          View plans
        </Link>
      </section>

      {/* Feature entitlements */}
      <section className="route-panel">
        <p className="feature-card__kicker">Feature entitlements</p>
        <DataState
          loading={featuresQuery.isLoading}
          error={
            featuresQuery.error
              ? getApiErrorMessage(
                  featuresQuery.error,
                  "Failed to load features.",
                )
              : null
          }
          empty={!features.length}
          emptyMessage="No entitlements defined yet."
        />
        {features.length > 0 && (
          <ul className="session-list">
            {features.map((f) => (
              <li key={f.feature} className="session-card">
                <div>
                  <strong>{f.feature}</strong>
                </div>
                <span className="pill-list__item">
                  {f.value === "true"
                    ? "Active"
                    : f.value === "false"
                      ? "Inactive"
                      : f.value}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </RouteSection>
  );
}
