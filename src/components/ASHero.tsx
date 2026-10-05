import React from "react";
import { useNavigate, useOutletContext } from "react-router";
import darkBg from "../assets/videos/web/hero-dark.mp4";
import darkBgWebm from "../assets/videos/web/hero-dark.webm";
import lightBg from "../assets/videos/web/hero-light.mp4";
import lightBgWebm from "../assets/videos/web/hero-light.webm";
import { useContent } from "../hooks/useContent";
import type { LayoutContext } from "../layout/ASMainLayout";
import { immediateStrategy } from "../media/loadStrategies";
import { LazyVideo, type VideoSource } from "./media/LazyVideo";

const HERO_VIDEOS: Record<LayoutContext["theme"], readonly VideoSource[]> = {
  "dark-theme": [
    { src: darkBgWebm, type: "video/webm" },
    { src: darkBg, type: "video/mp4" },
  ],
  "light-theme": [
    { src: lightBgWebm, type: "video/webm" },
    { src: lightBg, type: "video/mp4" },
  ],
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
  const navigate = useNavigate();
  const { theme, themeReady } = useOutletContext<LayoutContext>();
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
      {/* Only the active theme's video downloads, and only once the theme is
          known. Its first frame is painted underneath as the section's CSS
          background (as_hero.less). */}
      <LazyVideo
        className="hero_video animate-video"
        sources={HERO_VIDEOS[theme]}
        strategy={immediateStrategy}
        enabled={themeReady}
      />

      <div className="hero_overlay_dark" />

      <div className="hero_banner_overlay">
        <div className="hero_text">
          <h1 className="hero_header_text animate-in">
            {renderHighlighted(
              `${hero.headerPart1} ${hero.headerPart2}`,
              hero.highlightWords ?? hero.headerPart1
            )}
          </h1>

          <p className="hero_subtext animate-in delay-1">
            {hero.subtext}
          </p>

          <div
            className="hero_action_buttons animate-in delay-2"
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
