import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AddApplianceModal from "../modules/quotaion-modal/ASAddAppliance";
import RequestProposalModal from "../modules/quotaion-modal/ASProposalRequest";
import ProposalSubmittedModal from "../modules/quotaion-modal/ASProposalSubmitted";
import { getCollectionData } from "../services/ASFirestore";
import { sendQuotationRequest } from "../modules/quotationbuilder";
import ASSystemError from "../modules/system-error/ASSystemError";

import residentialIcon from "../assets/icons/icon-resident.svg";
import commercialIcon from "../assets/icons/icon-commercial.svg";
import industrialIcon from "../assets/icons/icon-industrial.svg";

type ModalType =
  | "add-appliance"
  | "request-proposal"
  | "submitted"
  | "system-error"
  | null;
type QuoteMode = "with-bill" | "no-bill";

type QuoteNavigationState = {
  monthlyBill?: number;
  electricRate?: number;
};

type CalculatorRangeConfig = {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

type CalculatorFormula = {
  averageSolarProductionPerKwp: number;
  estimatedSavingsRate: number;
  projectionYears: number;
  monthsPerYear: number;
};

type ASCalculatorData = {
  id: string;
  monthly_bill?: CalculatorRangeConfig;
  electric_rate?: CalculatorRangeConfig;
  formula?: CalculatorFormula;
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



const DEFAULT_CALCULATOR_CONFIG = {
  monthlyBill: {
    min: 500,
    max: 200000,
    step: 0.1,
    defaultValue: 1000,
  },
  electricRate: {
    min: 1.1,
    max: 20,
    step: 0.01,
    defaultValue: 11.25,
  },
  formula: {
    averageSolarProductionPerKwp: 120,
    estimatedSavingsRate: 0.87,
    projectionYears: 12,
    monthsPerYear: 0,
  },
};

const QUOTE_ENGINE_CONFIG = {
  view: {
    showPropertyClassification: true,
    showResidential: true,
    showCommercial: true,
    showIndustrial: true,
  },
  defaults: {
    quoteMode: "with-bill" as QuoteMode,
    selectedProperty: "Residential",
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

  return { value: value.toFixed(1), unit: "kWp" };
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

function getProjectionDisplay(projectionMonths: number) {
  if (projectionMonths <= 1) return "1 Month";

  if (projectionMonths < 12) {
    return `${projectionMonths} Months`;
  }

  const years = projectionMonths / 12;
  const displayYears = Number.isInteger(years) ? years : years.toFixed(1);

  return `${displayYears} Year${years === 1 ? "" : "s"}`;
}

function normalizeDecimalInput(value: string) {
  let cleaned = value.replace(/[^\d.]/g, "");
  cleaned = cleaned.replace(/(\..*?)\..*/g, "$1");
  cleaned = cleaned.replace(/^0+(?=\d)/, "");

  return cleaned;
}

function isAllowedFileType(file: File) {
  const fileName = file.name.toLowerCase();

  const hasValidMimeType =
    QUOTE_ENGINE_CONFIG.upload.allowedMimeTypes.includes(file.type);

  const hasValidExtension = QUOTE_ENGINE_CONFIG.upload.allowedExtensions.some(
    (ext) => fileName.endsWith(ext)
  );

  return hasValidMimeType && hasValidExtension;
}

export default function ASQuotationEngine() {
  const location = useLocation();
  const quoteState = (location.state ?? {}) as QuoteNavigationState;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [calculatorConfig, setCalculatorConfig] = useState(
    DEFAULT_CALCULATOR_CONFIG
  );

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
    quoteState.monthlyBill ?? DEFAULT_CALCULATOR_CONFIG.monthlyBill.defaultValue
  );

  const [electricRate, setElectricRate] = useState(
    quoteState.electricRate ?? DEFAULT_CALCULATOR_CONFIG.electricRate.defaultValue
  );

  const [monthlyBillInput, setMonthlyBillInput] = useState(
    String(
      quoteState.monthlyBill ?? DEFAULT_CALCULATOR_CONFIG.monthlyBill.defaultValue
    )
  );

  const [electricRateInput, setElectricRateInput] = useState(
    String(
      quoteState.electricRate ??
      DEFAULT_CALCULATOR_CONFIG.electricRate.defaultValue
    )
  );

  const visiblePropertyTypes = propertyTypes.filter((item) => item.isVisible);

  const closeModal = () => setModal(null);

  useEffect(() => {
    const unsubscribe = getCollectionData<ASCalculatorData>(
      "ASCalculator",
      (data) => {
        const item = data[0];

        if (!item) {
          setCalculatorConfig(DEFAULT_CALCULATOR_CONFIG);
          return;
        }

        const nextConfig = {
          monthlyBill: item.monthly_bill ?? DEFAULT_CALCULATOR_CONFIG.monthlyBill,
          electricRate: item.electric_rate ?? DEFAULT_CALCULATOR_CONFIG.electricRate,
          formula: item.formula ?? DEFAULT_CALCULATOR_CONFIG.formula,
        };

        setCalculatorConfig(nextConfig);

        if (quoteState.monthlyBill === undefined) {
          setMonthlyBill(nextConfig.monthlyBill.defaultValue);
          setMonthlyBillInput(String(nextConfig.monthlyBill.defaultValue));
        }

        if (quoteState.electricRate === undefined) {
          setElectricRate(nextConfig.electricRate.defaultValue);
          setElectricRateInput(String(nextConfig.electricRate.defaultValue));
        }
      }
    );

    return () => unsubscribe();
  }, []);

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

  const quoteSummary = useMemo(() => {
    const totalDailyUsageWh = appliances.reduce(
      (total, item) => total + item.usage,
      0
    );

    const safeElectricRate =
      electricRate || calculatorConfig.electricRate.defaultValue;

    const loadProfileMonthlyKwh = (totalDailyUsageWh * 30) / 1000;
    const billMonthlyKwh = safeElectricRate > 0 ? monthlyBill / safeElectricRate : 0;

    const monthlyKwh =
      quoteMode === "with-bill" ? billMonthlyKwh : loadProfileMonthlyKwh;

    const rawSystemSize =
      quoteMode === "with-bill"
        ? monthlyBill /
        (safeElectricRate *
          calculatorConfig.formula.averageSolarProductionPerKwp)
        : monthlyKwh / calculatorConfig.formula.averageSolarProductionPerKwp;

    const systemSize =
      rawSystemSize > 0 ? Math.max(1, Number(rawSystemSize.toFixed(1))) : 0;

    const estimatedMonthlySavings =
      quoteMode === "with-bill"
        ? monthlyBill * calculatorConfig.formula.estimatedSavingsRate
        : monthlyKwh *
        safeElectricRate *
        calculatorConfig.formula.estimatedSavingsRate;

    const projectedSavings =
      estimatedMonthlySavings * calculatorConfig.formula.projectionYears;

    return {
      monthlyKwh: Math.round(monthlyKwh),
      systemSize,
      estimatedMonthlySavings: Math.round(estimatedMonthlySavings),
      projectedSavings: Math.round(projectedSavings),
      totalDailyUsageWh,
    };
  }, [appliances, electricRate, monthlyBill, quoteMode, calculatorConfig]);

  const formattedSystemSize = formatSystemSize(quoteSummary.systemSize);

  const handleMonthlyBillChange = (value: string) => {
    const cleaned = normalizeDecimalInput(value);

    setMonthlyBillInput(cleaned);

    if (cleaned === "" || cleaned === ".") {
      setMonthlyBill(0);
      return;
    }

    const parsed = Number(cleaned);

    if (Number.isNaN(parsed) || parsed < 0) {
      setMonthlyBill(0);
      return;
    }

    setMonthlyBill(parsed);
    setFormError("");
  };

  const handleElectricRateChange = (value: string) => {
    const cleaned = normalizeDecimalInput(value);

    setElectricRateInput(cleaned);

    if (cleaned === "" || cleaned === ".") {
      setElectricRate(0);
      return;
    }

    const parsed = Number(cleaned);

    if (Number.isNaN(parsed) || parsed < 0) {
      setElectricRate(0);
      return;
    }

    setElectricRate(parsed);
    setFormError("");
  };

  const handleElectricRateSliderChange = (value: string) => {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) return;

    setElectricRate(parsed);
    setElectricRateInput(String(parsed));
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

    setUploadedBill({
      file,
      name: file.name,
      type: file.type,
      size: file.size,
    });
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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      if (monthlyBill < calculatorConfig.monthlyBill.min) {
        return `Average monthly bill must be at least ₱${calculatorConfig.monthlyBill.min.toLocaleString()}.`;
      }

      if (
        electricRate < calculatorConfig.electricRate.min ||
        electricRate > calculatorConfig.electricRate.max
      ) {
        return `Typical electricity rate must be between ₱${calculatorConfig.electricRate.min} and ₱${calculatorConfig.electricRate.max}.`;
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

  const resetForm = () => {
    setMonthlyBill(calculatorConfig.monthlyBill.defaultValue);
    setElectricRate(calculatorConfig.electricRate.defaultValue);

    setMonthlyBillInput(
      String(calculatorConfig.monthlyBill.defaultValue)
    );
    setElectricRateInput(
      String(calculatorConfig.electricRate.defaultValue)
    );

    setAppliances([]);
    setUploadedBill(null);
    setFormError("");
  };

  const handleSubmitProposal = async (proposalForm?: ProposalFormData) => {
    const error = validateBeforeProposal();

    if (error) {
      setFormError(error);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendQuotationRequest({
        quoteMode,
        selectedProperty,
        monthlyBill,
        electricRate,
        projectionMonths: calculatorConfig.formula.projectionYears,
        quoteSummary,
        formattedSystemSize,
        appliances,
        uploadedBill,
        proposalForm,
      });

      if (result.isRealSuccess) {
        resetForm();
        setModal("submitted");
        return;
      }

      setModal("system-error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionIndex = {
    consumption: "02",
    rate: "03",
    load: quoteMode === "with-bill" ? "04" : "02",
  };

  const projectedSavingsLabel = getProjectionDisplay(
    calculatorConfig.formula.projectionYears
  );

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
                      </span>

                      <span className="as-property-check" />

                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quoteMode === "with-bill" && (
              <>
                <div className="as-form-section">
                  <div className="as-section-label">
                    <span>{sectionIndex.consumption}</span>
                    <p>Consumption Data</p>
                  </div>

                  <div className="as-consumption-grid">
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

                    <div className="as-input-card">
                      <label>Average Monthly Bill</label>

                      <div className="as-currency-input">
                        <span>₱</span>

                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="0.00"
                          value={monthlyBillInput}
                          onChange={(e) =>
                            handleMonthlyBillChange(e.target.value)
                          }
                        />

                        <small>PHP</small>
                      </div>

                      <p>Based on your recent electricity bill.</p>
                    </div>
                  </div>
                </div>

                <div className="as-form-section">
                  <div className="as-section-label">
                    <span>{sectionIndex.rate}</span>
                    <p>Typical Electricity Rate</p>
                  </div>

                  <div className="as-rate-wrapper">
                    <div className="as-rate-slider-area">
                      <div className="as-rate-labels">
                        <span>₱{calculatorConfig.electricRate.min}</span>
                        <span>₱{calculatorConfig.electricRate.max}</span>
                      </div>

                      <input
                        type="range"
                        min={calculatorConfig.electricRate.min}
                        max={calculatorConfig.electricRate.max}
                        step={calculatorConfig.electricRate.step}
                        value={Math.min(
                          calculatorConfig.electricRate.max,
                          Math.max(calculatorConfig.electricRate.min, electricRate)
                        )}
                        onChange={(e) =>
                          handleElectricRateSliderChange(e.target.value)
                        }
                      />
                    </div>

                    <div className="as-rate-input-group">
                      <div className="as-rate-value">
                        <span>₱</span>

                        <input
                          type="text"
                          inputMode="decimal"
                          value={electricRateInput}
                          onChange={(e) =>
                            handleElectricRateChange(e.target.value)
                          }
                        />
                      </div>

                      <small>/ kWh</small>
                    </div>
                  </div>
                </div>
              </>
            )}

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
                        <strong>
                          {formatNumber(quoteSummary.totalDailyUsageWh)}
                        </strong>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {formError && <div className="as-page-error">{formError}</div>}
          </main>

          <aside className="as-quote-summary">
            <div className="as-summary-card">
              <p>Recommended System</p>
              <h2>
                ~{formattedSystemSize.value} {formattedSystemSize.unit} Grid-Tie
              </h2>

              <p>Monthly Savings</p>
              <h2>{formatCompactPeso(quoteSummary.estimatedMonthlySavings)}</h2>

              <p>Estimated Savings in {projectedSavingsLabel}</p>
              <h2>{formatCompactPeso(quoteSummary.projectedSavings)}</h2>

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

      {modal === "system-error" && (
        <ASSystemError onClose={closeModal} />
      )}
    </section>
  );
}