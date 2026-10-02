import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { trackPageView } from "../services/ASAnalytics";
import ASNavbar from "../components/ASNavbar";
import ASFooter from "../components/ASFooter";
import ASRateLimitBanner from "../components/ASRateLimitBanner";
import ASPageLoader from "../components/ASPageLoader";
import { usePageTransition } from "../hooks/usePageTransition";
import { LocalePath, LocalePreference, LocaleProvider } from "../i18n";

export default function ASMainLayout() {
  const location = useLocation();
  const analyticsReady = useRef(false);
  const isPageTransitioning = usePageTransition();

  const navigate = useNavigate();
  const { locale, path: neutralPath } = LocalePath.parse(location.pathname);
  const isHeroPage = neutralPath === "/";
  const isProjectDetail = /^\/projects\/.+/.test(neutralPath);

  // A returning visitor who chose a language is sent to it when they land on
  // an English URL. Only an explicit choice (cookie) triggers this; crawlers
  // and first-time visitors always get the language in the URL.
  useEffect(() => {
    const preferred = LocalePreference.read();
    if (LocalePreference.isDefault(preferred) || !LocalePreference.isDefault(locale) || !preferred) return;
    const target = LocalePath.of(neutralPath, preferred).toString();
    navigate(`${target}${location.search}${location.hash}`, { replace: true });
    // Landing only: later navigations already carry the locale prefix.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (!analyticsReady.current) {
      const fire = () => {
        analyticsReady.current = true;
        trackPageView(location.pathname);
      };
      if (typeof requestIdleCallback !== "undefined") {
        const id = requestIdleCallback(fire, { timeout: 5000 });
        return () => cancelIdleCallback(id);
      }
      const id = setTimeout(fire, 2000);
      return () => clearTimeout(id);
    }
    trackPageView(location.pathname);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "dark-theme" ? "light-theme" : "dark-theme"
    );
  };

  return (
    <LocaleProvider>
      <main className="app-main">
        {isPageTransitioning && <ASPageLoader />}
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
    </LocaleProvider>
  );
}
