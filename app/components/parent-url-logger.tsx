"use client";

import { useLogParentUrl } from "../hooks/use-is-in-iframe";

export function ParentUrlLogger() {
  useLogParentUrl();

  return null;
}
