import { NavLink, type NavLinkRenderProps } from "react-router-dom";

const navSections = [
  { title: "Home", to: "/" },
  { title: "Pricing", to: "/pricing" },
  { title: "Dashboard", to: "/dashboard" },
  { title: "Admin", to: "/admin" },
  { title: "Login", to: "/login" },
];

export function Navigation() {
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
      </ul>
    </nav>
  );
}
