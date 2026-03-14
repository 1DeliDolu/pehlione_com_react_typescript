import { Link } from "react-router";

export function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <div>
        <p className="eyebrow">Next stage</p>
        <h2>
          Router is set up; next step is auth guards and data connections.
        </h2>
      </div>

      <div className="site-footer__meta">
        <p>Modular layout ready: header, nav, main, footer.</p>
        <p>Next integration: route guard + session state + API data flow.</p>
        <div className="footer-links">
          <Link to="/register">Register</Link>
          <Link to="/sessions">Sessions</Link>
          <Link to="/admin/audit-logs">Audit Logs</Link>
        </div>
      </div>
    </footer>
  );
}
