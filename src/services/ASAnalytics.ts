import { getFirebaseAnalytics } from "../config/firebase";

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export async function trackPageView(path: string) {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) return;
  const { logEvent } = await import("firebase/analytics");
  logEvent(analytics, "page_view", { page_path: path });
}

export async function trackEvent(eventName: string, params?: AnalyticsParams) {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) return;
  const { logEvent } = await import("firebase/analytics");
  logEvent(analytics, eventName, params);
}
