import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "./as_talktoexpert.less";
import ASSystemError from "../system-error/ASSystemError";
import {
  buildTalkToExpertPayload,
  validateTalkToExpertField,
  validateTalkToExpertForm,
  type AddressConfig,
  type TalkInquiryType,
  type TalkToExpertFormData,
} from "../../models/talk-to-expert";

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

const DEFAULT_CONFIG: ASFooterConfig = {
  contact_email: "sales@azari.solar",
  headline: "Let’s Connect.",
  intro:
    "Have questions about solar? Whether you're curious about savings or just want to know if your roof is ready, we’re here to help. No technical jargon, just honest advice.",
  subheadline: "Simple. Tough. Reliable.",
  subtext:
    "Bringing the power of the sun to every Filipino home. We handle the hard parts—the permits, the engineering, and the utility sync—so you can just enjoy the savings.",
};

const FALLBACK_ADDRESS: AddressConfig = {
  provinces: ["Bohol", "Cebu", "Davao del Sur", "Metro Manila"],
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
  const config: ASFooterConfig = DEFAULT_CONFIG;
  const addressConfig: AddressConfig = FALLBACK_ADDRESS;

  const [selectedProvince, setSelectedProvince] = useState(
    FALLBACK_ADDRESS.provinces[0]
  );

  const [selectedCity, setSelectedCity] = useState(
    FALLBACK_ADDRESS.cities[FALLBACK_ADDRESS.provinces[0]]?.[0] || ""
  );

  const [form, setForm] = useState<TalkToExpertFormData>({
    name: "",
    email: "",
    phone: "",
    inquiryType: "general",
    message: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TalkToExpertFormData | "province" | "city", string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSystemError, setShowSystemError] = useState(false);

  const handleFieldChange = (
    field: keyof TalkToExpertFormData,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "inquiryType" ? (value as TalkInquiryType) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]:
        field === "inquiryType"
          ? ""
          : validateTalkToExpertField(
              field,
              value,
              selectedProvince,
              selectedCity
            ),
    }));
  };

  const validateForm = () => {
    const newErrors = validateTalkToExpertForm(
      form,
      selectedProvince,
      selectedCity
    );

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };



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

  const availableCities = addressConfig.cities[selectedProvince] || [];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setShowSystemError(false);

      const response = await fetch("/api/talk/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          buildTalkToExpertPayload(form, selectedProvince, selectedCity)
        ),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        console.error("API failed:", {
          status: response.status,
          message: data?.message,
          systemError: data?.error,
        });

        setShowSystemError(true);
        return;
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        inquiryType: "general",
        message: "",
      });

      setErrors({});
      handleClose();
    } catch (error) {
      console.error("System error:", error);
      setShowSystemError(true);
    } finally {
      setIsSubmitting(false);
    }
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

              <a
                href={`mailto:${config.contact_email}`}
                className="as-talk-email"
              >
                {config.contact_email}
              </a>
            </div>

            <div>
              <h3>{config.subheadline}</h3>
              <p className="as-talk-subtext">{config.subtext}</p>
            </div>
          </div>

          <form className="as-talk-form" onSubmit={handleSubmit} noValidate>
            <div className="as-talk-row">
              <label className="as-talk-field">
                <span>How should we address you?</span>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    handleFieldChange("name", event.target.value)
                  }
                  className={errors.name ? "has-warning" : ""}
                />

                {errors.name && (
                  <small className="as-talk-warning">{errors.name}</small>
                )}
              </label>

              <label className="as-talk-field">
                <span>Email Address</span>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    handleFieldChange("email", event.target.value)
                  }
                  className={errors.email ? "has-warning" : ""}
                />

                {errors.email && (
                  <small className="as-talk-warning">{errors.email}</small>
                )}
              </label>
            </div>

            <div className="as-talk-row">
              <label className="as-talk-field">
                <span>Mobile Number</span>

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    handleFieldChange("phone", event.target.value)
                  }
                  className={errors.phone ? "has-warning" : ""}
                />

                {errors.phone && (
                  <small className="as-talk-warning">{errors.phone}</small>
                )}
              </label>

              <label className="as-talk-field">
                <span>Province</span>

                <select
                  value={selectedProvince}
                  onChange={(event) => {
                    const province = event.target.value;
                    const city = addressConfig.cities[province]?.[0] || "";

                    setSelectedProvince(province);
                    setSelectedCity(city);

                    setErrors((prev) => ({
                      ...prev,
                      province: validateTalkToExpertField(
                        "province",
                        "",
                        province,
                        city
                      ),
                      city: validateTalkToExpertField(
                        "city",
                        "",
                        province,
                        city
                      ),
                    }));
                  }}
                  className={errors.province ? "has-warning" : ""}
                >
                  {addressConfig.provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>

                {errors.province && (
                  <small className="as-talk-warning">{errors.province}</small>
                )}
              </label>
            </div>

            <div className="as-talk-row">
              <label className="as-talk-field">
                <span>City</span>

                <select
                  value={selectedCity}
                  onChange={(event) => {
                    const city = event.target.value;

                    setSelectedCity(city);

                    setErrors((prev) => ({
                      ...prev,
                      city: validateTalkToExpertField(
                        "city",
                        "",
                        selectedProvince,
                        city
                      ),
                    }));
                  }}
                  className={errors.city ? "has-warning" : ""}
                >
                  {availableCities.length > 0 ? (
                    availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))
                  ) : (
                    <option value="">No city available</option>
                  )}
                </select>

                {errors.city && (
                  <small className="as-talk-warning">{errors.city}</small>
                )}
              </label>

              <label className="as-talk-field">
                <span>How can we help?</span>

                <select
                  value={form.inquiryType}
                  onChange={(event) =>
                    handleFieldChange(
                      "inquiryType",
                      event.target.value as TalkInquiryType
                    )
                  }
                >
                  <option value="general">General inquiry</option>
                  <option value="quote">Request quotation</option>
                  <option value="consultation">Consultation</option>
                </select>
              </label>
            </div>

            <label className="as-talk-field">
              <span>Message</span>

              <textarea
                value={form.message}
                onChange={(event) =>
                  handleFieldChange("message", event.target.value)
                }
                className={errors.message ? "has-warning" : ""}
              />

              {errors.message && (
                <small className="as-talk-warning">{errors.message}</small>
              )}
            </label>

            <div className="as-talk-actions">
              <button
                type="button"
                className="as-talk-cancel"
                onClick={handleClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="as-talk-send"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSystemError && (
        <ASSystemError onClose={() => setShowSystemError(false)} />
      )}
    </div>,
    document.body
  );
}
