import { useLayoutEffect, useMemo, useRef, useState } from "react";

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

// const PROJECTS_DATA: Project[] = [];

const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    category: "Industrial",
    filter: ["All Projects", "Industrial Projects", "Recent Projects"],
    title: "Batangas Cold Storage",
    system: "3.2 MWp",
    savings: "₱12.4M",
    image: "/images/projects/project1.jpg",
  },
  {
    id: 2,
    category: "Industrial",
    filter: ["All Projects", "Industrial Projects", "Recent Projects"],
    title: "Makati Retail & Office",
    system: "850 kWp",
    savings: "₱4.2M",
    image: "/images/projects/project2.jpg",
  },
  {
    id: 3,
    category: "Industrial",
    filter: ["All Projects", "Industrial Projects"],
    title: "Nuvali High-Efficiency",
    system: "7.5 kWp",
    savings: "₱385K",
    image: "/images/projects/project3.jpg",
  },
  {
    id: 4,
    category: "Industrial",
    filter: ["All Projects", "Industrial Projects"],
    title: "Tarlac Poultry Farm",
    system: "100 kWp",
    savings: "₱2.8M",
    image: "/images/projects/project4.jpg",
  },
  {
    id: 5,
    category: "Residential",
    filter: ["All Projects", "Residential Projects", "Recent Projects"],
    title: "Tagaytay Glass House",
    system: "5.4 kWp",
    savings: "₱310K",
    image: "/images/projects/project5.jpg",
  },
  {
    id: 6,
    category: "Commercial",
    filter: ["All Projects", "Commercial Projects"],
    title: "Cebu IT Park Office",
    system: "450 kWp",
    savings: "₱5.1M",
    image: "/images/projects/project6.jpg",
  },
  {
    id: 7,
    category: "Residential",
    filter: ["All Projects", "Residential Projects"],
    title: "Cavite Net-Zero Subdivision",
    system: "12 kWp",
    savings: "₱680K",
    image: "/images/projects/project7.jpg",
  },
  {
    id: 8,
    category: "Commercial",
    filter: ["All Projects", "Commercial Projects", "Recent Projects"],
    title: "Pasig Lifestyle Retail",
    system: "620 kWp",
    savings: "₱7.4M",
    image: "/images/projects/project8.jpg",
  },
  {
    id: 9,
    category: "Industrial",
    filter: ["All Projects", "Industrial Projects"],
    title: "Davao Cold Chain Logistics",
    system: "1.5 MWp",
    savings: "₱10.2M",
    image: "/images/projects/project9.jpg",
  },
];

export default function ASProjects() {
  const [activeFilter, setActiveFilter] =
    useState<ProjectCategory>("All Projects");

  const activeIndex = filters.indexOf(activeFilter);

  const filterRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    x: 0,
  });

  useLayoutEffect(() => {
    const activeButton = filterRefs.current[activeIndex];

    if (!activeButton) return;

    setIndicatorStyle({
      width: activeButton.offsetWidth,
      x: activeButton.offsetLeft,
    });
  }, [activeIndex]);

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