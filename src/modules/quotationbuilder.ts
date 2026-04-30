type QuoteMode = "with-bill" | "no-bill";

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

type QuoteSummary = {
  monthlyKwh: number;
  systemSize: number;
  estimatedMonthlySavings: number;
  projectedSavings: number;
  totalDailyUsageWh: number;
};

type QuotationBuilderParams = {
  quoteMode: QuoteMode;
  selectedProperty: string;
  monthlyBill: number;
  electricRate: number;
  projectionMonths: number;
  quoteSummary: QuoteSummary;
  formattedSystemSize: {
    value: string;
    unit: string;
  };
  appliances: Appliance[];
  uploadedBill: UploadedBill | null;
  proposalForm?: ProposalFormData;
};

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

export function buildQuotationPayload(params: QuotationBuilderParams) {
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
      estimatedProjectedSavingsPhp: params.quoteSummary.projectedSavings,
      projectionMonths: params.projectionMonths,
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

export async function sendQuotationRequest(params: QuotationBuilderParams) {
  const payload = buildQuotationPayload(params);

  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));

  if (params.uploadedBill?.file) {
    formData.append("billAttachment", params.uploadedBill.file);
  }

  const response = await fetch("/api/quotation/request-proposal", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to submit quotation request.");
  }

  return response.json().catch(() => ({
    success: true,
  }));
}