import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "./pumpkin-cube.css";

import { PumpkinCubeRoute } from "./pumpkin-cube-route";

export const metadata: Metadata = {
  title: "Pumpkin Cube | Legendary North",
  description: "An interactive Halloween cube.",
};

export default function PumpkinCubePage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <PumpkinCubeRoute />;
}
