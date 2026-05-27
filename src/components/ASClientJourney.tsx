import { useState, useRef, useEffect, useCallback } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import iconSolar from "../assets/icons/icon-solar.svg";
import iconHighlight from "../assets/icons/icon-highlight.svg";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  testimonial: string;
  hasVideo: boolean;
  coords: [number, number];
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Santos Family",
    location: "Quezon City, Metro Manila",
    testimonial:
      "Our Meralco bill dropped by 87% in the first month. The team handled the entire Net-Metering application perfectly, and now we literally earn credits while we sleep. It's the best investment we've made for our home's future.",
    hasVideo: true,
    coords: [121.05, 14.68],
  },
  {
    id: 2,
    name: "Cruz Commercial",
    location: "Cebu City, Cebu",
    testimonial:
      "Operating costs dropped significantly since we installed our solar array. The team handled everything from permits to final inspection. Our system gives us enough buffer even through the peak season.",
    hasVideo: false,
    coords: [123.90, 10.32],
  },
  {
    id: 3,
    name: "Reyes Residence",
    location: "Davao City, Davao del Sur",
    testimonial:
      "We were skeptical at first, but the numbers don't lie. Within 18 months we recovered a significant portion of our investment. The monitoring app lets us see exactly how much we save in real time.",
    hasVideo: true,
    coords: [125.61, 7.07],
  },
  {
    id: 4,
    name: "De Leon Residence",
    location: "Angeles City, Pampanga",
    testimonial:
      "Professional installation completed in just two days. Our home now runs entirely on solar during daytime hours. We highly recommend Azari to anyone considering the switch to renewable energy.",
    hasVideo: false,
    coords: [120.59, 15.15],
  },
  {
    id: 5,
    name: "Garcia Business",
    location: "Iloilo City, Iloilo",
    testimonial:
      "As a business owner, the ROI was clear from the start. Our electricity expenses went from our highest operating cost to nearly negligible. The after-sales support has been exceptional as well.",
    hasVideo: false,
    coords: [122.57, 10.72],
  },
  {
    id: 6,
    name: "Torres Family",
    location: "Batangas City, Batangas",
    testimonial:
      "Consistent monthly savings since day one. The process from quotation to installation was seamless, and the monitoring app keeps us informed about our energy generation at all times.",
    hasVideo: true,
    coords: [121.05, 13.76],
  },
  {
    id: 7,
    name: "Chua Enterprise",
    location: "Cagayan de Oro, Misamis Oriental",
    testimonial:
      "We installed a 50kWp commercial system across our warehouse rooftops. The project was completed on schedule and within budget. We're already planning to expand to our other facilities.",
    hasVideo: false,
    coords: [124.63, 8.48],
  },
];

const SVG_W = 200;
const SVG_H = 370;

let _cachedPathD: string | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _cachedProj: any = null;

function usePhilippinesMap() {
  const [state, setState] = useState<{
    pathD: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    proj: any;
  } | null>(
    _cachedPathD && _cachedProj
      ? { pathD: _cachedPathD, proj: _cachedProj }
      : null
  );

  useEffect(() => {
    if (_cachedPathD && _cachedProj) return;

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
      .then(r => r.json())
      .then((world: Topology) => {
        const countries = feature(
          world,
          world.objects.countries as GeometryCollection
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ph = (countries as any).features.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (f: any) => String(f.id) === "608"
        );
        if (!ph) return;

        const proj = geoMercator().fitExtent(
          [[18, 18], [SVG_W - 18, SVG_H - 18]],
          ph
        );
        const pathGen = geoPath().projection(proj);
        const pathD = pathGen(ph) ?? "";

        _cachedPathD = pathD;
        _cachedProj = proj;
        setState({ pathD, proj });
      })
      .catch(err => console.error("Failed to load Philippines map:", err));
  }, []);

  return state;
}

function PhilippinesMap({
  testimonials,
  activeIndex,
  onMarkerClick,
}: {
  testimonials: Testimonial[];
  activeIndex: number;
  onMarkerClick: (i: number) => void;
}) {
  const map = usePhilippinesMap();

  return (
    <svg
      className="as-journey-map"
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Philippines map showing client locations"
    >
      <defs>
        <pattern id="ph-dot-grid" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" style={{ fill: 'var(--map-grout)' }} />
          <rect x="0.75" y="0.75" width="6.5" height="6.5" rx="0.5" style={{ fill: 'var(--map-tile)' }} />
        </pattern>
        {map && (
          <clipPath id="ph-shape">
            <path d={map.pathD} />
          </clipPath>
        )}
      </defs>

      {map && (
        <rect
          x="0" y="0" width={SVG_W} height={SVG_H}
          fill="url(#ph-dot-grid)"
          clipPath="url(#ph-shape)"
        />
      )}

      {map &&
        testimonials.map((t, i) => {
          const point = map.proj(t.coords);
          if (!point) return null;
          const [x, y] = point;
          const active = i === activeIndex;

          return (
            <g
              key={t.id}
              transform={`translate(${x},${y})`}
              className={`as-ph-marker${active ? " is-active" : ""}`}
              onClick={() => onMarkerClick(i)}
              role="button"
              aria-label={`${t.name} – ${t.location}`}
            >
                {active && (
                <image
                  href={iconHighlight}
                  x="-9" y="-9" width="18" height="18"
                  className="as-ph-marker-ring"
                />
              )}
              <image
                href={iconSolar}
                x="-5" y="-7" width="10" height="12"
              />
            </g>
          );
        })}
    </svg>
  );
}

export default function ASClientJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(420);
  const sectionRef = useRef<HTMLElement | null>(null);
  const firstSlideRef = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const CARD_GAP = 20;

  useEffect(() => {
    const el = firstSlideRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSlideWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        setIsVisible(true);
        io.disconnect();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, TESTIMONIALS.length - 1)));
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`ASClientJourney${isVisible ? " is-visible" : ""}`}
    >
      <div className="as-journey-left">
        <h2 className="as-journey-title">
          Our clients journey to<br />Energy Independence
        </h2>

        <div className="as-journey-carousel-wrapper">
          <div
            className="as-journey-track"
            style={{ transform: `translateX(-${activeIndex * (slideWidth + CARD_GAP)}px)` }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.id}
                ref={i === 0 ? firstSlideRef : undefined}
                className="as-journey-slide"
              >
                <div className="as-journey-card-image">
                  <div className="as-journey-img-placeholder" />
                  <button className="as-journey-watch-btn">
                    WATCH THE VIDEO
                  </button>
                </div>

                <div className="as-journey-info">
                  <div className="as-journey-name-row">
                    <strong className="as-journey-name">{t.name}</strong>
                    <span className="as-journey-location">{t.location}</span>
                  </div>
                  <p className="as-journey-testimonial">{t.testimonial}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="as-journey-nav">
          <button
            className="as-journey-nav-btn"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L1 7L7 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="as-journey-counter">
            {activeIndex + 1}/{TESTIMONIALS.length}
          </span>
          <button
            className="as-journey-nav-btn"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === TESTIMONIALS.length - 1}
            aria-label="Next"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="as-journey-right">
        <PhilippinesMap
          testimonials={TESTIMONIALS}
          activeIndex={activeIndex}
          onMarkerClick={goTo}
        />
      </div>
    </section>
  );
}
