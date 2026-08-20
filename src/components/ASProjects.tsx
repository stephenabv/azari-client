import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { fetchProjects, type ApiProject } from "../services/ASContent";
import { useSeoMeta } from "../hooks/useSeoMeta";
import ASImgLoader from "./ASImgLoader";
import logoAnimated from "../assets/animations/logo-animated.svg";

type ProjectCategory =
  | "All Projects"
  | "Recent Projects"
  | "Residential Projects"
  | "Commercial Projects"
  | "Industrial Projects";

type ProjectType = "Residential" | "Commercial" | "Industrial";

type Project = {
  id: number | string;
  category: ProjectType;
  filter: ProjectCategory[];
  title: string;
  system: string;
  savings: string;
  image: string;
};

const filters: ProjectCategory[] = [
  "All Projects",
  "Recent Projects",
  "Residential Projects",
  "Commercial Projects",
  "Industrial Projects",
];

function getYouTubeThumbnail(url?: string): string | null {
  if (!url) return null;
  const ytWatch = url.match(/youtube\.com\/watch\?.*v=([\w-]+)/);
  if (ytWatch) return `https://img.youtube.com/vi/${ytWatch[1]}/maxresdefault.jpg`;
  const ytShort = url.match(/youtu\.be\/([\w-]+)/);
  if (ytShort) return `https://img.youtube.com/vi/${ytShort[1]}/maxresdefault.jpg`;
  return null;
}

function getYouTubeFallbackThumbnail(src: string): string | null {
  if (!src.includes('img.youtube.com')) return null;
  if (src.includes('maxresdefault')) return src.replace('maxresdefault', 'mqdefault');
  return null;
}

function apiToProject(p: ApiProject): Project {
  const filter: ProjectCategory[] = ["All Projects", `${p.category} Projects` as ProjectCategory];
  if (p.isRecent) filter.push("Recent Projects");
  const thumbnail = getYouTubeThumbnail(p.videoUrl);
  return { id: p.id, title: p.title, category: p.category, system: p.system, savings: p.savings, image: thumbnail ?? p.imageUrl, filter };
}

export default function ASProjects() {
  useSeoMeta({
    title: "Solar Projects in Bohol, Philippines",
    description: "See completed residential and commercial solar installations by Azari Solar across Bohol and the Philippines. Real projects, real energy savings.",
    canonical: "https://azari.solar/projects",
  });
  const [activeFilter, setActiveFilter] =
    useState<ProjectCategory>("All Projects");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then((data) => setProjects(data.map(apiToProject)))
      .finally(() => setLoading(false));
  }, []);

  const activeIndex = filters.indexOf(activeFilter);

  const filterRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const filterRafRef = useRef<number>(0);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    x: 0,
  });

  useEffect(() => {
    const activeButton = filterRefs.current[activeIndex];
    if (!activeButton) return;
    cancelAnimationFrame(filterRafRef.current);
    filterRafRef.current = requestAnimationFrame(() => {
      const w = activeButton.offsetWidth;
      const x = activeButton.offsetLeft;
      setIndicatorStyle({ width: w, x });
    });
    return () => cancelAnimationFrame(filterRafRef.current);
  }, [activeIndex]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => project.filter.includes(activeFilter));
  }, [projects, activeFilter]);

  const hasProjectData = projects.length > 0;
  const emptyTitle = hasProjectData
    ? "Nothing in this view yet"
    : "Portfolio updates incoming";

  const emptyDescription = hasProjectData
    ? "Try a different filter to see other completed installations, savings snapshots, and system details."
    : "Project records have not been published yet. When the portfolio is available, this section will show completed installations, estimated savings, and system details.";

  return (
    <section className="as-projects-section">
      <div className="as-projects-header">
        <h2 className="as-projects-title">
          Our Solar Installations Portfolio
        </h2>

        <p className="as-projects-description">
          Proven Resilience. Quantifiable Savings. Explore our nationwide
          portfolio of engineering excellence—built for the tropics and designed
          for maximum ROI.
        </p>
      </div>

      <div className="as-projects-filters">
        <span
          className="as-projects-filter-indicator"
          style={{
            width: `${indicatorStyle.width}px`,
            transform: `translateX(${indicatorStyle.x}px)`,
          }}
        />

        {filters.map((filter, index) => (
          <button
            key={filter}
            ref={(el) => {
              filterRefs.current[index] = el;
            }}
            className={`as-projects-filter ${activeFilter === filter ? "active" : ""
              }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="as-projects-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="as-project-card-skeleton" aria-hidden="true">
              <div className="as-project-skeleton-image">
                <img src={logoAnimated} alt="" className="as-project-skeleton-logo" />
              </div>
              <div className="as-project-skeleton-body">
                <div className="as-project-skeleton-line as-project-skeleton-line--short" />
                <div className="as-project-skeleton-line" />
                <div className="as-project-skeleton-line as-project-skeleton-line--med" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="as-projects-grid">
          {filteredProjects.map((project, index) => (
            <Link
              className="as-project-card"
              key={project.id}
              to={`/projects/${project.id}`}
              style={{ animationDelay: `${index * 90}ms`, cursor: "pointer" }}
              aria-label={project.title}
            >
              <ASImgLoader
                src={project.image}
                alt={project.title}
                wrapClassName="as-img-loader-fill"
                onError={(e) => {
                  const fallback = getYouTubeFallbackThumbnail(e.currentTarget.src);
                  if (fallback) e.currentTarget.src = fallback;
                }}
              />
              <div className="as-project-card-shade" />

              <div className="as-project-card-content">
                <div className="as-project-card-top">
                  <p>{project.category}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
                    <line x1="5" y1="19" x2="19" y2="5" />
                    <polyline points="5 5 19 5 19 19" />
                  </svg>
                </div>

                <h3>{project.title}</h3>

                <div className="as-project-card-stats">
                  <div>
                    <span>System</span>
                    <strong>{project.system}</strong>
                  </div>

                  <div>
                    <span>Estimated Savings</span>
                    <strong>
                      {project.savings} <small>(10-Year)</small>
                    </strong>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="as-projects-empty">
          <div className="as-projects-empty-visual" aria-hidden="true">
            <div className="as-projects-empty-sun">
              <span />
            </div>

            <div className="as-projects-empty-line">
              <span className="as-projects-empty-line-pulse" />
            </div>

            <div className="as-projects-empty-panels">
              <i />
              <i />
              <i />
            </div>

            <div className="as-projects-empty-storage">
              <span className="as-projects-empty-storage-cap" />
              <span className="as-projects-empty-storage-level" />
            </div>
          </div>

          <p className="as-projects-empty-eyebrow">Azari Solar</p>

          <h3>{emptyTitle}</h3>

          <p>{emptyDescription}</p>

          {hasProjectData && activeFilter !== "All Projects" && (
            <button
              type="button"
              className="as-projects-empty-action"
              onClick={() => setActiveFilter("All Projects")}
            >
              Show all projects
            </button>
          )}
        </div>
      )}
    </section>
  );
}
