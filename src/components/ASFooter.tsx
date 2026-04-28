import { useEffect, useRef, useState } from "react";

export default function ASFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);
  const [isShown, setIsShown] = useState(false);

  const CONTACT_EMAIL = "sales@azari.solar";
  const CONTACT_PHONE = "+63 961 618 3436";

  const SOCIALS = ["Facebook", "Instagram", "TikTok"];

  const FOOTER_TEXT = {
    credit: "Designed by Orland Developed by Stephen & Adriel",
    privacy: "Privacy Policy",
    terms: "Terms and Condition",
    copyright: `© ${new Date().getFullYear()} Azari.Solar. All Rights Reserved.`,
  };

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
    >
      <div className="as-footer-bg as-footer-bg-logo" />
      <div className="as-footer-bg as-footer-bg-shape" />

      <div className="as-footer-content">
        <div className="as-footer-middle">
          <a href={`mailto:${CONTACT_EMAIL}`} className="as-footer-link">
            {CONTACT_EMAIL}
          </a>

          <a href={`tel:${CONTACT_PHONE}`} className="as-footer-link">
            {CONTACT_PHONE}
          </a>

          <div className="as-footer-socials">
            {SOCIALS.map((item) => (
              <span key={item} className="as-footer-link">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="as-footer-bottom">
          <span>{FOOTER_TEXT.credit}</span>

          <div className="as-footer-bottom-links">
            <a href="#privacy">{FOOTER_TEXT.privacy}</a>
            <a href="#terms">{FOOTER_TEXT.terms}</a>
            <span>{FOOTER_TEXT.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}