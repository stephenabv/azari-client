import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AddApplianceModal from "../modules/quotaion-modal/ASAddAppliance";
import RequestProposalModal from "../modules/quotaion-modal/ASProposalRequest";
import ProposalSubmittedModal from "../modules/quotaion-modal/ASProposalSubmitted";

type ModalType = "add-appliance" | "request-proposal" | "submitted" | null;

type QuoteNavigationState = {
  monthlyBill?: number;
  electricRate?: number;
  monthlyKwh?: number;
  systemSize?: number;
  estimatedMonthlySavings?: number;
  annualSavings?: number;
  tenYearSavings?: number;
};

type Appliance = {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hours: number;
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
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
};

const QUOTE_ENGINE_CONFIG = {
  formula: {
    averageSolarProductionPerKwp: 120,
    estimatedSavingsRate: 0.87,
    monthsPerYear: 12,
    projectionYears: 10,
  },
  defaults: {
    monthlyBill: 0,
    electricRate: 14,
    selectedProperty: "Commercial",
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
    description: "For homes, apartments, and private properties.",
  },
  {
    title: "Commercial",
    description: "For buildings, restaurants, and business spaces.",
  },
  {
    title: "Industrial",
    description: "For factories, warehouses, and large facilities.",
  },
];

function formatSystemSize(value: number) {
  if (value >= 1000) {
    return {
      value: (value / 1000).toFixed(1),
      unit: "MWp",
    };
  }

  return {
    value: value.toFixed(1),
    unit: "kWp",
  };
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

function isAllowedFileType(file: File) {
  const fileName = file.name.toLowerCase();

  const hasValidMimeType =
    QUOTE_ENGINE_CONFIG.upload.allowedMimeTypes.includes(file.type);

  const hasValidExtension =
    QUOTE_ENGINE_CONFIG.upload.allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

  return hasValidMimeType && hasValidExtension;
}

function buildQuotationPayload(params: {
  selectedProperty: string;
  monthlyBill: number;
  electricRate: number;
  quoteSummary: {
    monthlyKwh: number;
    systemSize: number;
    estimatedMonthlySavings: number;
    annualSavings: number;
    tenYearSavings: number;
  };
  formattedSystemSize: {
    value: string;
    unit: string;
  };
  appliances: Appliance[];
  uploadedBill: UploadedBill | null;
  proposalForm?: ProposalFormData;
}) {
  return {
    type: "quotation_request",
    submittedAt: new Date().toISOString(),

    customer: {
      fullName: params.proposalForm?.fullName?.trim() || "",
      email: params.proposalForm?.email?.trim() || "",
      phone: params.proposalForm?.phone?.trim() || "",
      company: params.proposalForm?.company?.trim() || "",
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
      configuration: `+${params.formattedSystemSize.value} ${params.formattedSystemSize.unit} Grid-Tie`,
      estimatedMonthlySavingsPhp: params.quoteSummary.estimatedMonthlySavings,
      estimatedAnnualSavingsPhp: params.quoteSummary.annualSavings,
      estimatedTenYearSavingsPhp: params.quoteSummary.tenYearSavings,
    },

    loadProfile: params.appliances.map((item) => ({
      name: item.name,
      watts: item.watts,
      quantity: item.quantity,
      hoursPerDay: item.hours,
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

export default function ASQuotationEngine() {
  const location = useLocation();
  const quoteState = (location.state ?? {}) as QuoteNavigationState;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [modal, setModal] = useState<ModalType>(null);
  const [uploadError, setUploadError] = useState("");
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

  const closeModal = () => setModal(null);

  const quoteSummary = useMemo(() => {
    const monthlyKwh = electricRate > 0 ? monthlyBill / electricRate : 0;

    const systemSize =
      monthlyKwh / QUOTE_ENGINE_CONFIG.formula.averageSolarProductionPerKwp;

    const roundedSystemSize =
      monthlyBill > 0 ? Math.max(1, Number(systemSize.toFixed(1))) : 0;

    const estimatedMonthlySavings =
      monthlyBill * QUOTE_ENGINE_CONFIG.formula.estimatedSavingsRate;

    const annualSavings =
      estimatedMonthlySavings * QUOTE_ENGINE_CONFIG.formula.monthsPerYear;

    const tenYearSavings =
      annualSavings * QUOTE_ENGINE_CONFIG.formula.projectionYears;

    return {
      monthlyKwh: Math.round(monthlyKwh),
      systemSize: roundedSystemSize,
      estimatedMonthlySavings: Math.round(estimatedMonthlySavings),
      annualSavings: Math.round(annualSavings),
      tenYearSavings: Math.round(tenYearSavings),
    };
  }, [monthlyBill, electricRate]);

  const formattedSystemSize = formatSystemSize(quoteSummary.systemSize);

  const handleMonthlyBillChange = (value: string) => {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue) || parsedValue < 0) {
      setMonthlyBill(0);
      return;
    }

    setMonthlyBill(parsedValue);
  };

  const handleElectricRateChange = (value: string) => {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue) || parsedValue <= 0) {
      setElectricRate(QUOTE_ENGINE_CONFIG.defaults.electricRate);
      return;
    }

    setElectricRate(parsedValue);
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

    const usage = watts * quantity * hours;

    setAppliances((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: item.name.trim(),
        watts,
        quantity,
        hours,
        usage,
      },
    ]);

    closeModal();
  };

  const handleSubmitProposal = async (proposalForm?: ProposalFormData) => {
    setIsSubmitting(true);

    try {
      const payload = buildQuotationPayload({
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

      if (uploadedBill?.file) {
        formData.append("billAttachment", uploadedBill.file);
      }

      const response = await fetch("/api/quotation/request-proposal", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit quotation request.");
      }

      setModal("submitted");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while submitting your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="as-quote-page">
      <div className="as-quote-container">
        <header className="as-quote-header">
          <h1>Technical Quotation Engine</h1>
          <p>Configure your institutional-grade solar system.</p>
        </header>

        <div className="as-quote-layout">
          <main className="as-quote-main">
            <div className="as-form-section">
              <div className="as-section-label">
                <span>01</span>
                <p>Property Classification</p>
              </div>

              <div className="as-property-grid">
                {propertyTypes.map((item) => (
                  <button
                    key={item.title}
                    className={`as-property-card ${
                      selectedProperty === item.title ? "is-selected" : ""
                    }`}
                    onClick={() => setSelectedProperty(item.title)}
                    type="button"
                  >
                    <span className="as-property-icon">⌂</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="as-form-section">
              <div className="as-section-label">
                <span>02</span>
                <p>Typical Electricity Rate</p>
              </div>

              <div className="as-rate-wrapper">
                <input
                  type="range"
                  min="5"
                  max="22"
                  step="0.01"
                  value={electricRate}
                  onChange={(e) => handleElectricRateChange(e.target.value)}
                />
                <div className="as-rate-value">
                  ₱{electricRate.toFixed(2)} / kWh
                </div>
              </div>
            </div>

            <div className="as-form-section">
              <div className="as-section-label">
                <span>03</span>
                <p>
                  Consumption Data <small>(Optional)</small>
                </p>
              </div>

              <div className="as-consumption-grid">
                <div className="as-input-card">
                  <label>Average Monthly Bill</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="₱ 0.00"
                    value={monthlyBill || ""}
                    onChange={(e) => handleMonthlyBillChange(e.target.value)}
                  />
                  <p>
                    {quoteSummary.monthlyKwh.toLocaleString("en-US")} kWh
                    estimated monthly usage.
                  </p>
                </div>

                <div
                  className="as-upload-card"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  role="button"
                  tabIndex={0}
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
                        Upload your bill here <span>or drag and drop</span>
                      </p>
                      <small>PDF, PNG, JPG max 10MB</small>
                    </>
                  )}

                  {uploadError && <small>{uploadError}</small>}
                </div>
              </div>
            </div>

            <div className="as-form-section">
              <div className="as-load-header">
                <div className="as-section-label">
                  <span>04</span>
                  <p>
                    Detailed Load Profile <small>(Optional)</small>
                  </p>
                </div>

                <button
                  className="as-add-btn"
                  onClick={() => setModal("add-appliance")}
                  type="button"
                >
                  + Add Appliance
                </button>
              </div>

              <div className="as-load-table">
                <div className="as-load-row as-load-head">
                  <span>Appliance / Load Name</span>
                  <span>Watts</span>
                  <span>Qty</span>
                  <span>Hours</span>
                  <span>Usage</span>
                  <span></span>
                </div>

                {appliances.length === 0 ? (
                  <div className="as-load-row">
                    <span>
                      <strong>No appliances added yet</strong>
                      <small>Add appliances to create a detailed load profile.</small>
                    </span>
                    <span>-</span>
                    <span>-</span>
                    <span>-</span>
                    <span>-</span>
                    <span></span>
                  </div>
                ) : (
                  appliances.map((item) => (
                    <div className="as-load-row" key={item.id}>
                      <span>
                        <strong>{item.name}</strong>
                        <small>Estimated appliance usage</small>
                      </span>
                      <span>{formatNumber(item.watts)}</span>
                      <span>{item.quantity}</span>
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
                  ))
                )}
              </div>
            </div>
          </main>

          <aside className="as-quote-summary">
            <div className="as-summary-card">
              <p>Estimated System Size</p>
              <h2>
                {formattedSystemSize.value}
                {formattedSystemSize.unit}
              </h2>

              <p>Configuration</p>
              <h2>
                +{formattedSystemSize.value} {formattedSystemSize.unit} Grid-Tie
              </h2>

              <p>Estimated Annual Savings</p>
              <h2>₱ {formatNumber(quoteSummary.annualSavings)} / year</h2>

              <button
                onClick={() => setModal("request-proposal")}
                disabled={isSubmitting}
                type="button"
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
    </section>
  );
}