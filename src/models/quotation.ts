import type { FieldErrors } from "./common";
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
};

export type QuotationSubmissionResult = {
  success: boolean;
  isRealSuccess: boolean;
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
): string {
  const trimmedValue = value.trim();

  if (field === "fullName") {
    if (!trimmedValue) return "Name is required.";
    if (trimmedValue.length < 2) return "Name must be at least 2 characters.";
    if (trimmedValue.length > 80) return "Name must not exceed 80 characters.";
    if (!nameRegex.test(trimmedValue)) {
      return "Name can only contain letters, numbers, spaces, hyphen, and period.";
    }
  }

  if (field === "location") {
    if (!trimmedValue) return "Location is required.";
    if (trimmedValue.length < 3) {
      return "Location must be at least 3 characters.";
    }
    if (trimmedValue.length > 160) {
      return "Location must not exceed 160 characters.";
    }
    if (!locationRegex.test(trimmedValue)) {
      return "Location contains invalid characters.";
    }
  }

  if (field === "email") {
    const email = trimmedValue.toLowerCase();
    const emailDomain = email.split("@")[1];

    if (!email) return "Email address is required.";
    if (email.length > 120) return "Email must not exceed 120 characters.";
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (emailDomain && blockedEmailDomains.includes(emailDomain)) {
      return "Disposable or temporary email domains are not allowed.";
    }
  }

  if (field === "phone") {
    const phone = trimmedValue.replace(/[\s-]/g, "");

    if (!phone) return "Phone number is required.";
    if (!phoneRegex.test(phone)) {
      return "Enter a valid telephone or cellphone number. Example: +639123456789, 09123456789, or 0381234567.";
    }
  }

  if (field === "message") {
    if (trimmedValue.length > 500) {
      return "Additional notes must not exceed 500 characters.";
    }
  }

  return "";
}

export function validateProposalRequestForm(
  data: ProposalRequestFormData
): FieldErrors<ProposalRequestField> {
  const errors: FieldErrors<ProposalRequestField> = {};

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
