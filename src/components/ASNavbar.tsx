import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useContent } from "../hooks/useContent";

import lightModeToggle from "../assets/images/light-toggle-v2.png";
import darkModeToggle from "../assets/images/dark-toggle-v2.png";

type ASNavbarProps = {
  theme: "light-theme" | "dark-theme";
  toggleTheme: () => void;
};

export default function ASNavbar({ theme, toggleTheme }: ASNavbarProps) {
  const [activeTab, setActiveTab] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const navMenuRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const pageVis = useContent<{ packages?: boolean }>("section-visibility", { packages: true });
  const showPackages = pageVis.packages !== false;

  const tabs = ["Home", "Client Journey", "Projects", ...(showPackages ? ["Packages"] : []), "System Calculator"];

  const tabRoutes: Record<string, string> = {
    Home: "/",
    Projects: "/projects",
    Packages: "/packages",
    "Client Journey": "/client-journey",
    "System Calculator": "/solar-calculator",
  };

  const updateIndicator = (tab: string) => {
    if (!tab) return;

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
  };

  useEffect(() => {
    const currentPath = location.pathname;

    const matchedEntry = Object.entries(tabRoutes).find(([_, path]) => {
      if (path === "/") return currentPath === "/";
      return currentPath.startsWith(path);
    });

    if (matchedEntry) {
      setActiveTab(matchedEntry[0]);
    } else {
      setActiveTab("");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!activeTab) return;
    updateIndicator(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      if (!activeTab) return;
      updateIndicator(activeTab);

      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#calculator") {
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
  }, [location.pathname, location.hash]);

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

  const handleTabClick = (tab: string) => {
    setIsMobileMenuOpen(false);
    setActiveTab(tab);

    navigate(tabRoutes[tab]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="ASNavbar" ref={navbarRef}>
      <div
        className="nav-logo"
        onClick={() => { setActiveTab("Home"); navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setActiveTab("Home"); navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      />

      <ul className="nav-menu" ref={navMenuRef}>
        {tabs.map((tab) => (
          <li
            key={tab}
            ref={(el) => {
              tabRefs.current[tab] = el;
            }}
            className={activeTab === tab ? "active" : ""}
            onClick={() => handleTabClick(tab)}
          >
            <span className="nav-link-text">{tab}</span>
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
          aria-label={
            theme === "dark-theme"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          <img
            src={theme === "dark-theme" ? darkModeToggle : lightModeToggle}
            alt="Theme toggle"
            className="theme-toggle-img"
          />
        </button>

        <button
          type="button"
          className={`mobile-menu-btn ${isMobileMenuOpen ? "open" : ""}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-nav-menu ${isMobileMenuOpen ? "open" : ""}`}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "active" : ""}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
}
