import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";
import AddApplianceModal from "../modules/quotaion-modal/ASAddAppliance";
import RequestProposalModal from "../modules/quotaion-modal/ASProposalRequest";
import ProposalSubmittedModal from "../modules/quotaion-modal/ASProposalSubmitted";
import { sendQuotationRequest } from "../modules/quotationbuilder";
import ASSystemError from "../modules/system-error/ASSystemError";
import { useScrollLock } from "../hooks/useScrollLock";
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
import {
  formatLocalTime,
  type QuotationAppliance,
  type UploadedBill,
  type ProposalRequestFormData,
} from "../models/quotation";
import { useLocale, useT, type MessageKey } from "../i18n";

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

type Translate = ReturnType<typeof useT>;

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

/**
 * `value` is the English classification submitted to the team (payload
 * `property.classification`); the title/description keys are display only.
 */
const propertyTypes: Array<{
  value: string;
  titleKey: MessageKey;
  descriptionKey: MessageKey;
  icon: string;
  selectedIcon: string;
}> = [
  {
    value: "Residential",
    titleKey: "quotation.property.residential.title",
    descriptionKey: "quotation.property.residential.description",
    icon: residentialIcon,
    selectedIcon: residentialSelectedIcon,
  },
  {
    value: "Commercial",
    titleKey: "quotation.property.commercial.title",
    descriptionKey: "quotation.property.commercial.description",
    icon: commercialIcon,
    selectedIcon: commercialSelectedIcon,
  },
  {
    value: "Industrial",
    titleKey: "quotation.property.industrial.title",
    descriptionKey: "quotation.property.industrial.description",
    icon: industrialIcon,
    selectedIcon: industrialSelectedIcon,
  },
];

const systemPurposes: Array<{ id: SystemPurpose; labelKey: MessageKey; descriptionKey: MessageKey }> = [
  {
    id: "zero-bill",
    labelKey: "quotation.purpose.zeroBill.label",
    descriptionKey: "quotation.purpose.zeroBill.description",
  },
  {
    id: "monthly-savings",
    labelKey: "quotation.purpose.monthlySavings.label",
    descriptionKey: "quotation.purpose.monthlySavings.description",
  },
  {
    id: "peak-shaving",
    labelKey: "quotation.purpose.peakShaving.label",
    descriptionKey: "quotation.purpose.peakShaving.description",
  },
];

function formatNumber(value: number, numberFormat: string) {
  return value.toLocaleString(numberFormat, { maximumFractionDigits: 0 });
}

/**
 * Translated schedule text for an appliance row. The stored `schedule` /
 * `usageType` values stay English because they are submitted as-is.
 */
function describeSchedule(item: QuotationAppliance, t: Translate, localeTag: string): string {
  if (item.usageType === "24/7") return t("quotation.schedule.alwaysOn");
  if (item.usageType === "Estimated") return t("quotation.schedule.estimated");
  if (item.scheduleItems.length > 0) {
    return item.scheduleItems
      .map((s) => `${formatLocalTime(s.from, localeTag)} - ${formatLocalTime(s.to, localeTag)}`)
      .join(", ");
  }
  return item.schedule;
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
  const t = useT();
  const [error, setError] = useState<"" | "min" | "max">("");

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
      setError("min");
    } else if (n > ELECTRIC_RATE_CONFIG.max) {
      setError("max");
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
            <small>{t("quotation.rate.perKwh")}</small>
          </div>
        </div>
      </div>
      {error && (
        <p className="as-rate-error">
          {error === "min"
            ? t("quotation.rate.min", { value: ELECTRIC_RATE_CONFIG.min })
            : t("quotation.rate.max", { value: ELECTRIC_RATE_CONFIG.max })}
        </p>
      )}
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
  const t = useT();
  const { tag: localeTag, numberFormat } = useLocale();

  return (
    <div className="as-form-section">
      <div className="as-load-header">
        <div className="as-section-label">
          <span>{label}</span>
          <p>
            {t("quotation.sections.loadProfile")}{" "}
            {!required && <small>{t("quotation.sections.optional")}</small>}
          </p>
        </div>

        <button
          type="button"
          className="as-add-btn"
          onClick={onAdd}
        >
          {t("quotation.load.add")}
        </button>
      </div>

      <div className="as-load-table" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="as-load-table-inner">
          <div className="as-load-row as-load-head">
            <span>{t("quotation.load.colName")}</span>
            <span>{t("quotation.load.colRating")}</span>
            <span>{t("quotation.load.colQty")}</span>
            <span>{t("quotation.load.colHours")}</span>
            <span>{t("quotation.load.colDailyWh")}</span>
            <span />
          </div>

          {appliances.length === 0 ? (
            <div className="as-load-empty">
              {t("quotation.load.empty")}
            </div>
          ) : (
            <>
              {appliances.map((item) => (
                <div className="as-load-row" key={item.id}>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{describeSchedule(item, t, localeTag)}</small>
                  </span>
                  <span>{formatNumber(item.watts, numberFormat)}</span>
                  <span><b>{item.quantity}</b></span>
                  <span>{item.hours}</span>
                  <span>{formatNumber(item.usage, numberFormat)}</span>
                  <span className="as-load-actions">
                    <button
                      type="button"
                      className="as-load-edit-btn"
                      aria-label={t("quotation.load.edit", { name: item.name })}
                      onClick={() => onEdit(item)}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="as-load-remove-btn"
                      aria-label={t("quotation.load.remove", { name: item.name })}
                      onClick={() => onRemove(item.id)}
                    >
                      ×
                    </button>
                  </span>
                </div>
              ))}

              <div className="as-load-total">
                <span>{t("quotation.load.total")}</span>
                <strong>{formatNumber(totalDailyUsageWh, numberFormat)}</strong>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ASQuotationEngine() {
  const location = useLocation();
  const t = useT();
  const locale = useLocale();
  const quoteState = (location.state ?? {}) as QuoteNavigationState;

  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const [hasBill, setHasBill] = useState(true);


  const [systemPurpose, setSystemPurpose] = useState<SystemPurpose>("monthly-savings");
  const [systemType, setSystemType] = useState<SystemType>("hybrid");


  const [selectedProperty, setSelectedProperty] = useState("Residential");


  const [modal, setModal] = useState<ModalType>(null);
  const [formError, setFormError] = useState<MessageKey | "">("");
  const [uploadError, setUploadError] = useState<MessageKey | "">("");
  const [peakDurationError, setPeakDurationError] = useState<MessageKey | "">("");
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


  // Zero Bill is Residential-only; the property card's onClick resets the
  // purpose in the same event, so no effect is needed to enforce it.

  useScrollLock(Boolean(modal));


  useEffect(() => {
    fetchPackagesFromApi(locale.tag).then(setPackageCatalog).catch(() => { });
  }, [locale.tag]);

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
      setUploadError("quotation.errors.fileType");
      return;
    }

    if (file.size > UPLOAD_CONFIG.maxSizeInBytes) {
      setUploadedBill(null);
      setUploadError("quotation.errors.fileSize");
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


  const validateBeforeProposal = (): MessageKey | "" => {
    if (!selectedProperty) return "quotation.errors.property";

    if (systemPurpose === "monthly-savings") {
      if (savingsTarget.num <= 0) return "quotation.errors.savingsTarget";
      if (electricRateMS.num <= 0) return "quotation.errors.rate";
    }

    if (systemPurpose === "peak-shaving") {
      if (peakPower.num <= 0) return "quotation.errors.peakPower";
      if (peakPower.num <= allowedGridPower.num) {
        return "quotation.errors.peakVsGrid";
      }
      if (peakDuration.num <= 0 || peakDuration.num > 24) return "quotation.errors.peakDuration";
    }

    if (systemPurpose === "zero-bill") {
      if (!hasBill && appliances.length === 0) {
        return "quotation.errors.billOrAppliances";
      }
      if (hasBill) {
        if (monthlyBillZB.num <= 0) return "quotation.errors.monthlyBill";
        if (electricRateZB.num <= 0) return "quotation.errors.rate";
      }
    }

    if (!engineResult) {
      return "quotation.errors.compute";
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
        locale: locale.tag,
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
          <p>{t("quotation.sections.systemType")}</p>
        </div>

        <div className="as-quote-mode-toggle" data-active={systemType === "hybrid" ? 0 : 1}>
          <button
            type="button"
            className={systemType === "hybrid" ? "is-active" : ""}
            onClick={() => { setSystemType("hybrid"); setFormError(""); }}
          >
            {t("quotation.systemType.hybrid")}
          </button>
          <button
            type="button"
            className={systemType === "grid-tied" ? "is-active" : ""}
            onClick={() => { setSystemType("grid-tied"); setFormError(""); }}
          >
            {t("quotation.systemType.gridTied")}
          </button>
        </div>
      </div>

      <div className="as-form-section">
        <div className="as-section-label">
          <span>04</span>
          <p>{t("quotation.sections.savingsTarget")}</p>
        </div>

        <div className="as-consumption-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="as-input-card">
            <label>{t("quotation.savings.label")}</label>
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
              <small>{t("quotation.savings.unit")}</small>
            </div>
            <p>{t("quotation.savings.hint")}</p>
          </div>
        </div>
      </div>

      <div className="as-form-section">
        <div className="as-section-label">
          <span>05</span>
          <p>{t("quotation.sections.electricityRate")}</p>
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
          <p>{t("quotation.sections.peakShaving")}</p>
        </div>

        <div className="as-consumption-grid">
          <div className="as-input-card">
            <label>{t("quotation.peak.powerLabel")}</label>
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
            <p>{t("quotation.peak.powerHint")}</p>
          </div>

          <div className="as-input-card">
            <label>{t("quotation.peak.gridLabel")}</label>
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
            <p>{t("quotation.peak.gridHint")}</p>
          </div>

          <div className="as-input-card">
            <label>{t("quotation.peak.durationLabel")}</label>
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
                        ? "quotation.peak.durationMax"
                        : Number(e.target.value) <= 0
                          ? "quotation.peak.durationMin"
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
              <small>{t("quotation.peak.durationUnit")}</small>
            </div>
            <p>{t("quotation.peak.durationHint")}</p>
            {peakDurationError && <p className="as-rate-error">{t(peakDurationError)}</p>}
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
              <p>{t("quotation.sections.consumption")}</p>
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
                    <small>{t("quotation.bill.replace")}</small>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUploadedBill();
                      }}
                    >
                      {t("quotation.bill.remove")}
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="upload-highlight">{t("quotation.bill.upload")}</span>{" "}
                      {t("quotation.bill.dragDrop")}
                    </p>
                    <small>{t("quotation.bill.formats")}</small>
                  </>
                )}

                {uploadError && (
                  <small className="as-form-error">{t(uploadError)}</small>
                )}
              </div>

              <div className="as-input-card">
                <label>{t("quotation.bill.averageLabel")}</label>
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
                  <small>{t("quotation.bill.currency")}</small>
                </div>
                <p>{t("quotation.bill.averageHint")}</p>
              </div>
            </div>
          </div>

          <div className="as-form-section">
            <div className="as-section-label">
              <span>04</span>
              <p>{t("quotation.sections.typicalRate")}</p>
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
          <h1>{t("quotation.header.title")}</h1>
          <p>{t("quotation.header.subtitle")}</p>

          <div className="as-quote-mode-toggle as-bill-toggle" data-active={hasBill ? 0 : 1}>
            <button
              type="button"
              className={hasBill ? "is-active" : ""}
              onClick={() => { setHasBill(true); setFormError(""); }}
            >
              {t("quotation.header.hasBill")}
            </button>
            <button
              type="button"
              className={!hasBill ? "is-active" : ""}
              onClick={() => { setHasBill(false); setFormError(""); }}
            >
              {t("quotation.header.noBill")}
            </button>
          </div>
        </header>

        <div className="as-quote-layout">
          <main className="as-quote-main">
            {/* Section 01: Property Classification */}
            <div className="as-form-section">
              <div className="as-section-label">
                <span>01</span>
                <p>{t("quotation.sections.property")}</p>
              </div>

              <div className="as-property-grid">
                {propertyTypes.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`as-property-card ${selectedProperty === item.value ? "is-selected" : ""}`}
                    onClick={() => {
                      setSelectedProperty(item.value);
                      if (item.value !== "Residential" && systemPurpose === "zero-bill") {
                        setSystemPurpose("monthly-savings");
                        setFormError("");
                        setAppliances([]);
                      }
                    }}
                  >
                    <div className="as-property-bg">
                      <span className="as-property-icon">
                        <img src={selectedProperty === item.value ? item.selectedIcon : item.icon} alt={t(item.titleKey)} />
                      </span>
                      <span className="as-property-check" />
                    </div>
                    <span className="as-card-title">{t(item.titleKey)}</span>
                    <p>{t(item.descriptionKey)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 02: System Purpose */}
            <div className="as-form-section">
              <div className="as-section-label">
                <span>02</span>
                <p>{t("quotation.sections.purpose")}</p>
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
                      <span className="as-card-title">{t(item.labelKey)}</span>
                      <p>{t(item.descriptionKey)}</p>
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

            {formError && <div className="as-page-error">{t(formError)}</div>}
          </main>

          {/* Summary panel */}
          <aside className="as-quote-summary">
            <div className="as-summary-card">
              <p className="as-summary-title">{t("quotation.summary.title")}</p>
              <p>{t("quotation.summary.inverter")}</p>
              <p className="as-summary-value">
                {engineResult
                  ? t("quotation.summary.inverterValue", {
                    kw: engineResult.inverterKw,
                    type: t(
                      engineResult.systemType === "grid-tied"
                        ? "quotation.summary.gridTie"
                        : "quotation.summary.hybrid"
                    ),
                  })
                  : "—"}
              </p>

              <p>{t("quotation.summary.solar")}</p>
              <p className="as-summary-value">
                {engineResult
                  ? t("quotation.summary.solarValue", { kwp: engineResult.solarKwp.toFixed(1) })
                  : "—"}
              </p>

              <p>{t("quotation.summary.storage")}</p>
              <p className="as-summary-value">
                {engineResult
                  ? engineResult.storageKwh > 0
                    ? t("quotation.summary.storageValue", { kwh: engineResult.storageKwh })
                    : t("quotation.summary.noBattery")
                  : "—"}
              </p>

              <button
                type="button"
                onClick={handleOpenProposal}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("quotation.summary.submitting") : t("quotation.summary.submit")}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {modalLayer}
    </section>
  );
}
