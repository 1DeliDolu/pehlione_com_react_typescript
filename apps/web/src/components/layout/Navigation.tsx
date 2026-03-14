import { NavLink, useNavigate, type NavLinkRenderProps } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../auth/AuthContext";
import { logoutMutation } from "../../auth/auth.mutations";
import { queryKeys } from "../../lib/queryKeys";

const navSections = [
  { title: "Home", to: "/" },
  { title: "Pricing", to: "/pricing" },
  { title: "Dashboard", to: "/dashboard" },
  { title: "Analytics", to: "/analytics" },
  { title: "Admin", to: "/admin" },
];

export function Navigation() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = useMutation({
    mutationFn: logoutMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.authMe });
      navigate("/login", { replace: true });
    },
  });

  return (
    <nav className="top-nav" aria-label="Primary navigation">
      <div className="brand-lockup">
        <span className="brand-lockup__mark" aria-hidden="true">
          P
        </span>
        <div>
          <strong>Pehlione Web</strong>
          <p>React + TypeScript + Vite</p>
        </div>
      </div>

      <ul className="top-nav__links">
        {navSections.map((section) => (
          <li key={section.title}>
            <NavLink
              to={section.to}
              className={({ isActive }: NavLinkRenderProps) =>
                isActive ? "is-active top-nav__link" : "top-nav__link"
              }
              end={section.to === "/"}
            >
              {section.title}
            </NavLink>
          </li>
        ))}
        <li>
          {isAuthenticated ? (
            <button
              className="top-nav__link"
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              {logout.isPending ? "Logging out…" : "Logout"}
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }: NavLinkRenderProps) =>
                isActive ? "is-active top-nav__link" : "top-nav__link"
              }
            >
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}
