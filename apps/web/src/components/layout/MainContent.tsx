const areas = [
  {
    id: "public-area",
    title: "Public area",
    description:
      "Ziyaretci odakli landing, auth ve pricing ekranlari icin temiz bir alan.",
    items: ["Home", "Login", "Register", "Forgot Password", "Pricing / Plans"],
  },
  {
    id: "user-area",
    title: "User area",
    description:
      "Aktif kullanici deneyimini dashboard, guvenlik ve plan yonetimi etrafinda toplar.",
    items: ["Dashboard", "Profile", "Security", "Sessions", "Membership / Plan"],
  },
  {
    id: "admin-area",
    title: "Admin area",
    description:
      "Rol bazli erisimle kullanici, audit ve membership operasyonlarini ayirir.",
    items: [
      "Admin Dashboard",
      "Users",
      "Membership Management",
      "Audit Logs",
      "Settings",
    ],
  },
];

const guards = [
  "RequireAuth",
  "RequireRole('ADMIN')",
  "RequireTier(['SILVER', 'GOLD'])",
  "RequireFeature('feature.analytics.advanced')",
];

export function MainContent() {
  return (
    <main id="main-content" className="main-content">
      <section className="section-intro">
        <p className="eyebrow">Layout architecture</p>
        <h2>Her ana bolum ayri modul, tek bir sayfada toplanmis durumda.</h2>
        <p>
          Bu iskelet, ileride router ve auth guard katmanlari eklendiginde
          kolayca sayfa tabanli yapıya genisleyebilsin diye duzenlendi.
        </p>
      </section>

      <section className="content-grid" aria-label="Frontend areas">
        {areas.map((area) => (
          <article key={area.id} id={area.id} className="feature-card">
            <p className="feature-card__kicker">{area.title}</p>
            <h3>{area.description}</h3>
            <ul>
              {area.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section id="route-guards" className="guard-strip">
        <div>
          <p className="eyebrow">Route protection</p>
          <h2>UI gizleme degil, backend ile uyumlu guard yapisi.</h2>
        </div>

        <ul className="guard-list">
          {guards.map((guard) => (
            <li key={guard}>{guard}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
