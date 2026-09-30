"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useIsInIframe() {
  return useSyncExternalStore(
    subscribe,
    () => window.self !== window.top,
    () => false,
  );
}
