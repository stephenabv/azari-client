import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ApiSolarPackage, PackageSelection } from "../../services/ASContent";
import { submitPackageInquiry, computeMonthlySavings } from "../../services/ASContent";
import { formatCapacity } from "../../lib/units";
import LocationAutocompleteInput from "../../components/ASLocationAutocomplete";

type Props = {
  isOpen: boolean;
  pkg: ApiSolarPackage | null;
  selection?: PackageSelection | null;
  onClose: () => void;
};

type FormState = { name: string; location: string; email: string; phone: string };
type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.name.trim()) e.name = "Name is required.";
  if (!f.location.trim()) e.location = "Location is required.";
  if (!f.email.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (!f.phone.trim()) e.phone = "Phone number is required.";
  else if (!/^9\d{9}$/.test(f.phone.trim())) e.phone = "Enter a valid 10-digit number starting with 9.";
  return e;
}

const EMPTY: FormState = { name: "", location: "", email: "", phone: "" };

export default function ASPackageInquiry({ isOpen, pkg, selection, onClose }: Props) {
  const [isClosing, setIsClosing] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isOpen) return;
    const t = window.setTimeout(() => {
      setForm(EMPTY);
      setErrors({});
      setSuccess(false);
      setSubmitError("");
    }, 260);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const y = window.scrollY;
    const o = { overflow: document.body.style.overflow, position: document.body.style.position, top: document.body.style.top, width: document.body.style.width };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = o.overflow;
      document.body.style.position = o.position;
      document.body.style.top = o.top;
      document.body.style.width = o.width;
      window.scrollTo(0, y);
    };
  }, [isOpen]);

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
    setSubmitError("");
    try {
      // Scope B: submit the customer's customized config when available.
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
      });
      setSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
        <button type="button" className="as-inq-close" onClick={handleClose} aria-label="Close">×</button>

        {success && pkg ? (
          <div className="as-inq-success">
            <div className="as-inq-success-icon">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <path d="M6 17.5L13.5 25L28 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="as-inq-success-title">Inquiry Submitted</h2>
            <p className="as-inq-success-desc">
              Thank you! We've received your inquiry. One of our solar experts will get back to you within 1–2 business days.
            </p>

            {(() => {
              const solarKwp   = selection?.solarKwp   ?? pkg.solarKwp;
              const inverterKw = selection?.inverterKw  ?? pkg.inverterKw;
              const storageKwh = selection?.storageKwh  ?? pkg.storageKwh;
              const savings    = selection?.savings     ?? computeMonthlySavings(pkg.solarKwp);
              const price      = selection?.price       ?? pkg.totalPrice;
              const comps      = selection?.components  ?? pkg.components?.map(pc => ({ brand: pc.component.brand, name: pc.component.name, category: pc.component.category, quantity: pc.quantity, unitPrice: pc.component.unitPrice }));
              return (
                <div className="as-inq-success-pkg">
                  <div className="as-inq-success-pkg-name">{pkg.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{pkg.phase === "single" ? "Single Phase" : "Three Phase"}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>Production: {formatCapacity(solarKwp, "power", { unit: "kWp" })}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>Load Capacity: {formatCapacity(inverterKw, "power", { unit: "kW" })}</div>
                  {storageKwh > 0 && <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>Storage: {formatCapacity(storageKwh, "energy", { unit: "kWh" })}</div>}
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>Monthly Saving: ₱{savings.min.toLocaleString()} – ₱{savings.max.toLocaleString()}</div>
                  {price != null && <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>Total Price: ₱{price.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>}
                  {comps && comps.length > 0 && (
                    <ul style={{ marginLeft: 20, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {comps.map((c, i) => (
                        <li key={i}>{c.quantity}pc{c.quantity > 1 ? "s" : ""} {c.brand} {c.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })()}

            <button type="button" className="as-inq-success-close-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <div className="as-inq-form-panel">
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Inquire this System</h2>
            <p className="as-inq-intro">
              You're almost there! Provide your details below. Our team will reach out to schedule your free site assessment.
            </p>

            {pkg && (() => {
              const solarKwp   = selection?.solarKwp   ?? pkg.solarKwp;
              const inverterKw = selection?.inverterKw  ?? pkg.inverterKw;
              const storageKwh = selection?.storageKwh  ?? pkg.storageKwh;
              const savings    = selection?.savings     ?? computeMonthlySavings(pkg.solarKwp);
              const price      = selection?.price       ?? pkg.totalPrice;
              return (
                <div className="as-inq-pkg-summary">
                  <div className="as-inq-pkg-summary-label">System</div>
                  <div className="as-inq-pkg-summary-name">{pkg.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{pkg.phase === "single" ? "Single Phase" : "Three Phase"}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>Production: {formatCapacity(solarKwp, "power", { unit: "kWp" })}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>Load Capacity: {formatCapacity(inverterKw, "power", { unit: "kW" })}</div>
                  {storageKwh > 0 && <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>Storage: {formatCapacity(storageKwh, "energy", { unit: "kWh" })}</div>}
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>Monthly Saving: ₱{savings.min.toLocaleString()} – ₱{savings.max.toLocaleString()}</div>
                  {price != null && <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Total Price: ₱{price.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>}
                </div>
              );
            })()}

            <div className="as-inq-field">
              <label className="as-inq-label">Name</label>
              <input
                className={`as-inq-input${errors.name ? " has-error" : ""}`}
                type="text"
                value={form.name}
                onChange={e => setField("name", e.target.value)}
                placeholder="Juan dela Cruz"
                autoComplete="name"
              />
              {errors.name && <span className="as-inq-field-error">{errors.name}</span>}
            </div>

            <div className="as-inq-field">
              <label className="as-inq-label">Location</label>
              <LocationAutocompleteInput
                value={form.location}
                onChange={v => setField("location", v)}
                placeholder="Ex. Tagbilaran City"
                inputClassName={`as-inq-input${errors.location ? " has-error" : ""}`}
              />
              {errors.location && <span className="as-inq-field-error">{errors.location}</span>}
            </div>

            <div className="as-inq-field">
              <label className="as-inq-label">Email address</label>
              <input
                className={`as-inq-input${errors.email ? " has-error" : ""}`}
                type="email"
                value={form.email}
                onChange={e => setField("email", e.target.value)}
                placeholder="juandelacruz@gmail.com"
                autoComplete="email"
              />
              {errors.email && <span className="as-inq-field-error">{errors.email}</span>}
            </div>

            <div className="as-inq-field">
              <label className="as-inq-label">Phone number</label>
              <div className={`as-inq-phone-wrap${errors.phone ? " has-error" : ""}`}>
                <span className="as-inq-phone-prefix">+63</span>
                <input
                  className="as-inq-phone-input"
                  type="tel"
                  value={form.phone}
                  onChange={e => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9123456789"
                  inputMode="numeric"
                  autoComplete="tel-local"
                />
              </div>
              {errors.phone && <span className="as-inq-field-error">{errors.phone}</span>}
            </div>

            {submitError && <div className="as-inq-submit-error">{submitError}</div>}

            <p className="as-inq-privacy">
              We value your privacy. Your information is only used for your solar assessment &amp; inquiries.
            </p>

            <div className="as-inq-actions" style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  border: "1px solid var(--border-color)",
                  borderRadius: 8,
                  background: "transparent",
                  color: "var(--text-primary)",
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="as-inq-submit-btn"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  border: "none",
                  borderRadius: 8,
                  background: "#ff6b5b",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: "all 0.2s"
                }}
              >
                {isSubmitting ? "Submitting…" : "Submit Inquiry"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
