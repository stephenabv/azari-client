import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import darkBg from "../assets/videos/bg_hero_section_dark.mp4";
import darkBgWebm from "../assets/videos/bg_hero_section_dark.webm";
import lightBg from "../assets/videos/bg_hero_section_light.mp4";
import lightBgWebm from "../assets/videos/bg_hero_section_light.webm";
import { useContent } from "../hooks/useContent";

type LayoutContext = {
  theme: "light-theme" | "dark-theme";
};

type HeroContent = {
  headerPart1: string;
  headerPart2: string;
  highlightWords: string;
  subtext: string;
  primaryCta: string;
  secondaryCta: string;
  primaryCtaUrl: string;
  secondaryCtaUrl: string;
};

const DEFAULT_HERO: HeroContent = {
  headerPart1: "Affordable",
  headerPart2: "Solar Power for Every Filipino Home and Business",
  highlightWords: "Affordable",
  subtext: "We Provide Solar Solutions Tailored For Your Home And Business",
  primaryCta: "Calculate Your Savings",
  secondaryCta: "View Projects",
  primaryCtaUrl: "#calculator",
  secondaryCtaUrl: "/projects",
};

function renderHighlighted(text: string, highlights: string): React.ReactNode {
  const words = highlights.split(",").map((w) => w.trim()).filter(Boolean);
  if (!words.length) return text;
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);
  const lower = words.map((w) => w.toLowerCase());
  return parts.map((part, i) =>
    lower.includes(part.toLowerCase()) ? <span key={i}>{part}</span> : part
  );
}

export default function ASHero() {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const { theme } = useOutletContext<LayoutContext>();
  const hero = useContent<HeroContent>("hero", DEFAULT_HERO);

  const handleCtaClick = (url: string) => {
    if (url.startsWith("#")) {
      const el = document.getElementById(url.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(url);
    }
  };

  return (
    <section className="ASHero">
      <div className={`hero_video ${show ? "animate-video" : ""}`}>
        <video key={theme} autoPlay muted loop playsInline preload="none" poster="/preview.jpg">
          <source src={theme === "light-theme" ? lightBgWebm : darkBgWebm} type="video/webm" />
          <source src={theme === "light-theme" ? lightBg : darkBg} type="video/mp4" />
        </video>
      </div>

      <div className="hero_overlay_dark" />

      <div className="hero_banner_overlay">
        <div className="hero_text">
          <p className={`hero_header_text ${show ? "animate-in" : ""}`}>
            {renderHighlighted(
              `${hero.headerPart1} ${hero.headerPart2}`,
              hero.highlightWords ?? hero.headerPart1
            )}
          </p>

          <p className={`hero_subtext ${show ? "animate-in delay-1" : ""}`}>
            {hero.subtext}
          </p>

          <div
            className={`hero_action_buttons ${show ? "animate-in delay-2" : ""
              }`}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleCtaClick(hero.primaryCtaUrl ?? "#calculator")}
            >
              {hero.primaryCta}
            </button>

            <button
              type="button"
              className="btn btn-outline view_projects"
              onClick={() => handleCtaClick(hero.secondaryCtaUrl ?? "/projects")}
            >
              {hero.secondaryCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
