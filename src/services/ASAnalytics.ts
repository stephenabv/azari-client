import { logEvent } from "firebase/analytics";
import { analytics } from "../config/firebase";

export function trackPageView(path: string) {
  if (!analytics) return;

  logEvent(analytics, "page_view", {
    page_path: path,
  });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (!analytics) return;

  logEvent(analytics, eventName, params);
}