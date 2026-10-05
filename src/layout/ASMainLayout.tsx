import { useEffect, useState, useSyncExternalStore } from "react";
import { Outlet, useLocation } from "react-router";
import { trackPageView } from "../services/ASAnalytics";
import { themeStore, type Theme } from "../services/ASThemeStore";
import ASNavbar from "../components/ASNavbar";
import ASFooter from "../components/ASFooter";
import ASRateLimitBanner from "../components/ASRateLimitBanner";
import ASPageLoader from "../components/ASPageLoader";
import { usePageTransition } from "../hooks/usePageTransition";

/** What routes read through useOutletContext. */
export type LayoutContext = {
  theme: Theme;
  /** False during SSR and hydration, until the visitor's theme is known. */
  themeReady: boolean;
};

export default function ASMainLayout() {
  const location = useLocation();
  const isPageTransitioning = usePageTransition();

  const isHeroPage = location.pathname === "/";
  const isProjectDetail = /^\/projects\/.+/.test(location.pathname);

  // The page the visitor landed on renders without the enter animation (see
  // .route-page--enter); pages reached by client-side navigation animate in.
  const [landingPath] = useState(location.pathname);
  const routePageClass = location.pathname === landingPath ? "route-page" : "route-page route-page--enter";

  // null during SSR and hydration. The anti-flash script at the top of <body>
  // already put the right class on it; applying a server default first would flip it
  // for a frame and download the other theme's assets.
  const resolvedTheme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );
  const theme: Theme = resolvedTheme ?? "dark-theme";

  useEffect(() => {
    if (!resolvedTheme) return;
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // ASAnalytics defers loading Firebase itself; page views queue until then.
  useEffect(() => {
    void trackPageView(location.pathname);
  }, [location.pathname]);

  const toggleTheme = () => {
    themeStore.set(theme === "dark-theme" ? "light-theme" : "dark-theme");
  };

  return (
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
            <div className={routePageClass} key={location.pathname}>
              <Outlet context={{ theme, themeReady: resolvedTheme !== null } satisfies LayoutContext} />
            </div>
          </div>
        </div>

        <ASFooter />
      </div>
    </main>
  );
}
