import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "./as_talktoexpert.less";

type ASTalkToAnExpertProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ASTalkToAnExpert({
  isOpen,
  onClose,
}: ASTalkToAnExpertProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);

    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 220);
  };

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
                Let’s <span>Connect</span>.
              </h2>

              <p className="as-talk-intro">
                Have questions about solar? Whether you're curious about savings
                or just want to know if your roof is ready, we’re here to help.
                No technical jargon, just honest advice.
              </p>

              <a href="mailto:hello@azari.solar" className="as-talk-email">
                hello@azari.solar
              </a>
            </div>

            <div>
              <h3>Simple. Tough. Reliable.</h3>
              <p className="as-talk-subtext">
                Bringing the power of the sun to every Filipino home. We handle
                the hard parts—the permits, the engineering, and the utility
                sync—so you can just enjoy the savings.
              </p>
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
                <select defaultValue="Tagbilaran">
                  <option value="Tagbilaran">Tagbilaran</option>
                  <option value="Cebu">Cebu</option>
                  <option value="Davao">Davao</option>
                  <option value="Manila">Manila</option>
                </select>
              </label>

              <label className="as-talk-field">
                <span>Province</span>
                <select defaultValue="Bohol">
                  <option value="Bohol">Bohol</option>
                  <option value="Cebu">Cebu</option>
                  <option value="Davao del Sur">Davao del Sur</option>
                  <option value="Metro Manila">Metro Manila</option>
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