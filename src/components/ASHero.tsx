import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import darkBg from "../assets/videos/bg_hero_section_dark.mp4";
import lightBg from "../assets/videos/bg_hero_section_light.mp4";

type LayoutContext = {
  theme: "light-theme" | "dark-theme";
};

export default function ASHero() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { theme } = useOutletContext<LayoutContext>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const handleScrollToCalculator = () => {
    const element = document.getElementById("calculator");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleViewProjects = () => {
    navigate("/projects");
  };

  return (
    <section className="ASHero">
      <div className={`hero_video ${show ? "animate-video" : ""}`}>
        <video key={theme} autoPlay muted loop playsInline preload="auto">
          <source
            src={theme === "light-theme" ? lightBg : darkBg}
            type="video/mp4"
          />
        </video>
      </div>

      <div className="hero_overlay_dark" />

      <div className="hero_banner_overlay">
        <div className="hero_text">
          <p className={`hero_header_text ${show ? "animate-in delay-1" : ""}`}>
            <span>Affordable</span> Solar Power for Every
            <br className="hero_desktop_break" />
            <span> Filipino</span> Home and Business
          </p>

          <p className={`hero_subtext ${show ? "animate-in delay-2" : ""}`}>
            We Provide Solar Solutions Tailored For Your Home And Business
          </p>

          <div
            className={`hero_action_buttons ${show ? "animate-in delay-3" : ""
              }`}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleScrollToCalculator}
            >
              Calculate Your Savings
            </button>

            <button
              type="button"
              className="btn btn-outline view_projects"
              onClick={handleViewProjects}
            >
              View Projects
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}