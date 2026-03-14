import { Link } from "react-router";

import { AuthStatusPanel } from "../auth/AuthStatusPanel";

const stats = [
  { value: "3 layers", label: "public, user, admin" },
  { value: "4 guard", label: "auth, role, tier, feature" },
  { value: "httpOnly", label: "session-first auth" },
];

export function Header() {
  return (
    <header className="hero">
      <div className="hero__copy">
        <p className="eyebrow">Pehlione Membership Platform</p>
        <h1>Modern frontend scaffold, modular and production-focused.</h1>
        <p className="hero__lede">
          Header, nav, main and footer areas are separated. A scalable entry
          layer for public, user and admin areas has been prepared.
        </p>
        <div className="hero__actions">
          <Link className="button button--primary" to="/pricing">
            View plans
          </Link>
          <Link className="button button--secondary" to="/analytics">
            See guard flow
          </Link>
        </div>
        <AuthStatusPanel />
      </div>

      <div className="hero__panel" aria-label="Platform summary">
        <p className="hero__panel-title">Platform snapshot</p>
        <ul className="stat-grid">
          {stats.map((stat) => (
            <li key={stat.label} className="stat-card">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
