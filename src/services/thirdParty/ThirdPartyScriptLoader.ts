import type { LoadTrigger } from "./loadTriggers";

/**
 * Loads a third-party module only after its trigger fires, at most once, and
 * hands every caller the same instance. Callers that arrive early simply wait,
 * so nothing (events, page views) is lost while the script is deferred.
 *
 * The trigger decides when; a consent requirement is just another LoadTrigger
 * implementation (one that resolves when the visitor accepts).
 */
export class ThirdPartyScriptLoader<T> {
  private readonly trigger: LoadTrigger;
  private readonly load: () => Promise<T>;
  private instance: Promise<T> | null = null;

  constructor(trigger: LoadTrigger, load: () => Promise<T>) {
    this.trigger = trigger;
    this.load = load;
  }

  /** Resolves with the loaded module once the trigger has fired. */
  get(): Promise<T> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("Third-party scripts load in the browser only"));
    }
    this.instance ??= this.trigger.wait().ready.then(this.load);
    return this.instance;
  }
}
