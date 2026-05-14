import { logEvent } from "firebase/analytics";
import { analytics } from "../config/firebase";

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export function trackPageView(path: string) {
  if (!analytics) return;

  logEvent(analytics, "page_view", {
    page_path: path,
  });
}

export function trackEvent(
  eventName: string,
  params?: AnalyticsParams
) {
  if (!analytics) return;

  logEvent(analytics, eventName, params);
}