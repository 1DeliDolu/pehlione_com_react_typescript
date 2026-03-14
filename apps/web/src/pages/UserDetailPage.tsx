import { MembershipTier, Role } from "@pehlione/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

import {
  disableAdminUser,
  enableAdminUser,
  fetchAdminUser,
  updateAdminUserRole,
  updateAdminUserTier,
} from "../admin/admin.api";
import { DataState } from "../components/data/DataState";
import { KeyValueList } from "../components/data/KeyValueList";
import { getApiErrorMessage } from "../lib/api-errors";
import { RouteSection } from "../components/routes/RouteSection";

export function UserDetailPage() {
  const { userId = "" } = useParams();
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: () => fetchAdminUser(userId),
    enabled: Boolean(userId),
  });
  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] }),
    ]);
  };
  const roleMutation = useMutation({
    mutationFn: (role: Role) => updateAdminUserRole(userId, role),
    onSuccess: refresh,
  });
  const tierMutation = useMutation({
    mutationFn: (tier: MembershipTier) => updateAdminUserTier(userId, tier),
    onSuccess: refresh,
  });
  const disableMutation = useMutation({
    mutationFn: () => disableAdminUser(userId),
    onSuccess: refresh,
  });
  const enableMutation = useMutation({
    mutationFn: () => enableAdminUser(userId),
    onSuccess: refresh,
  });
  const user = userQuery.data;
  const actionError =
    roleMutation.error ??
    tierMutation.error ??
    disableMutation.error ??
    enableMutation.error;

  return (
    <RouteSection
      eyebrow="Admin area"
      title="User detail route separates individual management operations."
      description="This page now fetches data from `/admin/users/:userId` and sends role/plan/status actions."
      actions={[
        "Profile data",
        "Session history",
        "Tier update",
        "Disable account",
      ]}
    >
      <section className="route-panel">
        <p className="feature-card__kicker">User snapshot</p>
        <DataState
          loading={userQuery.isLoading}
          error={
            userQuery.error
              ? getApiErrorMessage(
                  userQuery.error,
                  "Failed to load user details.",
                )
              : null
          }
        />
        {user ? (
          <KeyValueList
            items={[
              { label: "First name", value: user.firstName },
              { label: "Last name", value: user.lastName },
              { label: "Email", value: user.email },
              { label: "Role", value: user.role },
              { label: "Plan", value: user.membershipTier },
              { label: "Status", value: user.isActive ? "Active" : "Disabled" },
            ]}
          />
        ) : null}
      </section>
      <section className="route-panel">
        <p className="feature-card__kicker">Management actions</p>
        {actionError ? (
          <p>{getApiErrorMessage(actionError, "Management action failed.")}</p>
        ) : null}
        <div className="admin-actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => roleMutation.mutate(Role.ADMIN)}
            disabled={roleMutation.isPending}
          >
            Make admin
          </button>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => roleMutation.mutate(Role.USER)}
            disabled={roleMutation.isPending}
          >
            Make user
          </button>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => tierMutation.mutate(MembershipTier.SILVER)}
            disabled={tierMutation.isPending}
          >
            Set silver
          </button>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => tierMutation.mutate(MembershipTier.GOLD)}
            disabled={tierMutation.isPending}
          >
            Set gold
          </button>
          {user?.isActive ? (
            <button
              className="button button--secondary"
              type="button"
              onClick={() => disableMutation.mutate()}
              disabled={disableMutation.isPending}
            >
              Disable account
            </button>
          ) : (
            <button
              className="button button--secondary"
              type="button"
              onClick={() => enableMutation.mutate()}
              disabled={enableMutation.isPending}
            >
              Enable account
            </button>
          )}
        </div>
      </section>
    </RouteSection>
  );
}
