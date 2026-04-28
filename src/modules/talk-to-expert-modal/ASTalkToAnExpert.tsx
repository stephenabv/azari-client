import { useCallback, useEffect, useMemo, useState } from "react";
import "./as_talktoexpert.less";

type ASTalkToAnExpertProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormValues = {
  name: string;
  mobileNumber: string;
  city: string;
  province: string;
  concern: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const CLOSE_ANIMATION_DURATION = 250;

const TALK_TO_EXPERT_CONTENT = {
  titlePrefix: "Let’s",
  titleHighlight: "Connect",
  description:
    "Have questions about solar? Whether you're curious about savings or just want to know if your roof is ready, we’re here to help. No technical jargon, just honest advice.",
  email: "hello@azari.solar",
  footerTitle: "Simple. Tough. Reliable.",
  footerDescription:
    "Bringing the power of the sun to every Filipino home. We handle the hard parts—the permits, the engineering, and the utility sync—so you can just enjoy the savings.",
};

const FORM_OPTIONS = {
  cities: ["Tagbilaran", "Dauis", "Panglao", "Cebu City", "Mandaue"],
  provinces: ["Bohol", "Cebu", "Negros Oriental", "Leyte"],
  concerns: [
    "I have some general questions about solar.",
    "I want to request a quotation.",
    "I want to know if my roof is ready.",
    "I need help with an existing solar system.",
  ],
};

const INITIAL_FORM_VALUES: FormValues = {
  name: "",
  mobileNumber: "",
  city: "",
  province: "",
  concern: "",
  message: "",
};

function validateForm(values: FormValues) {
  const errors: FormErrors = {};
  const cleanMobile = values.mobileNumber.replace(/\s+/g, "");
  const mobilePattern = /^(\+63|0)?9\d{9}$/;

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.mobileNumber.trim()) {
    errors.mobileNumber = "Please enter your mobile number.";
  } else if (!mobilePattern.test(cleanMobile)) {
    errors.mobileNumber = "Please enter a valid Philippine mobile number.";
  }

  if (!values.city.trim()) {
    errors.city = "Please select your city.";
  }

  if (!values.province.trim()) {
    errors.province = "Please select your province.";
  }

  if (!values.concern.trim()) {
    errors.concern = "Please select how we can help.";
  }

  if (!values.message.trim()) {
    errors.message = "Please enter your message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }

  return errors;
}

export default function ASTalkToAnExpert({
  isOpen,
  onClose,
}: ASTalkToAnExpertProps) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isFormValid = useMemo(() => {
    return Object.keys(validateForm(formValues)).length === 0;
  }, [formValues]);

  const handleClose = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);

    window.setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      document.body.style.overflow = "";
      onClose();
    }, CLOSE_ANIMATION_DURATION);
  }, [isClosing, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    setIsVisible(true);
    setIsClosing(false);
    document.body.style.overflow = "hidden";
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, handleClose]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (hasSubmitted) {
        setFormErrors(validateForm(next));
      }

      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasSubmitted(true);

    const errors = validateForm(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    console.log("Talk to expert form values:", formValues);
  };

  if (!isVisible) return null;

  return (
    <div className={`as-modal-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`as-modal ${isClosing ? "closing" : ""}`}>
        <button
          type="button"
          className="as-modal-close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="as-modal-content">
          <div className="as-modal-left">
            <h2>
              {TALK_TO_EXPERT_CONTENT.titlePrefix}{" "}
              <span>{TALK_TO_EXPERT_CONTENT.titleHighlight}</span>.
            </h2>

            <p className="as-modal-subtext">
              {TALK_TO_EXPERT_CONTENT.description}
            </p>

            <a
              href={`mailto:${TALK_TO_EXPERT_CONTENT.email}`}
              className="as-modal-email"
            >
              {TALK_TO_EXPERT_CONTENT.email}
            </a>

            <div className="as-modal-footer-text">
              <h4>{TALK_TO_EXPERT_CONTENT.footerTitle}</h4>
              <p>{TALK_TO_EXPERT_CONTENT.footerDescription}</p>
            </div>
          </div>

          <form className="as-modal-right" onSubmit={handleSubmit} noValidate>
            <div className="as-form-grid">
              <div className="as-form-field">
                <label htmlFor="expert-name">How should we address you?</label>
                <input
                  id="expert-name"
                  value={formValues.name}
                  placeholder="Ex. John"
                  onChange={(event) => handleChange("name", event.target.value)}
                  className={formErrors.name ? "has-error" : ""}
                />
                {formErrors.name && (
                  <p className="as-form-error">{formErrors.name}</p>
                )}
              </div>

              <div className="as-form-field">
                <label htmlFor="expert-mobile">Mobile Number</label>
                <input
                  id="expert-mobile"
                  value={formValues.mobileNumber}
                  placeholder="Ex. +63 961 618 3436"
                  inputMode="tel"
                  onChange={(event) =>
                    handleChange("mobileNumber", event.target.value)
                  }
                  className={formErrors.mobileNumber ? "has-error" : ""}
                />
                {formErrors.mobileNumber && (
                  <p className="as-form-error">{formErrors.mobileNumber}</p>
                )}
              </div>

              <div className="as-form-field">
                <label htmlFor="expert-city">City</label>
                <select
                  id="expert-city"
                  value={formValues.city}
                  onChange={(event) => handleChange("city", event.target.value)}
                  className={formErrors.city ? "has-error" : ""}
                >
                  <option value="">Select city</option>
                  {FORM_OPTIONS.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {formErrors.city && (
                  <p className="as-form-error">{formErrors.city}</p>
                )}
              </div>

              <div className="as-form-field">
                <label htmlFor="expert-province">Province</label>
                <select
                  id="expert-province"
                  value={formValues.province}
                  onChange={(event) =>
                    handleChange("province", event.target.value)
                  }
                  className={formErrors.province ? "has-error" : ""}
                >
                  <option value="">Select province</option>
                  {FORM_OPTIONS.provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {formErrors.province && (
                  <p className="as-form-error">{formErrors.province}</p>
                )}
              </div>
            </div>

            <div className="as-form-field as-form-full">
              <label htmlFor="expert-concern">How can we help?</label>
              <select
                id="expert-concern"
                value={formValues.concern}
                onChange={(event) =>
                  handleChange("concern", event.target.value)
                }
                className={formErrors.concern ? "has-error" : ""}
              >
                <option value="">Select concern</option>
                {FORM_OPTIONS.concerns.map((concern) => (
                  <option key={concern} value={concern}>
                    {concern}
                  </option>
                ))}
              </select>
              {formErrors.concern && (
                <p className="as-form-error">{formErrors.concern}</p>
              )}
            </div>

            <div className="as-form-field as-form-full">
              <label htmlFor="expert-message">Message</label>
              <textarea
                id="expert-message"
                value={formValues.message}
                placeholder="Tell us what's on your mind."
                onChange={(event) =>
                  handleChange("message", event.target.value)
                }
                className={formErrors.message ? "has-error" : ""}
              />
              {formErrors.message && (
                <p className="as-form-error">{formErrors.message}</p>
              )}
            </div>

            <div className="as-form-actions">
              <button
                type="button"
                className="as-btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="as-btn-primary"
                disabled={hasSubmitted && !isFormValid}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}