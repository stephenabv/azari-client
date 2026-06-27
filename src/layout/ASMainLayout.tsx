import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { trackPageView } from "../services/ASAnalytics";
import ASNavbar from "../components/ASNavbar";
import ASFooter from "../components/ASFooter";
import ASRateLimitBanner from "../components/ASRateLimitBanner";

export default function ASMainLayout() {
  const location = useLocation();

  const isHeroPage = location.pathname === "/";
  const isProjectDetail = /^\/projects\/.+/.test(location.pathname);

  // SSR-safe: default to dark-theme; anti-flash script in <body> handles the visual side
  const [theme, setTheme] = useState<"light-theme" | "dark-theme">("dark-theme");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light-theme" | "dark-theme" | null;
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark-theme"
      : "light-theme";
    setTheme(saved ?? system);
  }, []);

  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "dark-theme" ? "light-theme" : "dark-theme"
    );
  };

  return (
    <main className="app-main">
      <ASRateLimitBanner />
      <header className="navbar-section">
        <div className="navbar-inner">
          <ASNavbar theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>

      <div className="layout-content">
        <div className="layout-page-body">
          <div className={`page-container ${isHeroPage || isProjectDetail ? "no-offset" : ""}`}>
            <div className="route-page" key={location.pathname}>
              <Outlet context={{ theme }} />
            </div>
          </div>
        </div>

        <ASFooter />
      </div>
    </main>
  );
}
