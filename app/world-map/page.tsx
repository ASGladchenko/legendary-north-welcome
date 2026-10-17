import type { Metadata } from "next";

import "./world-map.css";

import { WorldMapRouteClient } from "./world-map-route-client";

export const metadata: Metadata = {
  title: "World Map | Legendary North",
  description: "Explore the world of Legendary North.",
};

export default function WorldMapPage() {
  return <WorldMapRouteClient />;
}
