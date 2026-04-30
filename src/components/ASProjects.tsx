import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getCollectionData } from "../services/ASFirestore";

type ProjectCategory =
  | "All Projects"
  | "Recent Projects"
  | "Residential Projects"
  | "Commercial Projects"
  | "Industrial Projects";

type ProjectType = "Residential" | "Commercial" | "Industrial";

type FirestoreProject = {
  id: number | string;
  category?: ProjectType;
  title?: string;
  system?: string;
  savings?: string;
  image?: string;
  filter?: ProjectCategory[];
};

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

const DEFAULT_PROJECTS_DATA: Project[] = [];

function getProjectImagePath(image?: string) {
  if (!image) return "/images/projects/project-placeholder.jpg";

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

function getProjectFilters(project: FirestoreProject): ProjectCategory[] {
  if (project.filter?.length) {
    return project.filter;
  }

  const generatedFilters: ProjectCategory[] = ["All Projects", "Recent Projects"];

  if (project.category === "Residential") {
    generatedFilters.push("Residential Projects");
  }

  if (project.category === "Commercial") {
    generatedFilters.push("Commercial Projects");
  }

  if (project.category === "Industrial") {
    generatedFilters.push("Industrial Projects");
  }

  return generatedFilters;
}

function normalizeProject(project: FirestoreProject): Project {
  return {
    id: project.id,
    category: project.category ?? "Industrial",
    filter: getProjectFilters(project),
    title: project.title ?? "Untitled Project",
    system: project.system ?? "0",
    savings: project.savings ?? "₱0",
    image: getProjectImagePath(project.image),
  };
}

export default function ASProjects() {
  const [activeFilter, setActiveFilter] =
    useState<ProjectCategory>("All Projects");

  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS_DATA);

  const activeIndex = filters.indexOf(activeFilter);

  const filterRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    x: 0,
  });

  useEffect(() => {
    const unsubscribe = getCollectionData<FirestoreProject>(
      "ASProjects",
      (data) => {
        if (!data.length) {
          setProjects(DEFAULT_PROJECTS_DATA);
          return;
        }

        const firestoreProjects = data
          .filter((project) => project?.title && project?.system && project?.savings)
          .map(normalizeProject)
          .sort((a, b) => Number(a.id) - Number(b.id));

        setProjects(firestoreProjects.length ? firestoreProjects : DEFAULT_PROJECTS_DATA);
      }
    );

    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    const activeButton = filterRefs.current[activeIndex];

    if (!activeButton) return;

    setIndicatorStyle({
      width: activeButton.offsetWidth,
      x: activeButton.offsetLeft,
    });
  }, [activeIndex]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => project.filter.includes(activeFilter));
  }, [projects, activeFilter]);

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
          <div className="as-empty-visual">
            <div className="as-empty-sun" />
            <div className="as-empty-orbit" />
            <div className="as-empty-orbit delay" />

            <div className="as-empty-panels">
              <span />
              <span />
              <span />
            </div>

            <div className="as-empty-flow" />
          </div>

          <h3>Solar systems loading</h3>

          <p>
            We’re preparing real installation data, performance metrics, and
            savings insights. This section will be powered soon.
          </p>
        </div>
      )}
    </section>
  );
}