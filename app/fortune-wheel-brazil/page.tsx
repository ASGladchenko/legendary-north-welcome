import type { Metadata } from "next";

import "../fortune-wheel/fortune-wheel.css";

import { FortuneWheel } from "../fortune-wheel/fortune-wheel";

export const metadata: Metadata = {
  title: "Roda da Fortuna | 1MLNBET",
  description: "Gire a roda da fortuna 1MLNBET Brasil.",
};

export default function BrazilFortuneWheelPage() {
  return <FortuneWheel market="brazil" />;
}
