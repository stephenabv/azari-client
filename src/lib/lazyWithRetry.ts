import { lazy } from "react";

type ComponentModule = { default: React.ComponentType<unknown> };

const RETRY_FRESH_KEY = "__chunk_retry_fresh";

function markRetried(key: string) {
  const stored = sessionStorage.getItem(RETRY_FRESH_KEY);
  const set: string[] = stored ? JSON.parse(stored) : [];
  if (!set.includes(key)) {
    set.push(key);
    sessionStorage.setItem(RETRY_FRESH_KEY, JSON.stringify(set));
  }
}

function hasRetried(key: string): boolean {
  const stored = sessionStorage.getItem(RETRY_FRESH_KEY);
  if (!stored) return false;
  return (JSON.parse(stored) as string[]).includes(key);
}

export function lazyWithRetry<T extends ComponentModule>(
  importFn: () => Promise<T>,
  chunkKey: string
): React.LazyExoticComponent<T["default"]> {
  return lazy(async () => {
    try {
      const mod = await importFn();
      return mod;
    } catch (err) {
      if (hasRetried(chunkKey)) throw err;
      markRetried(chunkKey);
      // Brief pause then retry the same import (handles transient network blips).
      // If it fails again, ChunkErrorBoundary prompts the user to reload.
      await new Promise(r => setTimeout(r, 300));
      return await importFn();
    }
  }) as React.LazyExoticComponent<T["default"]>;
}
