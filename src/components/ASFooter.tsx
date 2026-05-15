import { useEffect, useMemo, useRef, useState } from "react";

type FooterLink = {
  name: string;
  url: string;
};

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
  phone: "+63 961 618 3436",
  email: "sales@azari.solar",
  socials: {
    facebook: {
      name: "Facebook",
      url: "https://www.facebook.com",
    },
    Instagram: {
      name: "Instagram",
      url: "https://www.instagram.com",
    },
    TikTok: {
      name: "TikTok",
      url: "https://www.tiktok.com",
    },
  },
  footer_text: {
    credits: "Designed by Orland Developed by Stephen & Adriel",
    privacy_policy: {
      name: "Privacy Policy",
      url: "https://azari.solar/privacy-terms",
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
  const resolvedFooter = DEFAULT_FOOTER;

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
          <a
            href={`mailto:${resolvedFooter.email}`}
            className="as-footer-link"
          >
            {resolvedFooter.email}
          </a>

          <a
            href={`tel:${resolvedFooter.phone}`}
            className="as-footer-link"
          >
            {resolvedFooter.phone}
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
              © {new Date().getFullYear()} Azari.Solar. All Rights Reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}