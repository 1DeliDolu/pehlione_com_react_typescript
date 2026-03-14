import { Link } from "react-router-dom";

import { AuthStatusPanel } from "../auth/AuthStatusPanel";

const stats = [
  { value: "3 katman", label: "public, user, admin" },
  { value: "4 guard", label: "auth, role, tier, feature" },
  { value: "httpOnly", label: "session-first auth" },
];

export function Header() {
  return (
    <header className="hero">
      <div className="hero__copy">
        <p className="eyebrow">Pehlione Membership Platform</p>
        <h1>Modern frontend iskeleti, moduler ve production odakli.</h1>
        <p className="hero__lede">
          Header, nav, main ve footer alanlari ayrildi. Public, user ve admin
          alanlari icin buyumeye uygun bir giris katmani hazirlandi.
        </p>
        <div className="hero__actions">
          <Link className="button button--primary" to="/pricing">
            Planlari incele
          </Link>
          <Link className="button button--secondary" to="/analytics">
            Guard akisini gor
          </Link>
        </div>
        <AuthStatusPanel />
      </div>

      <div className="hero__panel" aria-label="Platform ozeti">
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
