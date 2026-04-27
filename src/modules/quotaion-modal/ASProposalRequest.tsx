import { useState } from "react";

type ProposalFormData = {
  fullName: string;
  location: string;
  email: string;
  phone: string;
  message: string;
};

type FormErrors = Partial<Record<keyof ProposalFormData, string>>;

type RequestProposalModalProps = {
  onClose: () => void;
  onSubmit: (formData: ProposalFormData) => void | Promise<void>;
  isSubmitting?: boolean;
};

const blockedEmailDomains = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "fakeinbox.com",
];

const nameRegex = /^[A-Za-z0-9 .-]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const locationRegex = /^[A-Za-z0-9Ññ .,'#/()-]+$/;
const phoneRegex = /^((\+63|0)9\d{9}|(\+63|0)?[2-8]\d{6,9})$/;

function validateField(
  field: keyof ProposalFormData,
  value: string
): string {
  const trimmedValue = value.trim();

  if (field === "fullName") {
    if (!trimmedValue) return "Name is required.";
    if (trimmedValue.length < 2) return "Name must be at least 2 characters.";
    if (trimmedValue.length > 80) return "Name must not exceed 80 characters.";
    if (!nameRegex.test(trimmedValue)) {
      return "Name can only contain letters, numbers, spaces, hyphen, and period.";
    }
  }

  if (field === "location") {
    if (!trimmedValue) return "Location is required.";
    if (trimmedValue.length < 3) {
      return "Location must be at least 3 characters.";
    }
    if (trimmedValue.length > 160) {
      return "Location must not exceed 160 characters.";
    }
    if (!locationRegex.test(trimmedValue)) {
      return "Location contains invalid characters.";
    }
  }

  if (field === "email") {
    const email = trimmedValue.toLowerCase();
    const emailDomain = email.split("@")[1];

    if (!email) return "Email address is required.";
    if (email.length > 120) return "Email must not exceed 120 characters.";
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (blockedEmailDomains.includes(emailDomain)) {
      return "Disposable or temporary email domains are not allowed.";
    }
  }

  if (field === "phone") {
    const phone = trimmedValue.replace(/[\s-]/g, "");

    if (!phone) return "Phone number is required.";
    if (!phoneRegex.test(phone)) {
      return "Enter a valid telephone or cellphone number. Example: +639123456789, 09123456789, or 0381234567.";
    }
  }

  if (field === "message") {
    if (trimmedValue.length > 500) {
      return "Additional notes must not exceed 500 characters.";
    }
  }

  return "";
}

function validateForm(data: ProposalFormData) {
  const newErrors: FormErrors = {};

  Object.entries(data).forEach(([field, value]) => {
    const error = validateField(field as keyof ProposalFormData, value);

    if (error) {
      newErrors[field as keyof ProposalFormData] = error;
    }
  });

  return newErrors;
}

export default function RequestProposalModal({
  onClose,
  onSubmit,
  isSubmitting = false,
}: RequestProposalModalProps) {
  const [formData, setFormData] = useState<ProposalFormData>({
    fullName: "",
    location: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof ProposalFormData, value: string) => {
    if (field === "message" && value.length > 500) return;

    const updatedFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedFormData);

    setErrors((current) => ({
      ...current,
      [field]: validateField(field, value),
    }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const sanitizedData: ProposalFormData = {
      fullName: formData.fullName.trim(),
      location: formData.location.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim().replace(/[\s-]/g, ""),
      message: formData.message.trim(),
    };

    await onSubmit(sanitizedData);

    window.alert("Proposal request submitted successfully.");
  };

  return (
    <div className="as-modal-backdrop">
      <div className="as-modal">
        <button
          className="as-modal-close"
          onClick={onClose}
          type="button"
          disabled={isSubmitting}
        >
          ×
        </button>

        <h2>Request Proposal</h2>
        <p>
          Our team will review your system profile and send you a detailed solar
          proposal.
        </p>

        <div className="as-modal-form">
          <label>
            Name
            <input
              className={errors.fullName ? "as-input-error" : ""}
              placeholder="Juan Dela Cruz"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
            {errors.fullName && (
              <small className="as-field-error">{errors.fullName}</small>
            )}
          </label>

          <label>
            Location
            <input
              className={errors.location ? "as-input-error" : ""}
              placeholder="Search map location or manually input address"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            {errors.location && (
              <small className="as-field-error">{errors.location}</small>
            )}
          </label>

          <label>
            Email Address
            <input
              className={errors.email ? "as-input-error" : ""}
              type="email"
              placeholder="name@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <small className="as-field-error">{errors.email}</small>
            )}
          </label>

          <label>
            Phone Number
            <input
              className={errors.phone ? "as-input-error" : ""}
              type="tel"
              placeholder="+63 912 345 6789"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <small className="as-field-error">{errors.phone}</small>
            )}
          </label>

          <label>
            Additional Notes
            <textarea
              className={errors.message ? "as-input-error" : ""}
              placeholder="Tell us more about your property or energy requirements."
              value={formData.message}
              maxLength={500}
              onChange={(e) => handleChange("message", e.target.value)}
            />
            <small
              className={
                errors.message ? "as-field-error" : "as-character-count"
              }
            >
              {errors.message || `${formData.message.length}/500 characters`}
            </small>
          </label>
        </div>

        <div className="as-modal-actions">
          <button
            className="as-btn-secondary"
            onClick={onClose}
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            className="as-btn-primary"
            onClick={handleSubmit}
            type="button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Request Proposal"}
          </button>
        </div>
      </div>
    </div>
  );
}