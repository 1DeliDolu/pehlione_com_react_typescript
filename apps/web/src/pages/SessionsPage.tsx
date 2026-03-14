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
      title="Sessions route aktif cihazlari gosterir."
      description="Bu sayfa artik `/sessions` listesini cekiyor ve revoke aksiyonlari gonderiyor."
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
            {revokeAll.isPending ? "Temizleniyor" : "Diger sessionlari kapat"}
          </button>
        </div>
        {sessionsQuery.isLoading ? <p>Session listesi yukleniyor.</p> : null}
        {sessionsQuery.error ? (
          <p>{getApiErrorMessage(sessionsQuery.error, "Session verisi okunamadi.")}</p>
        ) : null}
        {revokeOne.error ? (
          <p>{getApiErrorMessage(revokeOne.error, "Session kapatilamadi.")}</p>
        ) : null}
        {revokeAll.error ? (
          <p>{getApiErrorMessage(revokeAll.error, "Sessionlar kapatilamadi.")}</p>
        ) : null}
        <ul className="session-list">
          {(sessionsQuery.data ?? []).map((session) => (
            <li key={session.sessionId} className="session-card">
              <div>
                <strong>{session.isCurrent ? "Current device" : "Known device"}</strong>
                <p>{session.sessionId}</p>
                <small>
                  {session.createdAt
                    ? new Date(session.createdAt).toLocaleString("tr-TR")
                    : "Tarih yok"}
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
