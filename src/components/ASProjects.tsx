import { useMemo, useState } from "react";

type ProjectCategory =
  | "All Projects"
  | "Recent Projects"
  | "Residential Projects"
  | "Commercial Projects"
  | "Industrial Projects";

type Project = {
  id: number;
  category: "Residential" | "Commercial" | "Industrial";
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

const PROJECTS_DATA: Project[] = [
  // (still empty / commented)
];

export default function ASProjects() {
  const [activeFilter, setActiveFilter] =
    useState<ProjectCategory>("All Projects");

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((project) =>
      project.filter.includes(activeFilter)
    );
  }, [activeFilter]);

  return (
    <section className="as-projects-section">
      <div className="as-projects-header">
        <h2 className="as-projects-title">
          Our Clients journey to <span>Energy Independence</span>
        </h2>

        <p className="as-projects-description">
          Proven Resilience. Quantifiable Savings. Explore our nationwide
          portfolio of engineering excellence—built for the tropics and designed
          for maximum ROI.
        </p>
      </div>

      <div className="as-projects-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`as-projects-filter ${activeFilter === filter ? "active" : ""
              }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ✅ FIXED: conditional wrapper instead of grid wrapping everything */}
      {filteredProjects.length > 0 ? (
        <div className="as-projects-grid">
          {filteredProjects.map((project, index) => (
            <article
              className="as-project-card"
              key={project.id}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <img src={project.image} alt={project.title} />

              <div className="as-project-card-shade" />

              <div className="as-project-card-content">
                <div className="as-project-card-top">
                  <p>{project.category}</p>
                  <span className="as-project-arrow">↗</span>
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
            </article>
          ))}
        </div>
      ) : (
        <div className="as-projects-empty">
          <p>----- No data to show -----</p>
        </div>
      )}
    </section>
  );
}