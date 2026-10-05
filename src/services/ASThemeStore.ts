export type Theme = "light-theme" | "dark-theme";

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function isTheme(value: unknown): value is Theme {
  return value === "light-theme" || value === "dark-theme";
}

/**
 * The visitor's theme: their saved choice, else the system preference. An
 * external store for useSyncExternalStore, so the server (which cannot know
 * it) renders with `null` and the client switches to the real value right
 * after hydration, without a setState-in-effect round trip.
 */
class ThemeStore {
  private readonly listeners = new Set<() => void>();

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    const media = window.matchMedia(DARK_QUERY);
    media.addEventListener("change", listener);
    return () => {
      this.listeners.delete(listener);
      media.removeEventListener("change", listener);
    };
  };

  getSnapshot = (): Theme => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isTheme(saved)) return saved;
    } catch {
      // Storage blocked: fall back to the system preference.
    }
    return window.matchMedia(DARK_QUERY).matches ? "dark-theme" : "light-theme";
  };

  getServerSnapshot = (): Theme | null => null;

  set(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Not persisted, but still applied for this page view.
    }
    this.listeners.forEach((listener) => listener());
  }
}

export const themeStore = new ThemeStore();
