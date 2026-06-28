import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";
import { useSeoMeta } from "../hooks/useSeoMeta";
import AddApplianceModal from "../modules/quotaion-modal/ASAddAppliance";
import RequestProposalModal from "../modules/quotaion-modal/ASProposalRequest";
import ProposalSubmittedModal from "../modules/quotaion-modal/ASProposalSubmitted";
import { sendQuotationRequest } from "../modules/quotationbuilder";
import ASSystemError from "../modules/system-error/ASSystemError";
import {
  computeDpt,
  computeDailyLoadMetrics,
  calculateMonthlySavingsHybrid,
  calculateMonthlySavingsGridTied,
  calculatePeakShaving,
  calculateZeroBillBillOnly,
  calculateZeroBillWithLoadProfile,
  calculateZeroBillLoadOnly,
  ELECTRIC_RATE_CONFIG,
} from "../models/calculation";
import type { EngineResult, SystemPurpose, SystemType } from "../models/calculation";
import { SOLAR_PACKAGES, fetchPackagesFromApi, type SolarPackage } from "../models/packages";
import type {
  QuotationAppliance,
  UploadedBill,
  ProposalRequestFormData,
} from "../models/quotation";

import residentialIcon from "../assets/logos/quotation-page/residential.svg";
import residentialSelectedIcon from "../assets/logos/quotation-page/residential-selected.svg";
import commercialIcon from "../assets/logos/quotation-page/commercial.svg";
import commercialSelectedIcon from "../assets/logos/quotation-page/commercial-selected.svg";
import industrialIcon from "../assets/logos/quotation-page/indurstrial.svg";
import industrialSelectedIcon from "../assets/logos/quotation-page/industrial-selected.svg";

type ModalType =
  | "add-appliance"
  | "request-proposal"
  | "submitted"
  | "system-error"
  | null;

type QuoteNavigationState = {
  monthlyBill?: number;
  electricRate?: number;
  estimatedMonthlySavings?: number;
};


const UPLOAD_CONFIG = {
  maxSizeInBytes: 10 * 1024 * 1024,
  allowedMimeTypes: ["application/pdf", "image/png", "image/jpeg"],
  allowedExtensions: [".pdf", ".png", ".jpg", ".jpeg"],
};

const propertyTypes = [
  {
    title: "Residential",
    icon: residentialIcon,
    selectedIcon: residentialSelectedIcon,
    description: "Standard detached housing or townhouses. Optimized for rooftop efficiency.",
  },
  {
    title: "Commercial",
    icon: commercialIcon,
    selectedIcon: commercialSelectedIcon,
    description: "Office buildings, retail spaces, and warehouses. Higher load capacity sizing.",
  },
  {
    title: "Industrial",
    icon: industrialIcon,
    selectedIcon: industrialSelectedIcon,
    description: "Manufacturing plants and large facilities. High-voltage integration focused.",
  },
];

const systemPurposes: Array<{ id: SystemPurpose; label: string; description: string }> = [
  {
    id: "zero-bill",
    label: "Zero Bill / Off-Grid",
    description: "Eliminate your electricity bill completely. Covers full day and night load with solar and battery.",
  },
  {
    id: "monthly-savings",
    label: "Monthly Savings",
    description: "Target a specific monthly savings amount. Size the system to offset a portion of your electricity bill.",
  },
  {
    id: "peak-shaving",
    label: "Peak Shaving",
    description: "Reduce peak demand charges. Battery discharges during peak hours to lower your maximum grid draw.",
  },
];

function formatNumber(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}


function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

function normalizeDecimalInput(value: string) {
  let cleaned = value.replace(/[^\d.]/g, "");
  cleaned = cleaned.replace(/(\..*?)\..*/g, "$1");
  cleaned = cleaned.replace(/^0+(?=\d)/, "");
  const dot = cleaned.indexOf(".");
  if (dot !== -1) cleaned = cleaned.slice(0, dot + 3);
  return cleaned;
}

function isAllowedFileType(file: File) {
  const fileName = file.name.toLowerCase();
  return (
    UPLOAD_CONFIG.allowedMimeTypes.includes(file.type) &&
    UPLOAD_CONFIG.allowedExtensions.some((ext) => fileName.endsWith(ext))
  );
}

function useNumericInput(initial: number) {
  const [num, setNum] = useState(initial);
  const [str, setStr] = useState(initial > 0 ? String(initial) : "");

  const handleChange = (value: string) => {
    const cleaned = normalizeDecimalInput(value);
    setStr(cleaned);
    const parsed = Number(cleaned);
    setNum(cleaned === "" || cleaned === "." || Number.isNaN(parsed) || parsed < 0 ? 0 : parsed);
  };

  return { num, str, handleChange, setNum, setStr };
}



function ElectricRateField({
  num,
  str,
  onChange,
}: {
  num: number;
  str: string;
  onChange: (v: string) => void;
}) {
  const [error, setError] = useState("");

  const clampedNum = Math.min(
    ELECTRIC_RATE_CONFIG.max,
    Math.max(ELECTRIC_RATE_CONFIG.min, num || ELECTRIC_RATE_CONFIG.min)
  );

  const handleTextChange = (value: string) => {
    const cleaned = normalizeDecimalInput(value);
    onChange(cleaned);
    if (cleaned === "" || cleaned === ".") {
      setError("");
      return;
    }
    const n = Number(cleaned);
    if (n < ELECTRIC_RATE_CONFIG.min) {
      setError(`Minimum value is ₱${ELECTRIC_RATE_CONFIG.min} / kWh`);
    } else if (n > ELECTRIC_RATE_CONFIG.max) {
      setError(`Maximum value is ₱${ELECTRIC_RATE_CONFIG.max} / kWh`);
    } else {
      setError("");
    }
  };

  const handleBlur = () => {
    const n = Number(str);
    const clamped = Math.min(
      ELECTRIC_RATE_CONFIG.max,
      Math.max(ELECTRIC_RATE_CONFIG.min, !n || n <= 0 ? ELECTRIC_RATE_CONFIG.min : n)
    );
    onChange(String(parseFloat(clamped.toFixed(2))));
    setError("");
  };

  return (
    <div>
      <div className="as-rate-wrapper">
        <div className="as-rate-slider-area">
          <div className="as-rate-labels">
            <span>₱{ELECTRIC_RATE_CONFIG.min}</span>
            <span>₱{ELECTRIC_RATE_CONFIG.max}</span>
          </div>
          <input
            type="range"
            min={ELECTRIC_RATE_CONFIG.min}
            max={ELECTRIC_RATE_CONFIG.max}
            step={ELECTRIC_RATE_CONFIG.step}
            value={clampedNum}
            onChange={(e) => { onChange(e.target.value); setError(""); }}
          />
        </div>
        <div className="as-rate-input-group">
          <div className="as-rate-value">
            <span>₱</span>
            <input
              type="text"
              inputMode="decimal"
              value={str}
              onChange={(e) => handleTextChange(e.target.value)}
              onBlur={handleBlur}
            />
            <small>/ kWh</small>
          </div>
        </div>
      </div>
      {error && <p className="as-rate-error">{error}</p>}
    </div>
  );
}

function LoadProfileSection({
  label,
  required,
  appliances,
  totalDailyUsageWh,
  onAdd,
  onRemove,
  onEdit,
}: {
  label: string;
  required?: boolean;
  appliances: QuotationAppliance[];
  totalDailyUsageWh: number;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onEdit: (appliance: QuotationAppliance) => void;
}) {
  return (
    <div className="as-form-section">
      <div className="as-load-header">
        <div className="as-section-label">
          <span>{label}</span>
          <p>
            Detailed Load Profile{" "}
            {!required && <small>(Optional)</small>}
          </p>
        </div>

        <button
          type="button"
          className="as-add-btn"
          onClick={onAdd}
        >
          + Add Appliance
        </button>
      </div>

      <div className="as-load-table" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                  <span><b>{item.quantity}</b></span>
                  <span>{item.hours}</span>
                  <span>{formatNumber(item.usage)}</span>
                  <span className="as-load-actions">
                    <button
                      type="button"
                      className="as-load-edit-btn"
                      onClick={() => onEdit(item)}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="as-load-remove-btn"
                      onClick={() => onRemove(item.id)}
                    >
                      ×
                    </button>
                  </span>
                </div>
              ))}

              <div className="as-load-total">
                <span>Total Watt-Hours</span>
                <strong>{formatNumber(totalDailyUsageWh)}</strong>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ASQuotationEngine() {
  useSeoMeta({
    title: "Free Solar Savings Calculator — Bohol, Philippines",
    description: "Estimate your solar system size and monthly savings with our free solar calculator. Enter your electricity bill to find the right package — serving Bohol & the Philippines.",
    canonical: "https://azari.solar/solar-calculator",
  });
  const location = useLocation();
  const quoteState = (location.state ?? {}) as QuoteNavigationState;

  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const [hasBill, setHasBill] = useState(true);


  const [systemPurpose, setSystemPurpose] = useState<SystemPurpose>("monthly-savings");
  const [systemType, setSystemType] = useState<SystemType>("hybrid");


  const [selectedProperty, setSelectedProperty] = useState("Residential");


  const [modal, setModal] = useState<ModalType>(null);
  const [formError, setFormError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [peakDurationError, setPeakDurationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<EngineResult | null>(null);
  const [packageCatalog, setPackageCatalog] = useState<SolarPackage[]>(SOLAR_PACKAGES);


  const [appliances, setAppliances] = useState<QuotationAppliance[]>([]);
  const [editingAppliance, setEditingAppliance] = useState<QuotationAppliance | null>(null);
  const [uploadedBill, setUploadedBill] = useState<UploadedBill | null>(null);


  const savingsTarget = useNumericInput(quoteState.estimatedMonthlySavings ?? 0);
  const electricRateMS = useNumericInput(quoteState.electricRate ?? ELECTRIC_RATE_CONFIG.min);


  const peakPower = useNumericInput(0);
  const allowedGridPower = useNumericInput(0);
  const peakDuration = useNumericInput(0);


  const monthlyBillZB = useNumericInput(
    quoteState.monthlyBill ?? 5000
  );
  const electricRateZB = useNumericInput(
    quoteState.electricRate ?? ELECTRIC_RATE_CONFIG.defaultValue
  );

  const closeModal = () => setModal(null);


  useEffect(() => {
    if (systemPurpose === "zero-bill" && selectedProperty !== "Residential") {
      setSystemPurpose("monthly-savings");
    }
  }, [selectedProperty, systemPurpose]);


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


  useEffect(() => {
    fetchPackagesFromApi().then(setPackageCatalog).catch(() => { });
  }, []);

  const { duec, nwec, totalDailyUsageWh } = useMemo(
    () => computeDailyLoadMetrics(appliances),
    [appliances]
  );

  const engineResult = useMemo((): EngineResult | null => {
    if (systemPurpose === "monthly-savings") {
      const dpt = computeDpt(savingsTarget.num, electricRateMS.num);
      if (dpt <= 0) return null;
      return systemType === "hybrid"
        ? calculateMonthlySavingsHybrid(dpt, duec)
        : calculateMonthlySavingsGridTied(dpt, duec);
    }

    if (systemPurpose === "peak-shaving") {
      const gap = peakPower.num - allowedGridPower.num;
      if (peakPower.num <= 0 || gap <= 0 || peakDuration.num <= 0 || peakDuration.num > 24) return null;
      return calculatePeakShaving(peakPower.num, allowedGridPower.num, peakDuration.num);
    }

    if (systemPurpose === "zero-bill") {
      const hasProfile = appliances.length > 0;
      if (hasBill && !hasProfile) {
        if (monthlyBillZB.num <= 0 || electricRateZB.num <= 0) return null;
        return calculateZeroBillBillOnly(monthlyBillZB.num, electricRateZB.num);
      }
      if (hasBill && hasProfile) {
        if (monthlyBillZB.num <= 0 || electricRateZB.num <= 0) return null;
        return calculateZeroBillWithLoadProfile(monthlyBillZB.num, electricRateZB.num, nwec);
      }
      if (!hasProfile) return null;
      return calculateZeroBillLoadOnly(duec, nwec);
    }

    return null;
  }, [
    systemPurpose, systemType,
    savingsTarget.num, electricRateMS.num,
    peakPower.num, allowedGridPower.num, peakDuration.num,
    hasBill, monthlyBillZB.num, electricRateZB.num,
    duec, nwec, appliances.length,
  ]);




  const handleApplianceSubmit = (
    item: Omit<QuotationAppliance, "id" | "usage" | "dayUsage" | "nightUsage">
  ) => {
    const w = Number(item.watts);
    const q = Number(item.quantity);
    const h = Number(item.hours);

    if (!item.name?.trim() || w <= 0 || q <= 0 || h <= 0) return;

    const built: QuotationAppliance = {
      id: editingAppliance?.id ?? crypto.randomUUID(),
      name: item.name.trim(),
      watts: w,
      quantity: q,
      hours: h,
      dayHours: item.dayHours,
      nightHours: item.nightHours,
      schedule: item.schedule,
      scheduleItems: item.scheduleItems,
      usageType: item.usageType,
      usage: w * q * h,
      dayUsage: w * q * item.dayHours,
      nightUsage: w * q * item.nightHours,
    };

    if (editingAppliance) {
      setAppliances((current) =>
        current.map((a) => (a.id === editingAppliance.id ? built : a))
      );
    } else {
      setAppliances((current) => [...current, built]);
    }

    setEditingAppliance(null);
    setFormError("");
    closeModal();
  };

  const handleRemoveAppliance = useCallback((id: string) => {
    setAppliances((current) => current.filter((a) => a.id !== id));
  }, []);


  const handleFileUpload = (file?: File) => {
    setUploadError("");
    if (!file) return;

    if (!isAllowedFileType(file)) {
      setUploadedBill(null);
      setUploadError("Only PDF, PNG, JPG, and JPEG files are allowed.");
      return;
    }

    if (file.size > UPLOAD_CONFIG.maxSizeInBytes) {
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

  const handleRemoveUploadedBill = () => {
    setUploadedBill(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const validateBeforeProposal = (): string => {
    if (!selectedProperty) return "Please select a property classification.";

    if (systemPurpose === "monthly-savings") {
      if (savingsTarget.num <= 0) return "Please enter a monthly savings target.";
      if (electricRateMS.num <= 0) return "Please enter a valid electricity rate.";
    }

    if (systemPurpose === "peak-shaving") {
      if (peakPower.num <= 0) return "Please enter your peak power demand.";
      if (peakPower.num <= allowedGridPower.num) {
        return "Peak power must be greater than the allowed grid power.";
      }
      if (peakDuration.num <= 0 || peakDuration.num > 24) return "Please enter a valid peak duration (between 0 and 24 hours).";
    }

    if (systemPurpose === "zero-bill") {
      if (!hasBill && appliances.length === 0) {
        return "Please enter a bill or add appliances to size the system.";
      }
      if (hasBill) {
        if (monthlyBillZB.num <= 0) return "Please enter your monthly electricity bill.";
        if (electricRateZB.num <= 0) return "Please enter a valid electricity rate.";
      }
    }

    if (!engineResult) {
      return "Unable to compute system size. Please check your inputs.";
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
    setAppliances([]);
    setUploadedBill(null);
    setFormError("");
    savingsTarget.setStr("");
    savingsTarget.setNum(0);
  };

  const handleSubmitProposal = async (proposalForm?: ProposalRequestFormData) => {
    const error = validateBeforeProposal();
    if (error) {
      setFormError(error);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendQuotationRequest({
        systemPurpose,
        systemType: engineResult!.systemType,
        selectedProperty,
        monthlySavingsTarget: savingsTarget.num,
        monthlyBill: hasBill ? monthlyBillZB.num : 0,
        electricRate:
          systemPurpose === "zero-bill" ? electricRateZB.num : electricRateMS.num,
        peakPower: peakPower.num,
        allowedGridPower: allowedGridPower.num,
        peakDuration: peakDuration.num,
        engineResult: engineResult!,
        appliances,
        uploadedBill,
        proposalForm,
      });

      if (result.isRealSuccess) {
        setSubmittedResult(engineResult!);
        resetForm();
        setModal("submitted");
        return;
      }

      // Rate-limit banner is already showing; close the proposal modal so the
      // user can see the countdown without a system-error dialog on top of it.
      if (result.rateLimited) {
        closeModal();
        return;
      }

      setModal("system-error");
    } finally {
      setIsSubmitting(false);
    }
  };



  const monthlySavingsContent = (
    <>
      <div className="as-form-section">
        <div className="as-section-label">
          <span>03</span>
          <p>System Type</p>
        </div>

        <div className="as-quote-mode-toggle" data-active={systemType === "hybrid" ? 0 : 1}>
          <button
            type="button"
            className={systemType === "hybrid" ? "is-active" : ""}
            onClick={() => { setSystemType("hybrid"); setFormError(""); }}
          >
            Hybrid (with Battery)
          </button>
          <button
            type="button"
            className={systemType === "grid-tied" ? "is-active" : ""}
            onClick={() => { setSystemType("grid-tied"); setFormError(""); }}
          >
            Grid-Tied (No Battery)
          </button>
        </div>
      </div>

      <div className="as-form-section">
        <div className="as-section-label">
          <span>04</span>
          <p>Monthly Savings Target</p>
        </div>

        <div className="as-consumption-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="as-input-card">
            <label>Target Monthly Savings</label>
            <div className="as-currency-input">
              <span>₱</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={savingsTarget.str}
                onChange={(e) => {
                  savingsTarget.handleChange(e.target.value);
                  setFormError("");
                }}
              />
              <small>PHP / mo</small>
            </div>
            <p>The amount you want to reduce from your monthly bill.</p>
          </div>
        </div>
      </div>

      <div className="as-form-section">
        <div className="as-section-label">
          <span>05</span>
          <p>Electricity Rate</p>
        </div>

        <ElectricRateField
          num={electricRateMS.num}
          str={electricRateMS.str}
          onChange={(v) => { electricRateMS.handleChange(v); setFormError(""); }}
        />
      </div>

      <LoadProfileSection
        label="06"
        appliances={appliances}
        totalDailyUsageWh={totalDailyUsageWh}
        onAdd={() => { setEditingAppliance(null); setModal("add-appliance"); }}
        onRemove={handleRemoveAppliance}
        onEdit={(a) => { setEditingAppliance(a); setModal("add-appliance"); }}
      />
    </>
  );

  const peakShavingContent = (
    <>
      <div className="as-form-section">
        <div className="as-section-label">
          <span>03</span>
          <p>Peak Shaving Parameters</p>
        </div>

        <div className="as-consumption-grid">
          <div className="as-input-card">
            <label>Peak Power Demand</label>
            <div className="as-currency-input">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={peakPower.str}
                onChange={(e) => {
                  peakPower.handleChange(e.target.value);
                  setFormError("");
                }}
              />
              <small>kW</small>
            </div>
            <p>Your facility's maximum power demand during peak hours.</p>
          </div>

          <div className="as-input-card">
            <label>Allowed Grid Power</label>
            <div className="as-currency-input">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={allowedGridPower.str}
                onChange={(e) => {
                  allowedGridPower.handleChange(e.target.value);
                  setFormError("");
                }}
              />
              <small>kW</small>
            </div>
            <p>Maximum grid draw allowed. Battery covers the rest.</p>
          </div>

          <div className="as-input-card">
            <label>Peak Duration</label>
            <div className="as-currency-input">
              <input
                type="text"
                inputMode="decimal"
                placeholder="4"
                value={peakDuration.str}
                onChange={(e) => {
                  peakDuration.handleChange(e.target.value);
                  setFormError("");
                  setPeakDurationError(
                    e.target.value === "" || e.target.value === "."
                      ? ""
                      : Number(e.target.value) > 24
                        ? "Maximum is 24 hours."
                        : Number(e.target.value) <= 0
                          ? "Must be greater than 0."
                          : ""
                  );
                }}
                onBlur={() => {
                  if (peakDuration.num > 24) {
                    peakDuration.handleChange("24");
                    setPeakDurationError("");
                  } else if (peakDuration.num <= 0 && peakDuration.str !== "") {
                    peakDuration.handleChange("");
                    setPeakDurationError("");
                  }
                }}
              />
              <small>hrs</small>
            </div>
            <p>Decimals count as minutes (e.g. 1.5 = 1h 30m). Max 24 hrs.</p>
            {peakDurationError && <p className="as-rate-error">{peakDurationError}</p>}
          </div>
        </div>
      </div>

    </>
  );

  const zeroBillContent = (
    <>
      {hasBill && (
        <>
          <div className="as-form-section">
            <div className="as-section-label">
              <span>03</span>
              <p>Consumption Data</p>
            </div>

            <div className="as-consumption-grid">
              <div
                className="as-upload-card"
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
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
                      <span className="upload-highlight">Upload your electricity bill</span>{" "}
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
                    value={monthlyBillZB.str}
                    onChange={(e) => {
                      monthlyBillZB.handleChange(e.target.value);
                      setFormError("");
                    }}
                  />
                  <small>PHP</small>
                </div>
                <p>Based on your recent electricity bill.</p>
              </div>
            </div>
          </div>

          <div className="as-form-section">
            <div className="as-section-label">
              <span>04</span>
              <p>Typical Electricity Rate</p>
            </div>
            <ElectricRateField
              num={electricRateZB.num}
              str={electricRateZB.str}
              onChange={(v) => { electricRateZB.handleChange(v); setFormError(""); }}
            />
          </div>
        </>
      )}

      <LoadProfileSection
        label={hasBill ? "05" : "03"}
        appliances={appliances}
        totalDailyUsageWh={totalDailyUsageWh}
        onAdd={() => { setEditingAppliance(null); setModal("add-appliance"); }}
        onRemove={handleRemoveAppliance}
        onEdit={(a) => { setEditingAppliance(a); setModal("add-appliance"); }}
      />
    </>
  );

  const modalLayer =
    modal && typeof document !== "undefined"
      ? createPortal(
        <>
          {modal === "add-appliance" && (
            <AddApplianceModal
              onClose={() => { setEditingAppliance(null); closeModal(); }}
              onSubmit={handleApplianceSubmit}
              initial={editingAppliance ?? undefined}
            />
          )}

          {modal === "request-proposal" && (
            <RequestProposalModal
              onClose={closeModal}
              onSubmit={handleSubmitProposal}
              isSubmitting={isSubmitting}
            />
          )}

          {modal === "submitted" && (
            <ProposalSubmittedModal
              onClose={closeModal}
              engineResult={submittedResult}
              propertyType={selectedProperty}
              catalog={packageCatalog}
            />
          )}

          {modal === "system-error" && <ASSystemError onClose={closeModal} />}
        </>,
        document.body
      )
      : null;

  return (
    <section className="as-quote-page">
      <div className="as-quote-container">
        <header className="as-quote-header">
          <h1>Solar Power System Calculator</h1>
          <p>Configure your institutional-grade solar system.</p>

          <div className="as-quote-mode-toggle as-bill-toggle" data-active={hasBill ? 0 : 1}>
            <button
              type="button"
              className={hasBill ? "is-active" : ""}
              onClick={() => { setHasBill(true); setFormError(""); }}
            >
              I have a bill
            </button>
            <button
              type="button"
              className={!hasBill ? "is-active" : ""}
              onClick={() => { setHasBill(false); setFormError(""); }}
            >
              No bill yet
            </button>
          </div>
        </header>

        <div className="as-quote-layout">
          <main className="as-quote-main">
            {/* Section 01: Property Classification */}
            <div className="as-form-section">
              <div className="as-section-label">
                <span>01</span>
                <p>Property Classification</p>
              </div>

              <div className="as-property-grid">
                {propertyTypes.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className={`as-property-card ${selectedProperty === item.title ? "is-selected" : ""}`}
                    onClick={() => {
                      setSelectedProperty(item.title);
                      if (item.title !== "Residential" && systemPurpose === "zero-bill") {
                        setSystemPurpose("monthly-savings");
                        setFormError("");
                        setAppliances([]);
                      }
                    }}
                  >
                    <div className="as-property-bg">
                      <span className="as-property-icon">
                        <img src={selectedProperty === item.title ? item.selectedIcon : item.icon} alt={item.title} />
                      </span>
                      <span className="as-property-check" />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 02: System Purpose */}
            <div className="as-form-section">
              <div className="as-section-label">
                <span>02</span>
                <p>System Purpose</p>
              </div>

              <div className="as-property-grid">
                {systemPurposes
                  .filter((item) => !(item.id === "zero-bill" && selectedProperty !== "Residential"))
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`as-property-card ${systemPurpose === item.id ? "is-selected" : ""}`}
                      onClick={() => {
                        setSystemPurpose(item.id);
                        setFormError("");
                        setAppliances([]);
                      }}
                    >
                      <span className="as-property-check" />
                      <h3>{item.label}</h3>
                      <p>{item.description}</p>
                    </button>
                  ))}
              </div>
            </div>

            {/* Purpose-specific sections — key forces re-mount (re-fires enter animation) on purpose change */}
            <div key={systemPurpose} style={{ display: "contents" }}>
              {systemPurpose === "monthly-savings" && monthlySavingsContent}
              {systemPurpose === "peak-shaving" && peakShavingContent}
              {systemPurpose === "zero-bill" && zeroBillContent}
            </div>

            {formError && <div className="as-page-error">{formError}</div>}
          </main>

          {/* Summary panel */}
          <aside className="as-quote-summary">
            <div className="as-summary-card">
              <p className="as-summary-title">Recommended System Specifications</p>
              <p>Inverter Capacity and Types</p>
              <h2>
                {engineResult
                  ? `${engineResult.inverterKw}kW ${engineResult.systemType === "grid-tied" ? "Grid-Tie" : "Hybrid"}`
                  : "—"}
              </h2>

              <p>Solar Panel Capacity</p>
              <h2>
                {engineResult ? `~${engineResult.solarKwp.toFixed(1)} kWp` : "—"}
              </h2>

              <p>Storage Capacity</p>
              <h2>
                {engineResult
                  ? engineResult.storageKwh > 0 ? `${engineResult.storageKwh} kWh` : "No Battery"
                  : "—"}
              </h2>

              <button
                type="button"
                onClick={handleOpenProposal}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Request Proposal"}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {modalLayer}
    </section>
  );
}
