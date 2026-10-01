"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared state for the one-per-tab loading splash.
 *
 * The "already shown" flag lives in sessionStorage. It is read once per page
 * and cached so that marking it later (when the splash finishes) does not
 * yank the splash out from under its exit animation.
 */

const STORAGE_KEY = "splashShown";

/** Minimum time the splash stays on screen, measured from first paint. */
export const SPLASH_MIN_MS = 2500;
/** Hard cap after which the splash is dismissed even if `load` never fired. */
export const SPLASH_MAX_MS = 5000;

let cached: boolean | undefined;

function readSplashShown(): boolean {
  if (cached === undefined) {
    try {
      cached = sessionStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      cached = false;
    }
  }
  return cached;
}

const subscribe = () => () => {};
const getServerSnapshot = () => false;

/**
 * True when this tab has already shown the splash. Always false during SSR
 * and hydration, then corrected by React without a hydration mismatch.
 */
export function useSplashShown(): boolean {
  return useSyncExternalStore(subscribe, readSplashShown, getServerSnapshot);
}

export function markSplashShown(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Storage unavailable (private mode, disabled) — the splash just shows again next time.
  }
}

/**
 * When the splash first became visible, on the performance.now() timeline.
 * The server-rendered splash paints with the page, well before React hydrates,
 * so timers are anchored to first paint rather than to the effect that starts them.
 */
export function splashStartTime(): number {
  if (typeof performance === "undefined") return 0;
  const fcp = performance.getEntriesByName?.("first-contentful-paint")[0];
  return fcp ? fcp.startTime : 0;
}
