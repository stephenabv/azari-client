import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { trackPageView } from "../services/ASAnalytics";
import ASNavbar from "../components/ASNavbar";
import ASFooter from "../components/ASFooter";

const getSystemTheme = (): "light-theme" | "dark-theme" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark-theme"
    : "light-theme";
};


export default function ASMainLayout() {
  const location = useLocation();

  const isHeroPage = location.pathname === "/";

  const [theme, setTheme] = useState<"light-theme" | "dark-theme">(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light-theme"
      | "dark-theme"
      | null;

    return savedTheme ?? getSystemTheme();
  });

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
      <header className="navbar-section">
        <div className="navbar-inner">
          <ASNavbar theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>

      <div className="layout-content">
        <div className="layout-page-body">
          <div className={`page-container ${isHeroPage ? "no-offset" : ""}`}>
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