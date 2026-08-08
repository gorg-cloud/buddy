"use client";

import { useSyncExternalStore } from "react";

/**
 * True only after hydration. The modern replacement for the
 * setMounted(true)-in-an-effect pattern — lets client-only values (dates,
 * localStorage caches) render safely without hydration mismatches.
 */
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
