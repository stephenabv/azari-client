import { useEffect, useRef, useState } from "react";

export default function ASFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);
  const [isShown, setIsShown] = useState(false);

  const email = "customersupport@azari.solar";
  const phone = "+63 961 618 3465";
  const year = new Date().getFullYear();

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;
        setIsShown(true);
        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`as-footer ${isShown ? "is-shown" : ""}`}
      id="talktous"
    >
      <div className="as-footer-bg as-footer-bg-logo" />
      <div className="as-footer-bg as-footer-bg-shape" />
      <div className="as-footer-overlay" />

      <div className="as-footer-content">
        <div className="as-footer-middle">
          <a href={`mailto:${email}`} className="as-footer-link">
            {email}
          </a>

          <a href={`tel:${phone}`} className="as-footer-link">
            {phone}
          </a>

          <a href="#socials" className="as-footer-link as-footer-socials">
            Socials
          </a>
        </div>

        <div className="as-footer-bottom">
          <span>Designed by Orland Developed by Adriel</span>

          <div className="as-footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms and Condition</a>
            <span>© {year} Azari Solar. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}