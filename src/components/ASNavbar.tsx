import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  const tabs = ["Home", "Projects", "Components", "Technology", "About"];

  const tabRoutes: Record<string, string> = {
    Home: "/",
    Projects: "/projects",
    Technology: "/technology",
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
      setActiveTab("Home");

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
    setActiveTab(tab);
    setIsMobileMenuOpen(false);

    if (tab === "Home" && location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    navigate(tabRoutes[tab]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGetQuoteClick = () => {
    setIsMobileMenuOpen(false);
    navigate("/quotation-engine");
  };

  return (
    <nav className="ASNavbar" ref={navbarRef}>
      <div
        className="nav-logo"
        onClick={() => handleTabClick("Home")}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleTabClick("Home");
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
        <button className="getQuote-btn" onClick={handleGetQuoteClick}>
          Get Quote
        </button>

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
