import type { Analytics } from "firebase/analytics";
import { getFirebaseAnalytics } from "../config/firebase";
import { FirstOfTrigger, IdleTrigger, InteractionTrigger } from "./thirdParty/loadTriggers";
import { ThirdPartyScriptLoader } from "./thirdParty/ThirdPartyScriptLoader";

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

type AnalyticsClient = {
  analytics: Analytics | null;
  logEvent: typeof import("firebase/analytics").logEvent;
};

/**
 * Firebase Analytics (and the gtag.js it injects) stays off the critical path:
 * it loads on the visitor's first interaction or when the browser is idle,
 * whichever comes first (at most ~4 s after load). Events recorded before
 * then wait for it instead of being dropped.
 */
class AnalyticsService {
  private readonly loader = new ThirdPartyScriptLoader<AnalyticsClient>(
    new FirstOfTrigger(new InteractionTrigger(), new IdleTrigger(4000)),
    async () => {
      const [analytics, { logEvent }] = await Promise.all([
        getFirebaseAnalytics(),
        import("firebase/analytics"),
      ]);
      return { analytics, logEvent };
    },
  );

  async trackPageView(path: string): Promise<void> {
    await this.trackEvent("page_view", { page_path: path });
  }

  async trackEvent(eventName: string, params?: AnalyticsParams): Promise<void> {
    try {
      const { analytics, logEvent } = await this.loader.get();
      if (analytics) logEvent(analytics, eventName, params);
    } catch {
      // Analytics must never break the page (blocked by an extension, offline).
    }
  }
}

const analyticsService = new AnalyticsService();

export const trackPageView = (path: string) => analyticsService.trackPageView(path);
export const trackEvent = (eventName: string, params?: AnalyticsParams) =>
  analyticsService.trackEvent(eventName, params);
