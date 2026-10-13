import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRune, getRuneForecast, isRuneId } from "../rune-data";
import { RuneForecastView } from "../rune-forecast-view";

export async function generateMetadata({
  params,
}: PageProps<"/horoscope/[runeId]">): Promise<Metadata> {
  const { runeId } = await params;
  if (!isRuneId(runeId)) return {};

  return {
    title: `${getRune(runeId).name} Rune Forecast | Legendary North`,
    description: `Discover today's Northern signal for ${getRune(runeId).name}.`,
  };
}

export default async function RuneForecastPage({
  params,
}: PageProps<"/horoscope/[runeId]">) {
  const { runeId } = await params;
  if (!isRuneId(runeId)) notFound();

  const rune = getRune(runeId);
  const data = await getRuneForecast(runeId);

  return <RuneForecastView rune={rune} forecast={data?.forecast} />;
}
