import type { Metadata } from "next";

import "./fortune-wheel.css";

import { FortuneWheel } from "./fortune-wheel";

export const metadata: Metadata = {
  title: "Fortune Wheel | Legendary North",
  description: "Spin the Legendary North fortune wheel.",
};

type FortuneWheelPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function FortuneWheelPage({
  searchParams,
}: FortuneWheelPageProps) {
  const { lang } = await searchParams;
  const locale = lang === "fr" ? "fr" : "en";

  return <FortuneWheel locale={locale} />;
}
