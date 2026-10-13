import type { Metadata } from "next";

import { RuneForecastView } from "./rune-forecast-view";

export const metadata: Metadata = {
  title: "Rune Forecast | Oracle Admin",
};

export default async function RuneForecastPage({
  params,
  searchParams,
}: PageProps<"/admin/runes/[runeId]">) {
  const { runeId } = await params;
  const { date } = await searchParams;

  return (
    <RuneForecastView
      runeId={runeId}
      date={typeof date === "string" ? date : undefined}
    />
  );
}
