import { useQuery } from "@tanstack/react-query";

import { fetchAuditLogs } from "../admin/admin.api";
import { DataState } from "../components/data/DataState";
import { getApiErrorMessage } from "../lib/api-errors";
import { RouteSection } from "../components/routes/RouteSection";

export function AuditLogsPage() {
  const auditQuery = useQuery({
    queryKey: ["admin", "audit-logs"],
    queryFn: fetchAuditLogs,
  });
  const logs = auditQuery.data?.data ?? [];

  return (
    <RouteSection
      eyebrow="Admin area"
      title="Audit logs route displays security events."
      description="This page now fetches data from `/admin/audit-logs`."
      actions={["Filter events", "Trace actor", "Inspect metadata"]}
    >
      <section className="route-panel">
        <p className="feature-card__kicker">Audit timeline</p>
        <DataState
          loading={auditQuery.isLoading}
          error={
            auditQuery.error
              ? getApiErrorMessage(
                  auditQuery.error,
                  "Failed to load audit logs.",
                )
              : null
          }
          empty={!logs.length}
          emptyMessage="No audit records found."
        />
        {logs.length ? (
          <ul className="session-list">
            {logs.map((log) => (
              <li key={log.id} className="session-card">
                <div>
                  <strong>{log.action}</strong>
                  <p>
                    {log.entityType} / {log.entityId ?? "n/a"}
                  </p>
                  <small>
                    {new Date(log.createdAt).toLocaleString("en-US")} /{" "}
                    {log.actorEmail ?? log.actorUserId ?? "system"}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </RouteSection>
  );
}
