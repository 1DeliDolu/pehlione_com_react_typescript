import { useAuth } from "../../auth/AuthContext";

export function AuthStatusPanel() {
  const { user, isLoading, errorMessage } = useAuth();

  return (
    <section className="auth-switcher" aria-label="Session status">
      <div>
        <p className="feature-card__kicker">Session state</p>
        <strong>
          {isLoading
            ? "Session loading"
            : user
              ? `${user.role} / ${user.membershipTier}`
              : "Anonymous visitor"}
        </strong>
      </div>

      <div className="auth-status-copy">
        <p>
          {errorMessage
            ? "API baglantisi kurulamadi veya session okunamadi."
            : user
              ? `${user.firstName} ${user.lastName} olarak oturum acik.`
              : "Protected route'lar login olmadan login ekranina yonlenir."}
        </p>
      </div>
    </section>
  );
}
