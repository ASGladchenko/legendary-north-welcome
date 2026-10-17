"use client";

import dynamic from "next/dynamic";

import { MapLoader } from "./map-loader";

const WorldMap = dynamic(() => import("./world-map"), {
  ssr: false,
  loading: () => <MapLoader />,
});

export function WorldMapRouteClient() {
  return <WorldMap />;
}
