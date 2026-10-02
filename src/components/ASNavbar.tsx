import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useContent } from "../hooks/useContent";
import { useLocale, useLocalizedPath, useNeutralPath, useT, type MessageKey } from "../i18n";

import lightModeToggle from "../assets/images/light-toggle-v2.png";
import darkModeToggle from "../assets/images/dark-toggle-v2.png";

type ASNavbarProps = {
  theme: "light-theme" | "dark-theme";
  toggleTheme: () => void;
};

type NavTab = {
  id: string;
  label: MessageKey;
  /** Locale-neutral route; localized at render time. */
  path: string;
  /** Hidden when the packages page is switched off in admin. */
  requiresPackages?: boolean;
};

const NAV_TABS: readonly NavTab[] = [
  { id: "home", label: "nav.home", path: "/" },
  { id: "client-journey", label: "nav.clientJourney", path: "/client-journey" },
  { id: "projects", label: "nav.projects", path: "/projects" },
  { id: "packages", label: "nav.packages", path: "/packages", requiresPackages: true },
  { id: "calculator", label: "nav.calculator", path: "/solar-calculator" },
];

export default function ASNavbar({ theme, toggleTheme }: ASNavbarProps) {
  const [activeTab, setActiveTab] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  const location = useLocation();
  const neutralPath = useNeutralPath();
  const locale = useLocale();
  const localize = useLocalizedPath();
  const t = useT();
  const navMenuRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const indicatorRafRef = useRef<number>(0);

  const pageVis = useContent<{ packages?: boolean }>("section-visibility", { packages: true });
  const showPackages = pageVis.packages !== false;

  const tabs = NAV_TABS.filter((tab) => showPackages || !tab.requiresPackages);

  const updateIndicator = (tab: string) => {
    if (!tab) return;
    cancelAnimationFrame(indicatorRafRef.current);
    indicatorRafRef.current = requestAnimationFrame(() => {
      const activeEl = tabRefs.current[tab];
      const menuEl = navMenuRef.current;

      if (activeEl && menuEl) {
        const menuRect = menuEl.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        const sidePadding = 2;
        const width = activeRect.width + sidePadding * 2;
        const center = activeRect.left - menuRect.left + activeRect.width / 2;

        setIndicatorStyle({
          left: center - width / 2,
          width,
        });
      }
    });
  };

  useEffect(() => {
    const matched = NAV_TABS.find(({ path }) =>
      path === "/" ? neutralPath === "/" : neutralPath.startsWith(path),
    );
    setActiveTab(matched?.id ?? "");
  }, [neutralPath]);

  // Labels change width with the language, so re-measure on locale change too.
  useEffect(() => {
    if (!activeTab) return;
    updateIndicator(activeTab);
  }, [activeTab, locale]);

  useEffect(() => {
    const handleResize = () => {
      if (!activeTab) return;
      updateIndicator(activeTab);

      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(indicatorRafRef.current);
    };
  }, [activeTab]);

  useEffect(() => {
    if (neutralPath === "/" && location.hash === "#calculator") {
      setActiveTab("");

      setTimeout(() => {
        const calculatorSection = document.getElementById("calculator");

        if (calculatorSection) {
          calculatorSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [neutralPath, location.hash]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Navigation itself is handled by the <Link> the handler is attached to, so
  // that every destination renders as a real crawlable anchor. This only keeps
  // the menu/indicator state in sync on click.
  const handleTabClick = (tab: string) => {
    setIsMobileMenuOpen(false);
    setActiveTab(tab);
  };

  return (
    <nav className="ASNavbar" ref={navbarRef}>
      <Link
        to={localize("/")}
        className="nav-logo"
        aria-label={t("nav.logo")}
        onClick={() => setActiveTab("home")}
      />

      <ul className="nav-menu" ref={navMenuRef}>
        {tabs.map((tab) => (
          <li
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            className={activeTab === tab.id ? "active" : ""}
          >
            <Link to={localize(tab.path)} onClick={() => handleTabClick(tab.id)}>
              <span className="nav-link-text">{t(tab.label)}</span>
            </Link>
          </li>
        ))}

        {activeTab && (
          <span
            className="nav-indicator"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        )}
      </ul>

      <div className="nav-actions">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={theme === "dark-theme" ? t("nav.toLight") : t("nav.toDark")}
        >
          <img
            src={theme === "dark-theme" ? darkModeToggle : lightModeToggle}
            alt={t("nav.themeToggle")}
            className="theme-toggle-img"
            width={84}
            height={76}
          />
        </button>

        <button
          type="button"
          className={`mobile-menu-btn ${isMobileMenuOpen ? "open" : ""}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={t("nav.toggleMenu")}
          aria-expanded={isMobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-nav-menu ${isMobileMenuOpen ? "open" : ""}`}>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={localize(tab.path)}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => handleTabClick(tab.id)}
          >
            {t(tab.label)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
