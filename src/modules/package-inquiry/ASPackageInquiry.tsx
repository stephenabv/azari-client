import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ApiSolarPackage, PackageSelection } from "../../services/ASContent";
import { submitPackageInquiry, computeMonthlySavings } from "../../services/ASContent";
import { formatCapacity } from "../../lib/units";
import LocationAutocompleteInput from "../../components/ASLocationAutocomplete";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useLocale, useT, type MessageKey } from "../../i18n";

type Props = {
  isOpen: boolean;
  pkg: ApiSolarPackage | null;
  selection?: PackageSelection | null;
  onClose: () => void;
};

type FormState = { name: string; location: string; email: string; phone: string };
/** Field errors hold message keys; they are translated at render time. */
type FormErrors = Partial<Record<keyof FormState, MessageKey>>;

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.name.trim()) e.name = "inquiry.package.errors.nameRequired";
  if (!f.location.trim()) e.location = "inquiry.package.errors.locationRequired";
  if (!f.email.trim()) e.email = "inquiry.package.errors.emailRequired";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "inquiry.package.errors.emailInvalid";
  if (!f.phone.trim()) e.phone = "inquiry.package.errors.phoneRequired";
  else if (!/^9\d{9}$/.test(f.phone.trim())) e.phone = "inquiry.package.errors.phoneInvalid";
  return e;
}

const EMPTY: FormState = { name: "", location: "", email: "", phone: "" };

export default function ASPackageInquiry({ isOpen, pkg, selection, onClose }: Props) {
  const [isClosing, setIsClosing] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const t = useT();
  const locale = useLocale();

  const formatPeso = (value: number) => value.toLocaleString(locale.numberFormat);

  useEffect(() => {
    if (isOpen) return;
    const t = window.setTimeout(() => {
      setForm(EMPTY);
      setErrors({});
      setSuccess(false);
      setSubmitFailed(false);
    }, 260);
    return () => clearTimeout(t);
  }, [isOpen]);

  useScrollLock(isOpen);

  const handleClose = () => {
    setIsClosing(true);
    window.setTimeout(() => { setIsClosing(false); onClose(); }, 220);
  };

  const setField = (key: keyof FormState, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    if (!pkg) return;
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsSubmitting(true);
    setSubmitFailed(false);
    try {

      const savings = selection
        ? { min: selection.savings.min, max: selection.savings.max }
        : computeMonthlySavings(pkg.solarKwp);
      await submitPackageInquiry({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: `+63${form.phone.trim()}`,
        location: form.location.trim(),
        packageId: pkg.id,
        packageName: pkg.name,
        packageDetails: {
          solarKwp:     selection ? selection.solarKwp     : pkg.solarKwp,
          inverterKw:   selection ? selection.inverterKw   : pkg.inverterKw,
          storageKwh:   selection ? selection.storageKwh   : pkg.storageKwh,
          phase: pkg.phase,
          billRangeMin: savings.min,
          billRangeMax: savings.max,
          totalPrice:   selection ? selection.price        : pkg.totalPrice,
          qty:          selection?.qty,
          components:   selection?.components,
        },
        locale: locale.tag,
      });
      setSuccess(true);
    } catch (err) {
      // apiFetch throws "rate_limited:<sec>" when it gets 429 and fires the
      // global banner. Suppress the in-form error so only the banner shows.
      const msg = err instanceof Error ? err.message : "";
      // The server's message is English; log it for debugging and show the
      // visitor a localized message instead.
      if (!msg.startsWith("rate_limited")) {
        console.error("Package inquiry failed:", msg);
        setSubmitFailed(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`as-inq-overlay${isClosing ? " is-closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`as-inq-modal${isClosing ? " is-closing" : ""}${success ? " is-success" : ""}`}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" className="as-inq-close" onClick={handleClose} aria-label={t("inquiry.common.close")}>×</button>

        {success && pkg ? (
          <div className="as-inq-success">
            <div className="as-inq-success-icon">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                <path d="M6 17.5L13.5 25L28 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="as-inq-success-title">{t("inquiry.package.successTitle")}</h2>
            <p className="as-inq-success-desc">{t("inquiry.package.successBody")}</p>

            {(() => {
              const inverterComp = pkg.components?.find(pc => pc.component.category === "Inverter");
              const systemName   = inverterComp?.component.model ?? pkg.name;
              const inverterKw   = selection?.inverterKw ?? pkg.inverterKw;
              const savings      = selection?.savings    ?? computeMonthlySavings(pkg.solarKwp);
              const comps        = selection?.components ?? pkg.components?.map(pc => ({ brand: pc.component.brand, name: pc.component.name, category: pc.component.category, quantity: pc.quantity, unitPrice: pc.component.unitPrice }));
              return (
                <div className="as-inq-success-pkg">
                  <div className="as-inq-success-pkg-name">{systemName}</div>
                  <div className="as-inq-success-detail-row">
                    {t("inquiry.package.loadCapacity", { value: formatCapacity(inverterKw, "power", { unit: "kW" }) })}
                  </div>
                  <div className="as-inq-success-detail-row">
                    {t("inquiry.package.monthlySaving", { min: formatPeso(savings.min), max: formatPeso(savings.max) })}
                  </div>
                  {comps && comps.length > 0 && (
                    <ul className="as-inq-success-components">
                      {comps.map((c, i) => (
                        <li key={i}>
                          {t(c.quantity > 1 ? "inquiry.package.componentQtyMany" : "inquiry.package.componentQtyOne", { count: c.quantity })}{" "}
                          {c.brand} {c.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })()}

            <button type="button" className="as-inq-success-close-btn" onClick={handleClose}>
              {t("inquiry.common.close")}
            </button>
          </div>
        ) : (
          <div className="as-inq-form-panel">
            <h2 className="as-inq-title">{t("inquiry.package.title")}</h2>
            <p className="as-inq-intro">{t("inquiry.package.intro")}</p>

            {pkg && (() => {
              const inverterComp = pkg.components?.find(pc => pc.component.category === "Inverter");
              const systemName   = inverterComp?.component.model ?? pkg.name;
              const inverterKw   = selection?.inverterKw ?? pkg.inverterKw;
              const savings      = selection?.savings    ?? computeMonthlySavings(pkg.solarKwp);
              return (
                <div className="as-inq-pkg-summary">
                  <div className="as-inq-pkg-summary-label">{t("inquiry.package.system")}</div>
                  <div className="as-inq-pkg-summary-name">{systemName}</div>
                  <div className="as-inq-detail-row">
                    {t("inquiry.package.loadCapacity", { value: formatCapacity(inverterKw, "power", { unit: "kW" }) })}
                  </div>
                  <div className="as-inq-detail-row">
                    {t("inquiry.package.monthlySaving", { min: formatPeso(savings.min), max: formatPeso(savings.max) })}
                  </div>
                </div>
              );
            })()}

            <div className="as-inq-field">
              <label className="as-inq-label">{t("inquiry.package.fields.name")}</label>
              <input
                className={`as-inq-input${errors.name ? " has-error" : ""}`}
                type="text"
                value={form.name}
                onChange={e => setField("name", e.target.value)}
                placeholder={t("inquiry.package.fields.namePlaceholder")}
                autoComplete="name"
              />
              {errors.name && <span className="as-inq-field-error">{t(errors.name)}</span>}
            </div>

            <div className="as-inq-field">
              <label className="as-inq-label">{t("inquiry.package.fields.location")}</label>
              <LocationAutocompleteInput
                value={form.location}
                onChange={v => setField("location", v)}
                placeholder={t("inquiry.package.fields.locationPlaceholder")}
                inputClassName={`as-inq-input${errors.location ? " has-error" : ""}`}
              />
              {errors.location && <span className="as-inq-field-error">{t(errors.location)}</span>}
            </div>

            <div className="as-inq-field">
              <label className="as-inq-label">{t("inquiry.package.fields.email")}</label>
              <input
                className={`as-inq-input${errors.email ? " has-error" : ""}`}
                type="email"
                value={form.email}
                onChange={e => setField("email", e.target.value)}
                placeholder={t("inquiry.package.fields.emailPlaceholder")}
                autoComplete="email"
              />
              {errors.email && <span className="as-inq-field-error">{t(errors.email)}</span>}
            </div>

            <div className="as-inq-field">
              <label className="as-inq-label">{t("inquiry.package.fields.phone")}</label>
              <div className={`as-inq-phone-wrap${errors.phone ? " has-error" : ""}`}>
                <span className="as-inq-phone-prefix">+63</span>
                <input
                  className="as-inq-phone-input"
                  type="tel"
                  value={form.phone}
                  onChange={e => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder={t("inquiry.package.fields.phonePlaceholder")}
                  inputMode="numeric"
                  autoComplete="tel-local"
                />
              </div>
              {errors.phone && <span className="as-inq-field-error">{t(errors.phone)}</span>}
            </div>

            {submitFailed && (
              <div className="as-inq-submit-error" role="alert">{t("inquiry.package.errors.submitFailed")}</div>
            )}

            <p className="as-inq-privacy">{t("inquiry.package.privacy")}</p>

            <div className="as-inq-actions">
              <button type="button" className="as-inq-cancel-btn" onClick={handleClose}>
                {t("inquiry.common.cancel")}
              </button>
              <button
                type="button"
                className="as-inq-submit-btn"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("inquiry.package.submitting") : t("inquiry.package.submit")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
