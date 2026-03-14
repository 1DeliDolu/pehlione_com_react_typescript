const navSections = [
  { title: "Public", href: "#public-area" },
  { title: "User", href: "#user-area" },
  { title: "Admin", href: "#admin-area" },
  { title: "Guards", href: "#route-guards" },
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
            <a href={section.href}>{section.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
