import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import { MembershipTier, Role } from "@pehlione/shared";

import { fetchAdminUsers, type AdminUsersParams } from "../admin/admin.api";
import { DataState } from "../components/data/DataState";
import { getApiErrorMessage } from "../lib/api-errors";
import { RouteSection } from "../components/routes/RouteSection";

function paramsFromSearch(sp: URLSearchParams): AdminUsersParams {
  return {
    page: sp.has("page") ? Number(sp.get("page")) : 1,
    limit: sp.has("limit") ? Number(sp.get("limit")) : 20,
    search: sp.get("search") || undefined,
    role: (sp.get("role") as Role) || undefined,
    membershipTier: (sp.get("membershipTier") as MembershipTier) || undefined,
    isActive:
      sp.get("isActive") === "true"
        ? true
        : sp.get("isActive") === "false"
          ? false
          : undefined,
  };
}

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = paramsFromSearch(searchParams);

  const usersQuery = useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => fetchAdminUsers(params),
  });

  const users = usersQuery.data?.data ?? [];
  const meta = usersQuery.data?.meta;

  const setFilter = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        // reset to page 1 when filters change
        if (key !== "page") next.set("page", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  return (
    <RouteSection
      eyebrow="Admin area"
      title="Kullanici yonetimi"
      description="Arama, filtre ve sayfalama ile kullanici listesi."
    >
      {/* ── Filters ─────────────────────────────────────── */}
      <section className="route-panel">
        <p className="feature-card__kicker">Filtreler</p>
        <div className="filter-bar">
          <input
            className="filter-bar__input"
            type="text"
            placeholder="Isim veya e-posta ile ara..."
            value={params.search ?? ""}
            onChange={(e) => setFilter("search", e.target.value)}
          />
          <select
            className="filter-bar__select"
            value={params.role ?? ""}
            onChange={(e) => setFilter("role", e.target.value)}
          >
            <option value="">Tum roller</option>
            {Object.values(Role).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            className="filter-bar__select"
            value={params.membershipTier ?? ""}
            onChange={(e) => setFilter("membershipTier", e.target.value)}
          >
            <option value="">Tum tierler</option>
            {Object.values(MembershipTier).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className="filter-bar__select"
            value={
              params.isActive === true
                ? "true"
                : params.isActive === false
                  ? "false"
                  : ""
            }
            onChange={(e) => setFilter("isActive", e.target.value)}
          >
            <option value="">Tum durum</option>
            <option value="true">Aktif</option>
            <option value="false">Pasif</option>
          </select>
        </div>
      </section>

      {/* ── User list ───────────────────────────────────── */}
      <section className="route-panel">
        <p className="feature-card__kicker">
          Kullanicilar{meta ? ` (${meta.total} sonuc)` : ""}
        </p>
        <DataState
          loading={usersQuery.isLoading}
          error={
            usersQuery.error
              ? getApiErrorMessage(
                  usersQuery.error,
                  "Kullanici listesi okunamadi.",
                )
              : null
          }
          empty={!users.length}
          emptyMessage="Filtreye uygun kullanici bulunamadi."
        />
        {users.length > 0 && (
          <ul className="session-list">
            {users.map((user) => (
              <li key={user.id} className="session-card">
                <div>
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>
                  <p>{user.email}</p>
                  <small>
                    {user.role} / {user.membershipTier} /{" "}
                    {user.isActive ? "Active" : "Disabled"}
                  </small>
                </div>
                <Link
                  className="button button--secondary"
                  to={`/admin/users/${user.id}`}
                >
                  Detay
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* ── Pagination ──────────────────────────────── */}
        {meta && meta.total > (params.limit ?? 20) && (
          <div className="pagination">
            <button
              className="button button--secondary"
              type="button"
              disabled={params.page === 1}
              onClick={() => setFilter("page", String((params.page ?? 1) - 1))}
            >
              Onceki
            </button>
            <span className="pagination__info">
              Sayfa {params.page ?? 1} /{" "}
              {Math.ceil(meta.total / (params.limit ?? 20))}
            </span>
            <button
              className="button button--secondary"
              type="button"
              disabled={(params.page ?? 1) * (params.limit ?? 20) >= meta.total}
              onClick={() => setFilter("page", String((params.page ?? 1) + 1))}
            >
              Sonraki
            </button>
          </div>
        )}
      </section>
    </RouteSection>
  );
}
