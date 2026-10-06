import type { Metadata } from "next";

import "./northern-oracle.css";

import { OracleRouteClient } from "./oracle-route-client";

export const metadata: Metadata = {
  title: "Northern Oracle | Legendary North",
  description: "Awaken the Northern Oracle and reveal your prediction.",
};

export default function NorthernOraclePage() {
  return <OracleRouteClient />;
}
