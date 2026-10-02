import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "./as_talktoexpert.less";
import ASSystemError from "../system-error/ASSystemError";
import LocationAutocompleteInput, { type NominatimResult } from "../../components/ASLocationAutocomplete";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useLocale, useT, type MessageKey } from "../../i18n";
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

const CONTACT_EMAIL = "sales@azari.solar";

/** Inquiry types in display order; the value is the English code the API receives. */
const INQUIRY_TYPES: readonly TalkInquiryType[] = ["general", "quote", "consultation"];

/**
 * The shared validators in models/talk-to-expert return English sentences.
 * They are mapped to message keys here so the visitor reads them in their
 * language; anything unmapped is shown as-is.
 */
const VALIDATION_MESSAGE_KEYS: Readonly<Record<string, MessageKey>> = {
  "Please enter your name.": "inquiry.talk.errors.nameRequired",
  "Please enter your email address.": "inquiry.talk.errors.emailRequired",
  "Please enter a valid email address.": "inquiry.talk.errors.emailInvalid",
  "Please enter your mobile number.": "inquiry.talk.errors.phoneRequired",
  "Please enter a valid Philippine mobile number.": "inquiry.talk.errors.phoneInvalid",
  "Please select a province.": "inquiry.talk.errors.provinceRequired",
  "Please select a city.": "inquiry.talk.errors.cityRequired",
  "Please enter your message.": "inquiry.talk.errors.messageRequired",
  "Message must be at least 10 characters.": "inquiry.talk.errors.messageTooShort",
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
  const t = useT();
  const locale = useLocale();

  const errorText = (message: string | undefined): string => {
    if (!message) return "";
    const key = Object.prototype.hasOwnProperty.call(VALIDATION_MESSAGE_KEYS, message)
      ? VALIDATION_MESSAGE_KEYS[message]
      : undefined;
    return key ? t(key) : message;
  };

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

  useScrollLock(isOpen);

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
        body: JSON.stringify({
          ...buildTalkToExpertPayload(form, selectedProvince, selectedCity),
          locale: locale.tag,
        }),
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
          aria-label={t("inquiry.talk.closeAria")}
        >
          ×
        </button>

        {submitSuccess ? (
          <div className="as-talk-success">
            <div className="as-talk-success-icon">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M7 18.5L14.5 26L29 11" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>{t("inquiry.talk.successTitle")}</h3>
            <p>{t("inquiry.talk.successBody")}</p>
            <button type="button" className="as-talk-send as-talk-success-btn" onClick={handleClose}>
              {t("inquiry.talk.done")}
            </button>
          </div>
        ) : (
          <div className="as-talk-content">
            <div className="as-talk-info">
              <div>
                <h2>
                  {t("inquiry.talk.headlineLead")}
                  <span>{t("inquiry.talk.headlineAccent")}</span>
                  {t("inquiry.talk.headlineTail")}
                </h2>

                <p className="as-talk-intro">{t("inquiry.talk.intro")}</p>

                <a href={`mailto:${CONTACT_EMAIL}`} className="as-talk-email">
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div>
                <h3>{t("inquiry.talk.subheadline")}</h3>
                <p className="as-talk-subtext">{t("inquiry.talk.subtext")}</p>
              </div>
            </div>

            <form className="as-talk-form" onSubmit={handleSubmit} noValidate>
              <div className="as-talk-row">
                <label className="as-talk-field">
                  <span>{t("inquiry.talk.fields.name")}</span>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      handleFieldChange("name", event.target.value)
                    }
                    className={errors.name ? "has-warning" : ""}
                  />

                  {errors.name && (
                    <small className="as-talk-warning">{errorText(errors.name)}</small>
                  )}
                </label>

                <label className="as-talk-field">
                  <span>{t("inquiry.talk.fields.email")}</span>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      handleFieldChange("email", event.target.value)
                    }
                    className={errors.email ? "has-warning" : ""}
                  />

                  {errors.email && (
                    <small className="as-talk-warning">{errorText(errors.email)}</small>
                  )}
                </label>
              </div>

              <div className="as-talk-row">
                <label className="as-talk-field">
                  <span>{t("inquiry.talk.fields.phone")}</span>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      handleFieldChange("phone", event.target.value)
                    }
                    className={errors.phone ? "has-warning" : ""}
                  />

                  {errors.phone && (
                    <small className="as-talk-warning">{errorText(errors.phone)}</small>
                  )}
                </label>

                <label className="as-talk-field">
                  <span>{t("inquiry.talk.fields.province")}</span>

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
                    placeholder={t("inquiry.talk.fields.provincePlaceholder")}
                    inputClassName={errors.province ? "has-warning" : ""}
                  />

                  {errors.province && (
                    <small className="as-talk-warning">{errorText(errors.province)}</small>
                  )}
                </label>
              </div>

              <div className="as-talk-row">
                <label className="as-talk-field">
                  <span>{t("inquiry.talk.fields.city")}</span>

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
                    placeholder={t("inquiry.talk.fields.cityPlaceholder")}
                    inputClassName={errors.city ? "has-warning" : ""}
                  />

                  {errors.city && (
                    <small className="as-talk-warning">{errorText(errors.city)}</small>
                  )}
                </label>

                <label className="as-talk-field">
                  <span>{t("inquiry.talk.fields.inquiryType")}</span>

                  <select
                    value={form.inquiryType}
                    onChange={(event) =>
                      handleFieldChange(
                        "inquiryType",
                        event.target.value as TalkInquiryType
                      )
                    }
                  >
                    {INQUIRY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {t(`inquiry.talk.inquiryTypes.${type}`)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="as-talk-field">
                <span>{t("inquiry.talk.fields.message")}</span>

                <textarea
                  value={form.message}
                  onChange={(event) =>
                    handleFieldChange("message", event.target.value)
                  }
                  className={errors.message ? "has-warning" : ""}
                />

                {errors.message && (
                  <small className="as-talk-warning">{errorText(errors.message)}</small>
                )}
              </label>

              <div className="as-talk-actions">
                <button
                  type="button"
                  className="as-talk-cancel"
                  onClick={handleClose}
                >
                  {t("inquiry.common.cancel")}
                </button>

                <button
                  type="submit"
                  className="as-talk-send"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("inquiry.talk.sending") : t("inquiry.talk.send")}
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
