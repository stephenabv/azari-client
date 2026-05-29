import { useState } from "react";
import {
  sanitizeProposalRequestForm,
  validateProposalRequestField,
  validateProposalRequestForm,
  type ProposalRequestFormData,
  type ProposalRequestField,
} from "../../models/quotation";
import type { FieldErrors } from "../../models/common";
import LocationAutocompleteInput from "../../components/ASLocationAutocomplete";

type RequestProposalModalProps = {
  onClose: () => void;
  onSubmit: (formData: ProposalRequestFormData) => void | Promise<void>;
  isSubmitting?: boolean;
};

export default function RequestProposalModal({
  onClose,
  onSubmit,
  isSubmitting = false,
}: RequestProposalModalProps) {
  const [formData, setFormData] = useState<ProposalRequestFormData>({
    fullName: "",
    location: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FieldErrors<ProposalRequestField>>({});

  const handleChange = (field: ProposalRequestField, value: string) => {
    if (field === "message" && value.length > 500) return;

    const updatedFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedFormData);

    setErrors((current) => ({
      ...current,
      [field]: validateProposalRequestField(field, value),
    }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateProposalRequestForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const sanitizedData = sanitizeProposalRequestForm(formData);

    await onSubmit(sanitizedData);
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
          You're almost there! Provide your details below so our team can
          finalize your custom solar proposal and reach out to schedule your
          free site assessment.
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
            <LocationAutocompleteInput
              value={formData.location}
              onChange={(val) => handleChange("location", val)}
              placeholder="Search map location or manually input address"
              inputClassName={errors.location ? "as-input-error" : ""}
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
