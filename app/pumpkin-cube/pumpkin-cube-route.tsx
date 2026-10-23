"use client";

import dynamic from "next/dynamic";

import { PumpkinCubeLoader } from "./pumpkin-cube-loader";

const PumpkinCube = dynamic(() => import("./pumpkin-cube"), {
  ssr: false,
  loading: () => <PumpkinCubeLoader />,
});

export function PumpkinCubeRoute() {
  return <PumpkinCube />;
}
