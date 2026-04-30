import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AddApplianceModal from "../modules/quotaion-modal/ASAddAppliance";
import RequestProposalModal from "../modules/quotaion-modal/ASProposalRequest";
import ProposalSubmittedModal from "../modules/quotaion-modal/ASProposalSubmitted";

import residentialIcon from "../assets/icons/icon-resident.svg";
import commercialIcon from "../assets/icons/icon-commercial.svg";
import industrialIcon from "../assets/icons/icon-industrial.svg";

type ModalType = "add-appliance" | "request-proposal" | "submitted" | null;
type QuoteMode = "with-bill" | "no-bill";

type QuoteNavigationState = {
  monthlyBill?: number;
  electricRate?: number;
};

type Appliance = {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hours: number;
  schedule: string;
  usageType: string;
  usage: number;
};

type UploadedBill = {
  file: File;
  name: string;
  type: string;
  size: number;
};

type ProposalFormData = {
  fullName?: string;
  location?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const QUOTE_ENGINE_CONFIG = {
  view: {
    showPropertyClassification: true,
    showResidential: true,
    showCommercial: true,
    showIndustrial: true,
  },
  formula: {
    averageSolarProductionPerKwp: 120,
    estimatedSavingsRate: 0.87,
    monthsPerYear: 12,
    projectionYears: 10,
  },
  defaults: {
    quoteMode: "with-bill" as QuoteMode,
    monthlyBill: 0,
    electricRate: 14,
    selectedProperty: "Residential",
  },
  validation: {
    minMonthlyBill: 1,
    minElectricRate: 8,
    maxElectricRate: 20,
  },
  upload: {
    maxSizeInBytes: 10 * 1024 * 1024,
    allowedMimeTypes: ["application/pdf", "image/png", "image/jpeg"],
    allowedExtensions: [".pdf", ".png", ".jpg", ".jpeg"],
  },
};

const propertyTypes = [
  {
    title: "Residential",
    icon: residentialIcon,
    isVisible: QUOTE_ENGINE_CONFIG.view.showResidential,
    description:
      "Standard detached housing or townhouses. Optimized for rooftop efficiency.",
  },
  {
    title: "Commercial",
    icon: commercialIcon,
    isVisible: QUOTE_ENGINE_CONFIG.view.showCommercial,
    description:
      "Office buildings, retail spaces, and warehouses. Higher load capacity sizing.",
  },
  {
    title: "Industrial",
    icon: industrialIcon,
    isVisible: QUOTE_ENGINE_CONFIG.view.showIndustrial,
    description:
      "Manufacturing plants and large facilities. High-voltage integration focused.",
  },
];

function formatSystemSize(value: number) {
  if (value >= 1000) {
    return { value: (value / 1000).toFixed(1), unit: "MWp" };
  }
  return { value: value.toFixed(0), unit: "kWp" };
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatCompactPeso(value: number) {
  if (value >= 1_000_000) return `₱${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₱${Math.round(value / 1_000)}k`;
  return `₱${formatNumber(value)}`;
}

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

function isAllowedFileType(file: File) {
  const fileName = file.name.toLowerCase();
  const hasValidMimeType = QUOTE_ENGINE_CONFIG.upload.allowedMimeTypes.includes(file.type);
  const hasValidExtension = QUOTE_ENGINE_CONFIG.upload.allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );
  return hasValidMimeType && hasValidExtension;
}

function buildQuotationPayload(params: {
  quoteMode: QuoteMode;
  selectedProperty: string;
  monthlyBill: number;
  electricRate: number;
  quoteSummary: {
    monthlyKwh: number;
    systemSize: number;
    estimatedMonthlySavings: number;
    annualSavings: number;
    tenYearSavings: number;
    totalDailyUsageWh: number;
  };
  formattedSystemSize: { value: string; unit: string };
  appliances: Appliance[];
  uploadedBill: UploadedBill | null;
  proposalForm?: ProposalFormData;
}) {
  return {
    type: "quotation_request",
    submittedAt: new Date().toISOString(),
    quoteMode: params.quoteMode,

    customer: {
      fullName: params.proposalForm?.fullName?.trim() || "",
      location: params.proposalForm?.location?.trim() || "",
      email: params.proposalForm?.email?.trim() || "",
      phone: params.proposalForm?.phone?.trim() || "",
      message: params.proposalForm?.message?.trim() || "",
    },

    property: {
      classification: params.selectedProperty,
    },

    consumption: {
      averageMonthlyBillPhp: params.monthlyBill,
      electricRatePhpPerKwh: params.electricRate,
      estimatedMonthlyKwh: params.quoteSummary.monthlyKwh,
    },

    solarEstimate: {
      estimatedSystemSize: {
        rawKwp: params.quoteSummary.systemSize,
        displayValue: params.formattedSystemSize.value,
        displayUnit: params.formattedSystemSize.unit,
        displayText: `${params.formattedSystemSize.value} ${params.formattedSystemSize.unit}`,
      },
      configuration: `~${params.formattedSystemSize.value} ${params.formattedSystemSize.unit} Grid-Tie`,
      estimatedMonthlySavingsPhp: params.quoteSummary.estimatedMonthlySavings,
      estimatedAnnualSavingsPhp: params.quoteSummary.annualSavings,
      estimatedTenYearSavingsPhp: params.quoteSummary.tenYearSavings,
      totalDailyUsageWh: params.quoteSummary.totalDailyUsageWh,
    },

    loadProfile: params.appliances.map((item) => ({
      name: item.name,
      watts: item.watts,
      quantity: item.quantity,
      hoursPerDay: item.hours,
      schedule: item.schedule,
      usageType: item.usageType,
      estimatedUsageWhPerDay: item.usage,
    })),

    billAttachment: params.uploadedBill
      ? {
        fileName: params.uploadedBill.name,
        mimeType: params.uploadedBill.type,
        sizeBytes: params.uploadedBill.size,
        sizeDisplay: formatFileSize(params.uploadedBill.size),
      }
      : null,
  };
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function ASQuotationEngine() {
  const location = useLocation();
  const quoteState = (location.state ?? {}) as QuoteNavigationState;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------- state ---------------------------------------- */

  const [quoteMode, setQuoteMode] = useState<QuoteMode>(
    QUOTE_ENGINE_CONFIG.defaults.quoteMode
  );
  const [modal, setModal] = useState<ModalType>(null);
  const [uploadError, setUploadError] = useState("");
  const [formError, setFormError] = useState("");
  const [uploadedBill, setUploadedBill] = useState<UploadedBill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [selectedProperty, setSelectedProperty] = useState(
    QUOTE_ENGINE_CONFIG.defaults.selectedProperty
  );
  const [monthlyBill, setMonthlyBill] = useState(
    quoteState.monthlyBill ?? QUOTE_ENGINE_CONFIG.defaults.monthlyBill
  );
  const [electricRate, setElectricRate] = useState(
    quoteState.electricRate ?? QUOTE_ENGINE_CONFIG.defaults.electricRate
  );

  const visiblePropertyTypes = propertyTypes.filter((item) => item.isVisible);

  const closeModal = () => setModal(null);

  /* ---------- scroll lock when modal is open --------------- */

  useEffect(() => {
    if (!modal) return;

    const scrollY = window.scrollY;
    const prev = {
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
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [modal]);

  /* ---------- derived quote summary ------------------------ */

  const quoteSummary = useMemo(() => {
    const totalDailyUsageWh = appliances.reduce((total, item) => total + item.usage, 0);

    const loadProfileMonthlyKwh = (totalDailyUsageWh * 30) / 1000;
    const billMonthlyKwh = electricRate > 0 ? monthlyBill / electricRate : 0;
    const monthlyKwh = quoteMode === "with-bill" ? billMonthlyKwh : loadProfileMonthlyKwh;

    const rawSystemSize =
      monthlyKwh / QUOTE_ENGINE_CONFIG.formula.averageSolarProductionPerKwp;
    const systemSize = monthlyKwh > 0 ? Math.max(1, Math.round(rawSystemSize)) : 0;

    const estimatedMonthlySavings =
      quoteMode === "with-bill"
        ? monthlyBill * QUOTE_ENGINE_CONFIG.formula.estimatedSavingsRate
        : monthlyKwh * electricRate * QUOTE_ENGINE_CONFIG.formula.estimatedSavingsRate;

    const annualSavings =
      estimatedMonthlySavings * QUOTE_ENGINE_CONFIG.formula.monthsPerYear;
    const tenYearSavings =
      annualSavings * QUOTE_ENGINE_CONFIG.formula.projectionYears;

    return {
      monthlyKwh: Math.round(monthlyKwh),
      systemSize,
      estimatedMonthlySavings: Math.round(estimatedMonthlySavings),
      annualSavings: Math.round(annualSavings),
      tenYearSavings: Math.round(tenYearSavings),
      totalDailyUsageWh,
    };
  }, [appliances, electricRate, monthlyBill, quoteMode]);

  const formattedSystemSize = formatSystemSize(quoteSummary.systemSize);

  /* ---------- handlers ------------------------------------- */

  const handleMonthlyBillChange = (value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) {
      setMonthlyBill(0);
      return;
    }
    setMonthlyBill(parsed);
    setFormError("");
  };

  const handleElectricRateChange = (value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    const safe = Math.min(
      QUOTE_ENGINE_CONFIG.validation.maxElectricRate,
      Math.max(QUOTE_ENGINE_CONFIG.validation.minElectricRate, parsed)
    );
    setElectricRate(safe);
    setFormError("");
  };

  const handleFileUpload = (file?: File) => {
    setUploadError("");
    if (!file) return;

    if (!isAllowedFileType(file)) {
      setUploadedBill(null);
      setUploadError("Only PDF, PNG, JPG, and JPEG files are allowed.");
      return;
    }

    if (file.size > QUOTE_ENGINE_CONFIG.upload.maxSizeInBytes) {
      setUploadedBill(null);
      setUploadError("File must not exceed 10MB.");
      return;
    }

    setUploadedBill({ file, name: file.name, type: file.type, size: file.size });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileUpload(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveUploadedBill = () => {
    setUploadedBill(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAppliance = (id: string) => {
    setAppliances((current) => current.filter((item) => item.id !== id));
  };

  const handleAddAppliance = (item: Omit<Appliance, "id" | "usage">) => {
    const watts = Number(item.watts);
    const quantity = Number(item.quantity);
    const hours = Number(item.hours);

    if (
      !item.name?.trim() ||
      Number.isNaN(watts) ||
      Number.isNaN(quantity) ||
      Number.isNaN(hours) ||
      watts <= 0 ||
      quantity <= 0 ||
      hours <= 0
    ) {
      return;
    }

    setAppliances((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: item.name.trim(),
        watts,
        quantity,
        hours,
        schedule: item.schedule,
        usageType: item.usageType,
        usage: watts * quantity * hours,
      },
    ]);

    setFormError("");
    closeModal();
  };

  const validateBeforeProposal = () => {
    if (QUOTE_ENGINE_CONFIG.view.showPropertyClassification && !selectedProperty) {
      return "Please select a property classification.";
    }

    if (quoteMode === "with-bill") {
      if (monthlyBill < QUOTE_ENGINE_CONFIG.validation.minMonthlyBill) {
        return "Average monthly bill is required.";
      }
      if (
        electricRate < QUOTE_ENGINE_CONFIG.validation.minElectricRate ||
        electricRate > QUOTE_ENGINE_CONFIG.validation.maxElectricRate
      ) {
        return "Typical electricity rate is required.";
      }
      return "";
    }

    if (appliances.length === 0) {
      return "Please add at least one appliance or load profile.";
    }

    return "";
  };

  const handleOpenProposal = () => {
    const error = validateBeforeProposal();
    if (error) {
      setFormError(error);
      return;
    }
    setModal("request-proposal");
  };

  const handleSubmitProposal = async (proposalForm?: ProposalFormData) => {
    const error = validateBeforeProposal();
    if (error) {
      setFormError(error);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildQuotationPayload({
        quoteMode,
        selectedProperty,
        monthlyBill,
        electricRate,
        quoteSummary,
        formattedSystemSize,
        appliances,
        uploadedBill,
        proposalForm,
      });

      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      if (uploadedBill?.file) formData.append("billAttachment", uploadedBill.file);

      const response = await fetch("/api/quotation/request-proposal", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit quotation request.");

      setModal("submitted");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while submitting your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- render --------------------------------------- */

  const sectionIndex = {
    consumption: "02",
    rate: "03",
    load: quoteMode === "with-bill" ? "04" : "02",
  };

  return (
    <section className="as-quote-page">
      <div className="as-quote-container">

        <header className="as-quote-header">
          <h1>Technical Quotation Engine</h1>
          <p>Configure your institutional-grade solar system.</p>

          <div className="as-quote-mode-toggle">
            <button
              type="button"
              className={quoteMode === "with-bill" ? "is-active" : ""}
              onClick={() => {
                setQuoteMode("with-bill");
                setFormError("");
              }}
            >
              I have a bill
            </button>

            <button
              type="button"
              className={quoteMode === "no-bill" ? "is-active" : ""}
              onClick={() => {
                setQuoteMode("no-bill");
                setFormError("");
              }}
            >
              No bill yet
            </button>
          </div>
        </header>

        <div className="as-quote-layout">
          <main className="as-quote-main">

            {/* ── 01 Property Classification ─────────────── */}
            {QUOTE_ENGINE_CONFIG.view.showPropertyClassification && (
              <div className="as-form-section">
                <div className="as-section-label">
                  <span>01</span>
                  <p>Property Classification</p>
                </div>

                <div className="as-property-grid">
                  {visiblePropertyTypes.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      className={`as-property-card ${selectedProperty === item.title ? "is-selected" : ""
                        }`}
                      onClick={() => setSelectedProperty(item.title)}
                    >
                      <span className="as-property-icon">
                        <img src={item.icon} alt={item.title} />
                      </span>                      <span className="as-property-check" />
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── 02 & 03 — Bill mode only ────────────────── */}
            {quoteMode === "with-bill" && (
              <>
                {/* 02 Consumption Data */}
                <div className="as-form-section">
                  <div className="as-section-label">
                    <span>{sectionIndex.consumption}</span>
                    <p>Consumption Data</p>
                  </div>

                  <div className="as-consumption-grid">
                    {/* Upload card */}
                    <div
                      className="as-upload-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                        hidden
                        onChange={(e) => handleFileUpload(e.target.files?.[0])}
                      />

                      <div className="as-upload-icon">☁</div>

                      {uploadedBill ? (
                        <>
                          <p>
                            {uploadedBill.name}{" "}
                            <span>{formatFileSize(uploadedBill.size)}</span>
                          </p>
                          <small>Click to replace uploaded bill</small>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveUploadedBill();
                            }}
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <p>
                            <span className="upload-highlight">
                              Upload your electricity bill
                            </span>{" "}
                            or drag and drop
                          </p>
                          <small>PDF, PNG, JPG up to 10MB</small>
                        </>
                      )}

                      {uploadError && (
                        <small className="as-form-error">{uploadError}</small>
                      )}
                    </div>

                    {/* Monthly bill input */}
                    <div className="as-input-card">
                      <label>Average Monthly Bill</label>

                      <div className="as-currency-input">
                        <span>₱</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="0.00"
                          value={monthlyBill || ""}
                          onChange={(e) => handleMonthlyBillChange(e.target.value)}
                        />
                        <small>PHP</small>
                      </div>

                      <p>Based on your recent electricity bill.</p>
                    </div>
                  </div>
                </div>

                {/* 03 Typical Electricity Rate */}
                <div className="as-form-section">
                  <div className="as-section-label">
                    <span>{sectionIndex.rate}</span>
                    <p>Typical Electricity Rate</p>
                  </div>

                  {/*
                    Layout (≥ 821px): [slider — flex:1] [value box + unit label]
                    Layout (≤ 820px): slider on top, value box below (full-width row)
                  */}
                  <div className="as-rate-wrapper">

                    {/* Slider track */}
                    <div className="as-rate-slider-area">
                      <div className="as-rate-labels">
                        <span>₱{QUOTE_ENGINE_CONFIG.validation.minElectricRate}</span>
                        <span>₱{QUOTE_ENGINE_CONFIG.validation.maxElectricRate}</span>
                      </div>

                      <input
                        type="range"
                        min={QUOTE_ENGINE_CONFIG.validation.minElectricRate}
                        max={QUOTE_ENGINE_CONFIG.validation.maxElectricRate}
                        step="0.01"
                        value={electricRate}
                        onChange={(e) => handleElectricRateChange(e.target.value)}
                      />
                    </div>

                    {/* Value box + unit */}
                    <div className="as-rate-input-group">
                      <div className="as-rate-value">
                        <span>₱</span>
                        <input
                          type="number"
                          min={QUOTE_ENGINE_CONFIG.validation.minElectricRate}
                          max={QUOTE_ENGINE_CONFIG.validation.maxElectricRate}
                          step="0.01"
                          value={electricRate}
                          onChange={(e) => handleElectricRateChange(e.target.value)}
                        />
                      </div>
                      <small>/ kWh</small>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Load Profile ────────────────────────────── */}
            <div className="as-form-section">
              <div className="as-load-header">
                <div className="as-section-label">
                  <span>{sectionIndex.load}</span>
                  <p>
                    Detailed Load Profile{" "}
                    {quoteMode === "with-bill" && <small>(Optional)</small>}
                  </p>
                </div>

                <button
                  type="button"
                  className="as-add-btn"
                  onClick={() => setModal("add-appliance")}
                >
                  + Add Appliance
                </button>
              </div>

              <div className="as-load-table">
                <div className="as-load-table-inner">
                  {/* Header row */}
                  <div className="as-load-row as-load-head">
                    <span>Appliance / Load Name</span>
                    <span>Rating (Watts)</span>
                    <span>Qty</span>
                    <span>Hrs/Day</span>
                    <span>Daily Wh</span>
                    <span />
                  </div>

                  {appliances.length === 0 ? (
                    <div className="as-load-empty">
                      Add appliances to create a detailed load profile.
                    </div>
                  ) : (
                    <>
                      {appliances.map((item) => (
                        <div className="as-load-row" key={item.id}>
                          <span>
                            <strong>{item.name}</strong>
                            <small>{item.schedule}</small>
                          </span>
                          <span>{formatNumber(item.watts)}</span>
                          <span>
                            <b>{item.quantity}</b>
                          </span>
                          <span>{item.hours}</span>
                          <span>{formatNumber(item.usage)}</span>
                          <span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAppliance(item.id)}
                            >
                              ×
                            </button>
                          </span>
                        </div>
                      ))}

                      <div className="as-load-total">
                        <span>Total Watt-Hours</span>
                        <strong>{formatNumber(quoteSummary.totalDailyUsageWh)}</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Form error ──────────────────────────────── */}
            {formError && <div className="as-page-error">{formError}</div>}
          </main>

          {/* ── Summary sidebar ─────────────────────────── */}
          <aside className="as-quote-summary">
            <div className="as-summary-card">
              <p>Recommended System</p>
              <h2>
                ~{formattedSystemSize.value} {formattedSystemSize.unit} Grid-Tie
              </h2>

              <p>Monthly Savings</p>
              <h2>{formatCompactPeso(quoteSummary.estimatedMonthlySavings)}</h2>

              <p>Estimated Savings in 10 Years</p>
              <h2>{formatCompactPeso(quoteSummary.tenYearSavings)}</h2>

              <button
                type="button"
                onClick={handleOpenProposal}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Request Proposal →"}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────── */}
      {modal === "add-appliance" && (
        <AddApplianceModal onClose={closeModal} onSubmit={handleAddAppliance} />
      )}

      {modal === "request-proposal" && (
        <RequestProposalModal
          onClose={closeModal}
          onSubmit={handleSubmitProposal}
          isSubmitting={isSubmitting}
        />
      )}

      {modal === "submitted" && <ProposalSubmittedModal onClose={closeModal} />}
    </section>
  );
}
