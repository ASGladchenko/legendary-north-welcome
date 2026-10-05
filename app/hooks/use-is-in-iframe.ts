"use client";

import { useEffect, useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useIsInIframe() {
  return useSyncExternalStore(
    subscribe,
    () => window.self !== window.top,
    () => false,
  );
}

export function useLogParentUrl() {
  const isInIframe = useIsInIframe();

  useEffect(() => {
    if (!isInIframe) return;

    let parentUrl = document.referrer;

    try {
      parentUrl = window.parent.location.href;
    } catch {
      // Cross-origin parent: document.referrer is the available fallback.
    }

    console.log("Parent URL:", parentUrl || "unavailable");
  }, [isInIframe]);
}
