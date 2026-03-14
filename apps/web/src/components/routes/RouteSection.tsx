import type { ReactNode } from "react";

type RouteSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: string[];
  children?: ReactNode;
};

export function RouteSection({
  eyebrow,
  title,
  description,
  actions = [],
  children,
}: RouteSectionProps) {
  return (
    <main className="main-content">
      <section className="section-intro">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </section>

      {actions.length > 0 ? (
        <section className="route-panel">
          <p className="feature-card__kicker">Primary actions</p>
          <div className="pill-list">
            {actions.map((action) => (
              <span key={action} className="pill-list__item">
                {action}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {children}
    </main>
  );
}
