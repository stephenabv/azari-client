import type { QuotationBuilderParams, QuotationSubmissionResult } from "../models/quotation";
import { buildQuotationRequestFormData } from "../models/quotation";
import { handleRateLimitResponse } from "../services/ASContent";

export async function sendQuotationRequest(
  params: QuotationBuilderParams
): Promise<QuotationSubmissionResult> {
  const formData = buildQuotationRequestFormData(params);

  try {
    const response = await fetch("/api/quotation/request-proposal", {
      method: "POST",
      body: formData,
    });

    if (handleRateLimitResponse(response)) {
      return { success: false, isRealSuccess: false, rateLimited: true };
    }

    return {
      success: true,
      isRealSuccess: response.ok,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      isRealSuccess: false,
    };
  }
}
