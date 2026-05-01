import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "./as_talktoexpert.less";
import { getCollectionData } from "../../services/ASFirestore";

type ASTalkToAnExpertProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ASFooterConfig = {
  contact_email?: string;
  headline?: string;
  intro?: string;
  subheadline?: string;
  subtext?: string;
};

type ASAddressConfig = {
  province?: string[];
  cities?: Record<string, string[]>;
};

const DEFAULT_CONFIG: ASFooterConfig = {
  contact_email: "hello@azari.solar",
  headline: "Let’s Connect.",
  intro:
    "Have questions about solar? Whether you're curious about savings or just want to know if your roof is ready, we’re here to help. No technical jargon, just honest advice.",
  subheadline: "Simple. Tough. Reliable.",
  subtext:
    "Bringing the power of the sun to every Filipino home. We handle the hard parts—the permits, the engineering, and the utility sync—so you can just enjoy the savings.",
};

const FALLBACK_ADDRESS: ASAddressConfig = {
  province: ["Bohol", "Cebu", "Davao del Sur", "Metro Manila"],
  cities: {
    Bohol: ["Tagbilaran", "Panglao", "Loboc"],
    Cebu: ["Cebu City", "Mandaue", "Lapu-Lapu"],
    "Davao del Sur": ["Davao City"],
    "Metro Manila": ["Quezon City", "Makati", "Manila"],
  },
};

export default function ASTalkToAnExpert({
  isOpen,
  onClose,
}: ASTalkToAnExpertProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [config, setConfig] = useState<ASFooterConfig>(DEFAULT_CONFIG);

  const [addressConfig, setAddressConfig] =
    useState<ASAddressConfig>(FALLBACK_ADDRESS);

  const [selectedProvince, setSelectedProvince] = useState(
    FALLBACK_ADDRESS.province?.[0] || ""
  );

  const [selectedCity, setSelectedCity] = useState(
    FALLBACK_ADDRESS.cities?.[selectedProvince]?.[0] || ""
  );

  useEffect(() => {
    const unsubscribe = getCollectionData<ASFooterConfig>(
      "ASFooter",
      (data) => {
        const item = data[0];

        if (!item) {
          setConfig(DEFAULT_CONFIG);
          return;
        }

        setConfig({
          contact_email: item.contact_email || DEFAULT_CONFIG.contact_email,
          headline: item.headline || DEFAULT_CONFIG.headline,
          intro: item.intro || DEFAULT_CONFIG.intro,
          subheadline: item.subheadline || DEFAULT_CONFIG.subheadline,
          subtext: item.subtext || DEFAULT_CONFIG.subtext,
        });
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = getCollectionData<ASAddressConfig>(
      "ASAddress",
      (data) => {
        const item = data[0];

        if (!item || !item.province || !item.cities) {
          setAddressConfig(FALLBACK_ADDRESS);
          return;
        }

        setAddressConfig({
          province: item.province,
          cities: item.cities,
        });

        const firstProvince = item.province[0];
        setSelectedProvince(firstProvince);
        setSelectedCity(item.cities[firstProvince]?.[0] || "");
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;

    const original = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = original.overflow;
      document.body.style.position = original.position;
      document.body.style.top = original.top;
      document.body.style.width = original.width;

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);

    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 220);
  };

  const availableCities =
    addressConfig.cities?.[selectedProvince] || [];

  if (!isOpen) return null;

  return createPortal(
    <div className={`as-talk-overlay ${isClosing ? "is-closing" : ""}`}>
      <div
        className={`as-talk-modal ${isClosing ? "is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="as-talk-close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="as-talk-content">
          <div className="as-talk-info">
            <div>
              <h2>
                {config.headline?.includes("Connect") ? (
                  <>
                    {config.headline.replace("Connect", "")}
                    <span>Connect</span>.
                  </>
                ) : (
                  config.headline
                )}
              </h2>

              <p className="as-talk-intro">{config.intro}</p>

              <a href={`mailto:${config.contact_email}`} className="as-talk-email">
                {config.contact_email}
              </a>
            </div>

            <div>
              <h3>{config.subheadline}</h3>
              <p className="as-talk-subtext">{config.subtext}</p>
            </div>
          </div>

          <form className="as-talk-form">
            <div className="as-talk-row">
              <label className="as-talk-field">
                <span>How should we address you?</span>
                <input type="text" placeholder="Ex. John" />
              </label>

              <label className="as-talk-field">
                <span>Mobile Number</span>
                <input type="tel" placeholder="Ex. +63 961 618 3436" />
              </label>
            </div>

            <div className="as-talk-row">
              <label className="as-talk-field">
                <span>City</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>

              <label className="as-talk-field">
                <span>Province</span>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    const province = e.target.value;
                    setSelectedProvince(province);

                    const firstCity =
                      addressConfig.cities?.[province]?.[0] || "";
                    setSelectedCity(firstCity);
                  }}
                >
                  {addressConfig.province?.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="as-talk-field">
              <span>How can we help?</span>
              <select defaultValue="general">
                <option value="general">
                  I have some general questions about solar.
                </option>
                <option value="quote">I want to request a quotation.</option>
                <option value="consultation">
                  I want to schedule a consultation.
                </option>
              </select>
            </label>

            <label className="as-talk-field">
              <span>Message</span>
              <textarea placeholder="Tell us what's on your mind." />
            </label>

            <div className="as-talk-actions">
              <button
                type="button"
                className="as-talk-cancel"
                onClick={handleClose}
              >
                Cancel
              </button>

              <button type="submit" className="as-talk-send">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}