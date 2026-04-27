import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import darkBg from "../assets/videos/bg_hero_section_dark.mp4";
import lightBg from "../assets/videos/bg_hero_section_light.mp4";

export default function ASHero() {
  const [show, setShow] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 300);

    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("light-theme")) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (document.body.classList.contains("light-theme")) {
      setTheme("light");
    }

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
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
    <div className="ASHero">
      <div className={`hero_video ${show ? "animate-video" : ""}`}>
        <video key={theme} autoPlay muted loop playsInline preload="auto">
          <source src={theme === "light" ? lightBg : darkBg} type="video/mp4" />
        </video>
      </div>

      <div className="hero_overlay_dark" />

      <div className="hero_banner_overlay">
        <div className="hero_text">
          <p
            className={`hero_header_text ${show ? "animate-in delay-1" : ""}`}
          >
            <span>Affordable</span> Solar Power for Every
            <br />
            <span>Filipino</span> Home and Business
          </p>

          <p
            className={`hero_subtext ${show ? "animate-in delay-2" : ""}`}
          >
            We Provide Solar Solutions Tailored For Your Home And Business
          </p>

          <div
            className={`hero_action_buttons ${
              show ? "animate-in delay-3" : ""
            }`}
          >
            <button
              className="btn btn-primary"
              onClick={handleScrollToCalculator}
            >
              Calculate Your Savings
            </button>

            <button
              className="btn btn-outline"
              onClick={handleViewProjects}
            >
              View Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}