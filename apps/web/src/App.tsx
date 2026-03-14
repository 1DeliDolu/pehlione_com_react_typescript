import { Outlet } from "react-router";

import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { Navigation } from "./components/layout/Navigation";

export function App() {
  return (
    <div className="site-shell">
      <Navigation />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
