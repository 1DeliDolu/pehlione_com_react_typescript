import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <div>
        <p className="eyebrow">Next stage</p>
        <h2>Router kuruldu; siradaki adim auth guard ve veri baglantilari.</h2>
      </div>

      <div className="site-footer__meta">
        <p>Moduler layout hazirlandi: header, nav, main, footer.</p>
        <p>Sonraki entegrasyon: route guard + session state + API veri akisi.</p>
        <div className="footer-links">
          <Link to="/register">Register</Link>
          <Link to="/sessions">Sessions</Link>
          <Link to="/admin/audit-logs">Audit Logs</Link>
        </div>
      </div>
    </footer>
  );
}
