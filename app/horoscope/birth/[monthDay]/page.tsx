import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RuneBackground } from "../../rune-background";
import { getBirthRuneForecast, getRune, isMonthDay } from "../../rune-data";
import { RuneForecastView } from "../../rune-forecast-view";

export const metadata: Metadata = {
  title: "Your Birth Rune | Legendary North",
  description: "Discover your personal rune and today's Northern signal.",
};

export default async function BirthRuneForecastPage({
  params,
}: PageProps<"/horoscope/birth/[monthDay]">) {
  const { monthDay } = await params;
  if (!isMonthDay(monthDay)) notFound();

  const data = await getBirthRuneForecast(monthDay);
  if (data) {
    return <RuneForecastView rune={getRune(data.rune.id)} forecast={data.forecast} />;
  }

  return (
    <main className="rune-page rune-detail-page">
      <RuneBackground
        desktop="/images/rune/monolith-landscape-desktop.webp"
        mobile="/images/rune/monolith-landscape-mobile.webp"
        desktopPreview="/images/rune/previews/monolith-landscape-desktop.webp"
        mobilePreview="/images/rune/previews/monolith-landscape-mobile.webp"
      />
      <div className="rune-page-shade" aria-hidden="true" />
      <section className="rune-unavailable birth-rune-unavailable" role="status">
        <span className="rune-eyebrow">The signal is forming</span>
        <h2>Your birth rune is not ready yet.</h2>
        <p>Please return shortly and let the North try again.</p>
        <Link href="/horoscope">Choose another date</Link>
      </section>
    </main>
  );
}
