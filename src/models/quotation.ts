import type { MessageKey } from "../i18n/messages";
import {
  SOLAR_CONSTANTS,
  formatSystemSize,
} from "./calculation";
import type { SystemPurpose, SystemType, EngineResult } from "./calculation";

export type { SystemPurpose, SystemType };

export type QuoteMode = "with-bill" | "no-bill";

export type QuotationAppliance = {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hours: number;
  dayHours: number;
  nightHours: number;
  schedule: string;
  scheduleItems: Array<{ from: string; to: string }>;
  usageType: string;
  usage: number;
  dayUsage: number;
  nightUsage: number;
};

export type UploadedBill = {
  file: File;
  name: string;
  type: string;
  size: number;
};

export type ProposalRequestFormData = {
  fullName: string;
  location: string;
  email: string;
  phone: string;
  message: string;
};

export type ProposalRequestField = keyof ProposalRequestFormData;

/** Message key of a proposal-form validation error, translated at render time. */
export type ProposalRequestErrorKey = Extract<MessageKey, `quotation.validation.${string}`>;

export type ProposalRequestErrors = Partial<Record<ProposalRequestField, ProposalRequestErrorKey>>;

export type QuoteSummary = {
  monthlyKwh: number;
  systemSize: number;
  estimatedMonthlySavings: number;
  projectedSavings: number;
  totalDailyUsageWh: number;
};

export type FormattedSystemSize = {
  value: string;
  unit: string;
};

export type QuotationRequestPayload = {
  type: "quotation_request";
  submittedAt: string;
  systemPurpose: SystemPurpose;
  systemType: SystemType;
  customer: ProposalRequestFormData;
  property: {
    classification: string;
  };
  consumption: {
    averageMonthlyBillPhp: number;
    monthlySavingsTargetPhp: number;
    electricRatePhpPerKwh: number;
    estimatedMonthlyKwh: number;
    peakPowerKw: number;
    allowedGridPowerKw: number;
    peakDurationHours: number;
  };
  solarEstimate: {
    estimatedSystemSize: {
      rawKwp: number;
      displayValue: string;
      displayUnit: string;
      displayText: string;
    };
    inverterSizeKw: number;
    storageCapacityKwh: number;
    configuration: string;
    estimatedMonthlySavingsPhp: number;
    estimatedProjectedSavingsPhp: number;
    projectionMonths: number;
    totalDailyUsageWh: number;
    totalDayUsageWh: number;
    totalNightUsageWh: number;
  };
  loadProfile: Array<{
    name: string;
    watts: number;
    quantity: number;
    hoursPerDay: number;
    dayHoursPerDay: number;
    nightHoursPerDay: number;
    schedule: string;
    usageType: string;
    estimatedUsageWhPerDay: number;
  }>;
  billAttachment: {
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    sizeDisplay: string;
  } | null;
  /** BCP-47 tag of the language the visitor used; every other field stays English. */
  locale: string;
};

export type QuotationBuilderParams = {
  systemPurpose: SystemPurpose;
  systemType: SystemType;
  selectedProperty: string;
  monthlySavingsTarget: number;
  monthlyBill: number;
  electricRate: number;
  peakPower: number;
  allowedGridPower: number;
  peakDuration: number;
  engineResult: EngineResult;
  appliances: QuotationAppliance[];
  uploadedBill: UploadedBill | null;
  proposalForm?: ProposalRequestFormData;
  /** BCP-47 tag of the visitor's language (e.g. "en-PH", "fil"). */
  locale: string;
};

export type QuotationSubmissionResult = {
  success: boolean;
  isRealSuccess: boolean;
  rateLimited?: boolean;
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

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

/** Locale-aware "HH:mm" text for an "HH:mm" time value. Display only, never submitted. */
export function formatLocalTime(value: string, localeTag: string): string {
  if (!value) return "--:--";
  const [hour, minute] = value.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;
  return new Intl.DateTimeFormat(localeTag, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, 0, 1, hour, minute)));
}

export function sanitizeProposalRequestForm(
  formData: ProposalRequestFormData
): ProposalRequestFormData {
  return {
    fullName: formData.fullName.trim(),
    location: formData.location.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: formData.phone.trim().replace(/[\s-]/g, ""),
    message: formData.message.trim(),
  };
}

export function validateProposalRequestField(
  field: ProposalRequestField,
  value: string
): ProposalRequestErrorKey | "" {
  const trimmedValue = value.trim();

  if (field === "fullName") {
    if (!trimmedValue) return "quotation.validation.nameRequired";
    if (trimmedValue.length < 2) return "quotation.validation.nameMin";
    if (trimmedValue.length > 80) return "quotation.validation.nameMax";
    if (!nameRegex.test(trimmedValue)) return "quotation.validation.nameChars";
  }

  if (field === "location") {
    if (!trimmedValue) return "quotation.validation.locationRequired";
    if (trimmedValue.length < 3) return "quotation.validation.locationMin";
    if (trimmedValue.length > 160) return "quotation.validation.locationMax";
    if (!locationRegex.test(trimmedValue)) return "quotation.validation.locationChars";
  }

  if (field === "email") {
    const email = trimmedValue.toLowerCase();
    const emailDomain = email.split("@")[1];

    if (!email) return "quotation.validation.emailRequired";
    if (email.length > 120) return "quotation.validation.emailMax";
    if (!emailRegex.test(email)) return "quotation.validation.emailInvalid";
    if (emailDomain && blockedEmailDomains.includes(emailDomain)) {
      return "quotation.validation.emailDisposable";
    }
  }

  if (field === "phone") {
    const phone = trimmedValue.replace(/[\s-]/g, "");

    if (!phone) return "quotation.validation.phoneRequired";
    if (!phoneRegex.test(phone)) return "quotation.validation.phoneInvalid";
  }

  if (field === "message") {
    if (trimmedValue.length > 500) return "quotation.validation.messageMax";
  }

  return "";
}

export function validateProposalRequestForm(
  data: ProposalRequestFormData
): ProposalRequestErrors {
  const errors: ProposalRequestErrors = {};

  (Object.entries(data) as Array<[ProposalRequestField, string]>).forEach(
    ([field, value]) => {
      const error = validateProposalRequestField(field, value);

      if (error) {
        errors[field] = error;
      }
    }
  );

  return errors;
}

function configurationLabel(result: EngineResult): string {
  const { value, unit } = formatSystemSize(result.solarKwp, 2);
  const typeLabel = result.systemType === "hybrid" ? "Hybrid" : "Grid-Tied";
  return `~${value} ${unit} ${typeLabel}`;
}

export function buildQuotationRequestPayload(
  params: QuotationBuilderParams
): QuotationRequestPayload {
  const proposalForm = params.proposalForm
    ? sanitizeProposalRequestForm(params.proposalForm)
    : { fullName: "", location: "", email: "", phone: "", message: "" };

  const { engineResult } = params;

  const totalDailyUsageWh = params.appliances.reduce((s, a) => s + a.usage, 0);
  const totalDayUsageWh = params.appliances.reduce((s, a) => s + a.dayUsage, 0);
  const totalNightUsageWh = params.appliances.reduce((s, a) => s + a.nightUsage, 0);

  const sized = formatSystemSize(engineResult.solarKwp, 2);

  const estimatedMonthlySavingsPhp =
    params.systemPurpose === "monthly-savings"
      ? params.monthlySavingsTarget
      : params.systemPurpose === "zero-bill"
        ? params.monthlyBill
        : 0;

  return {
    type: "quotation_request",
    submittedAt: new Date().toISOString(),
    systemPurpose: params.systemPurpose,
    systemType: params.systemType,
    customer: proposalForm,
    property: { classification: params.selectedProperty },
    consumption: {
      averageMonthlyBillPhp: params.monthlyBill,
      monthlySavingsTargetPhp: params.monthlySavingsTarget,
      electricRatePhpPerKwh: params.electricRate,
      estimatedMonthlyKwh: Math.round(totalDailyUsageWh * SOLAR_CONSTANTS.daysPerMonth / 1000),
      peakPowerKw: params.peakPower,
      allowedGridPowerKw: params.allowedGridPower,
      peakDurationHours: params.peakDuration,
    },
    solarEstimate: {
      estimatedSystemSize: {
        rawKwp: engineResult.solarKwp,
        displayValue: sized.value,
        displayUnit: sized.unit,
        displayText: `${sized.value} ${sized.unit}`,
      },
      inverterSizeKw: engineResult.inverterKw,
      storageCapacityKwh: engineResult.storageKwh,
      configuration: configurationLabel(engineResult),
      estimatedMonthlySavingsPhp,
      estimatedProjectedSavingsPhp: estimatedMonthlySavingsPhp * SOLAR_CONSTANTS.projectionMonths,
      projectionMonths: SOLAR_CONSTANTS.projectionMonths,
      totalDailyUsageWh,
      totalDayUsageWh,
      totalNightUsageWh,
    },
    loadProfile: params.appliances.map((item) => ({
      name: item.name,
      watts: item.watts,
      quantity: item.quantity,
      hoursPerDay: item.hours,
      dayHoursPerDay: item.dayHours,
      nightHoursPerDay: item.nightHours,
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
    locale: params.locale,
  };
}

export function buildQuotationRequestFormData(
  params: QuotationBuilderParams
): FormData {
  const payload = buildQuotationRequestPayload(params);
  const formData = new FormData();

  formData.append("payload", JSON.stringify(payload));

  if (params.uploadedBill?.file) {
    formData.append("billAttachment", params.uploadedBill.file);
  }

  return formData;
}
