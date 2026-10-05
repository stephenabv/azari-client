import { useEffect, useMemo, useRef, useState } from "react";
import { useContent } from "../hooks/useContent";
import { BUSINESS } from "../config/business";

type FooterLink = {
  name: string;
  url: string;
};

// `phone` and `email` may still arrive from the footer CMS entry, but they are
// ignored: contact details always come from the business identity config so
// they cannot drift from the structured data.
type FooterData = {
  id?: string;
  phone?: string;
  email?: string;
  socials?: Record<string, FooterLink>;
  footer_text?: {
    credits?: string;
    privacy_policy?: FooterLink;
    terms_conditions?: FooterLink;
  };
};

const DEFAULT_FOOTER: Required<FooterData> = {
  id: "",
  phone: BUSINESS.phone.display,
  email: BUSINESS.email.address,
  socials: Object.fromEntries(
    BUSINESS.socials.map(({ key, name, url }) => [key, { name, url }])
  ),
  footer_text: {
    credits: "Designed by Orland Developed by Stephen & Adriel",
    privacy_policy: {
      name: "Privacy Policy",
      url: "https://azari.solar/privacy-policy",
    },
    terms_conditions: {
      name: "Terms and Conditions",
      url: "https://azari.solar/terms-and-conditions",
    },
  },
};

export default function ASFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const [isShown, setIsShown] = useState(false);
  const resolvedFooter = useContent<Required<FooterData>>("footer", DEFAULT_FOOTER);

  const socials = useMemo(() => {
    return Object.values(resolvedFooter.socials ?? {});
  }, [resolvedFooter.socials]);

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
          <a href={BUSINESS.email.mailtoHref} className="as-footer-link">
            {BUSINESS.email.address}
          </a>

          <a href={BUSINESS.phone.telHref} className="as-footer-link">
            {BUSINESS.phone.display}
          </a>

          <div className="as-footer-socials">
            {socials.map((item) => (
              <a
                key={item.name}
                href={item.url}
                className="as-footer-link"
                target="_blank"
                rel="noreferrer"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        <div className="as-footer-bottom">
          <span>{resolvedFooter.footer_text?.credits}</span>

          <div className="as-footer-bottom-links">
            <a
              href={resolvedFooter.footer_text?.privacy_policy?.url}
              target="_blank"
              rel="noreferrer"
            >
              {resolvedFooter.footer_text?.privacy_policy?.name}
            </a>

            <a
              href={resolvedFooter.footer_text?.terms_conditions?.url}
              target="_blank"
              rel="noreferrer"
            >
              {resolvedFooter.footer_text?.terms_conditions?.name}
            </a>

            <span>
              © {new Date().getFullYear()} Azari Solar. All Rights Reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
