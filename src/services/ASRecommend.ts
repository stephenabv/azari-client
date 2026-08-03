export type AIRecommendation = {
  inverterKw: number;
  systemType: 'hybrid' | 'grid-tied';
  solarKwp: number;
  storageKwh: number;
};

export type RecommendParams = {
  systemPurpose: string;
  property: string;
  systemType?: string;
  monthlyBill?: number;
  electricRate?: number;
  savingsTarget?: number;
  peakPower?: number;
  allowedGridPower?: number;
  peakDuration?: number;
  appliances?: Array<{ name: string; watts: number; quantity: number; hours: number }>;
};

import { handleRateLimitResponse } from './ASContent';

export async function fetchAIRecommendation(params: RecommendParams): Promise<AIRecommendation> {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (handleRateLimitResponse(res)) {
    throw new Error('rate_limited');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error((err as { error?: string }).error ?? 'Recommendation failed');
  }

  return res.json() as Promise<AIRecommendation>;
}
