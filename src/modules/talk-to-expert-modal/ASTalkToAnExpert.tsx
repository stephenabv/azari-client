import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "./as_talktoexpert.less";
import ASSystemError from "../system-error/ASSystemError";
import LocationAutocompleteInput, { type NominatimResult } from "../../components/ASLocationAutocomplete";
import {
  buildTalkToExpertPayload,
  validateTalkToExpertField,
  validateTalkToExpertForm,
  type TalkInquiryType,
  type TalkToExpertFormData,
} from "../../models/talk-to-expert";
import { handleRateLimitResponse } from "../../services/ASContent";

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
  headline: "Let's Connect.",
  intro:
    "Have questions about solar? Whether you're curious about savings or just want to know if your roof is ready, we're here to help. No technical jargon, just honest advice.",
  subheadline: "Simple. Tough. Reliable.",
  subtext:
    "Bringing the power of the sun to every Filipino home. We handle the hard parts—the permits, the engineering, and the utility sync—so you can just enjoy the savings.",
};

const EMPTY_FORM: TalkToExpertFormData = {
  name: "",
  email: "",
  phone: "",
  inquiryType: "general",
  message: "",
};

export default function ASTalkToAnExpert({
  isOpen,
  onClose,
}: ASTalkToAnExpertProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const config: ASFooterConfig = DEFAULT_CONFIG;

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [form, setForm] = useState<TalkToExpertFormData>(EMPTY_FORM);

  const [errors, setErrors] = useState<
    Partial<Record<keyof TalkToExpertFormData | "province" | "city", string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSystemError, setShowSystemError] = useState(false);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setSelectedProvince("");
    setSelectedCity("");
    setErrors({});
    setShowSystemError(false);
    setSubmitSuccess(false);
  };

  useEffect(() => {
    if (isOpen) return;
    const timer = window.setTimeout(resetForm, 260);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

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

      if (handleRateLimitResponse(response)) {
        // Rate-limit banner is now visible with a countdown; close the modal
        // so the user can see it without a system-error dialog on top.
        handleClose();
        return;
      }

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

      setSubmitSuccess(true);
      window.setTimeout(() => handleClose(), 4000);
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

        {submitSuccess ? (
          <div className="as-talk-success">
            <div className="as-talk-success-icon">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18.5L14.5 26L29 11" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
            <button type="button" className="as-talk-send as-talk-success-btn" onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
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

                  <LocationAutocompleteInput
                    value={selectedProvince}
                    onChange={(val) => {
                      setSelectedProvince(val);
                      setErrors((prev) => ({
                        ...prev,
                        province: validateTalkToExpertField("province", "", val, selectedCity),
                      }));
                    }}
                    extractValue={(result) =>
                      result.address?.county ||
                      result.address?.state ||
                      result.address?.province ||
                      result.display_name.replace(/,\s*Philippines$/i, "").split(",")[0].trim()
                    }
                    onSelect={(result: NominatimResult) => {
                      const city =
                        result.address?.city ||
                        result.address?.town ||
                        result.address?.municipality ||
                        result.address?.city_district ||
                        "";
                      if (city && !selectedCity) {
                        setSelectedCity(city);
                        setErrors((prev) => ({
                          ...prev,
                          city: validateTalkToExpertField("city", "", selectedProvince, city),
                        }));
                      }
                    }}
                    placeholder="e.g., Metro Manila"
                    inputClassName={errors.province ? "has-warning" : ""}
                  />

                  {errors.province && (
                    <small className="as-talk-warning">{errors.province}</small>
                  )}
                </label>
              </div>

              <div className="as-talk-row">
                <label className="as-talk-field">
                  <span>City</span>

                  <LocationAutocompleteInput
                    value={selectedCity}
                    onChange={(val) => {
                      setSelectedCity(val);
                      setErrors((prev) => ({
                        ...prev,
                        city: validateTalkToExpertField("city", "", selectedProvince, val),
                      }));
                    }}
                    extractValue={(result) =>
                      result.address?.city ||
                      result.address?.town ||
                      result.address?.municipality ||
                      result.address?.city_district ||
                      result.display_name.replace(/,\s*Philippines$/i, "").split(",")[0].trim()
                    }
                    onSelect={(result: NominatimResult) => {
                      const province =
                        result.address?.county ||
                        result.address?.state ||
                        result.address?.province ||
                        "";
                      if (province && !selectedProvince) {
                        setSelectedProvince(province);
                        setErrors((prev) => ({
                          ...prev,
                          province: validateTalkToExpertField("province", "", province, selectedCity),
                        }));
                      }
                    }}
                    placeholder="e.g., Cebu City"
                    inputClassName={errors.city ? "has-warning" : ""}
                  />

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
        )}
      </div>

      {showSystemError && (
        <ASSystemError onClose={() => setShowSystemError(false)} />
      )}
    </div>,
    document.body
  );
}
