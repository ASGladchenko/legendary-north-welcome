import "./page.css";

import { HeroBanner } from "./components/hero-banner";
import { OfferModal } from "./components/offer-modal";
import { JourneyWidget } from "./components/journey/journey-widget";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { lang, login } = await searchParams;
  const locale = lang === "fr" ? "fr" : "en";

  return (
    <main className="page" lang={locale}>
      <section className="banner">
        <HeroBanner locale={locale} />

        <JourneyWidget locale={locale} showSignup={login === "no"} />
      </section>

      <OfferModal locale={locale} />
    </main>
  );
}
