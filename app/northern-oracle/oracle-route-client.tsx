'use client';

import dynamic from "next/dynamic";

import { OracleLoader } from "./oracle-loader";

const CubeExperience = dynamic(() => import("./cube-experience"), {
  ssr: false,
  loading: () => <OracleLoader />,
});

export function OracleRouteClient() {
  return <CubeExperience />;
}
