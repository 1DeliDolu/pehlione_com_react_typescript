import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "../lib/api-errors";
import { queryKeys } from "../lib/queryKeys";
import { RouteSection } from "../components/routes/RouteSection";
import {
  fetchSessions,
  revokeAllSessions,
  revokeSession,
} from "../sessions/sessions.api";

export function SessionsPage() {
  const queryClient = useQueryClient();
  const sessionsQuery = useQuery({
    queryKey: queryKeys.userSessions,
    queryFn: fetchSessions,
  });
  const revokeOne = useMutation({
    mutationFn: revokeSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.userSessions });
    },
  });
  const revokeAll = useMutation({
    mutationFn: revokeAllSessions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.userSessions });
    },
  });

  return (
    <RouteSection
      eyebrow="User area"
      title="Sessions route shows active devices."
      description="This page now fetches the `/sessions` list and sends revoke actions."
      actions={["Current session", "Other devices", "Revoke action"]}
    >
      <section className="route-panel">
        <div className="route-panel__header">
          <p className="feature-card__kicker">Active sessions</p>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => revokeAll.mutate()}
            disabled={revokeAll.isPending}
          >
            {revokeAll.isPending ? "Clearing" : "Revoke other sessions"}
          </button>
        </div>
        {sessionsQuery.isLoading ? <p>Loading sessions.</p> : null}
        {sessionsQuery.error ? (
          <p>
            {getApiErrorMessage(
              sessionsQuery.error,
              "Failed to load session data.",
            )}
          </p>
        ) : null}
        {revokeOne.error ? (
          <p>
            {getApiErrorMessage(revokeOne.error, "Failed to revoke session.")}
          </p>
        ) : null}
        {revokeAll.error ? (
          <p>
            {getApiErrorMessage(revokeAll.error, "Failed to revoke sessions.")}
          </p>
        ) : null}
        <ul className="session-list">
          {(sessionsQuery.data ?? []).map((session) => (
            <li key={session.sessionId} className="session-card">
              <div>
                <strong>
                  {session.isCurrent ? "Current device" : "Known device"}
                </strong>
                <p>{session.sessionId}</p>
                <small>
                  {session.createdAt
                    ? new Date(session.createdAt).toLocaleString("en-US")
                    : "No date"}
                </small>
              </div>
              {!session.isCurrent ? (
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => revokeOne.mutate(session.sessionId)}
                  disabled={revokeOne.isPending}
                >
                  Revoke
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </RouteSection>
  );
}
