import { useState } from "react";
import {
  sanitizeProposalRequestForm,
  validateProposalRequestField,
  validateProposalRequestForm,
  type ProposalRequestErrors,
  type ProposalRequestFormData,
  type ProposalRequestField,
} from "../../models/quotation";
import LocationAutocompleteInput from "../../components/ASLocationAutocomplete";
import { useT } from "../../i18n";

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
  const t = useT();
  const [formData, setFormData] = useState<ProposalRequestFormData>({
    fullName: "",
    location: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<ProposalRequestErrors>({});

  const handleChange = (field: ProposalRequestField, value: string) => {
    if (field === "message" && value.length > 500) return;

    const updatedFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedFormData);

    setErrors((current) => ({
      ...current,
      [field]: validateProposalRequestField(field, value) || undefined,
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
          aria-label={t("quotation.common.close")}
        >
          ×
        </button>

        <h2>{t("quotation.proposal.title")}</h2>
        <p>{t("quotation.proposal.intro")}</p>

        <div className="as-modal-form">
          <label>
            {t("quotation.proposal.name")}
            <input
              className={errors.fullName ? "as-input-error" : ""}
              placeholder={t("quotation.proposal.namePlaceholder")}
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
            {errors.fullName && (
              <small className="as-field-error">{t(errors.fullName)}</small>
            )}
          </label>

          <label>
            {t("quotation.proposal.location")}
            <LocationAutocompleteInput
              value={formData.location}
              onChange={(val) => handleChange("location", val)}
              placeholder={t("quotation.proposal.locationPlaceholder")}
              inputClassName={errors.location ? "as-input-error" : ""}
            />
            {errors.location && (
              <small className="as-field-error">{t(errors.location)}</small>
            )}
          </label>

          <label>
            {t("quotation.proposal.email")}
            <input
              className={errors.email ? "as-input-error" : ""}
              type="email"
              placeholder={t("quotation.proposal.emailPlaceholder")}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <small className="as-field-error">{t(errors.email)}</small>
            )}
          </label>

          <label>
            {t("quotation.proposal.phone")}
            <input
              className={errors.phone ? "as-input-error" : ""}
              type="tel"
              placeholder={t("quotation.proposal.phonePlaceholder")}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <small className="as-field-error">{t(errors.phone)}</small>
            )}
          </label>

          <label>
            {t("quotation.proposal.notes")}
            <textarea
              className={errors.message ? "as-input-error" : ""}
              placeholder={t("quotation.proposal.notesPlaceholder")}
              value={formData.message}
              maxLength={500}
              onChange={(e) => handleChange("message", e.target.value)}
            />
            <small
              className={
                errors.message ? "as-field-error" : "as-character-count"
              }
            >
              {errors.message
                ? t(errors.message)
                : t("quotation.proposal.characters", { count: formData.message.length })}
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
            {t("quotation.common.cancel")}
          </button>

          <button
            className="as-btn-primary"
            onClick={handleSubmit}
            type="button"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("quotation.proposal.submitting") : t("quotation.proposal.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
