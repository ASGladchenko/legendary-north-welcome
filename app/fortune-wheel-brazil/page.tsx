import type { Metadata } from "next";

import "../fortune-wheel/fortune-wheel.css";

import type { BrazilFortuneWheelLocale } from "../config/fortune-wheel-brazil";
import { FortuneWheel } from "../fortune-wheel/fortune-wheel";

const getLocale = (lang: string | string[] | undefined): BrazilFortuneWheelLocale =>
  lang === "en" ? "en" : "pt-BR";

export async function generateMetadata({
  searchParams,
}: PageProps<"/fortune-wheel-brazil">): Promise<Metadata> {
  const locale = getLocale((await searchParams).lang);

  return locale === "en"
    ? {
        title: "Fortune Wheel | 1MLNBET Brazil",
        description: "Spin the 1MLNBET Brazil fortune wheel.",
      }
    : {
        title: "Roda da Fortuna | 1MLNBET",
        description: "Gire a roda da fortuna 1MLNBET Brasil.",
      };
}

export default async function BrazilFortuneWheelPage({
  searchParams,
}: PageProps<"/fortune-wheel-brazil">) {
  const locale = getLocale((await searchParams).lang);

  return <FortuneWheel market="brazil" locale={locale} />;
}
