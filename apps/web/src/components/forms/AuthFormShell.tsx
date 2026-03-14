import type { ReactNode } from "react";

type AuthFormShellProps = {
  title: string;
  description: string;
  statusMessage?: string | null;
  errorMessage?: string | null;
  children: ReactNode;
};

export function AuthFormShell({
  title,
  description,
  statusMessage,
  errorMessage,
  children,
}: AuthFormShellProps) {
  return (
    <section className="auth-form-shell">
      <div className="auth-form-shell__intro">
        <p className="feature-card__kicker">{title}</p>
        <h3>{description}</h3>
      </div>
      {statusMessage ? <p className="form-message form-message--success">{statusMessage}</p> : null}
      {errorMessage ? <p className="form-message form-message--error">{errorMessage}</p> : null}
      {children}
    </section>
  );
}
