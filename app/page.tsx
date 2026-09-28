import "./page.css";

import { HeroBanner } from "./components/hero-banner";
import { OfferModal } from "./components/offer-modal";
import { JourneyWidget } from "./components/journey/journey-widget";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { lang, login } = await searchParams;
  const locale = lang === "fr" ? "fr" : "en";
  const showSignup = login === "no";
  const destination = `https://1mlnbet.com/${locale}`;
  const signupHref = `${destination}/registration/7`;

  return (
    <main className="page" lang={locale}>
      <section className="banner">
        <HeroBanner locale={locale} />

        <JourneyWidget
          locale={locale}
          actionHref={showSignup ? signupHref : `${destination}/promo`}
        />
      </section>

      <OfferModal
        locale={locale}
        actionHref={showSignup ? signupHref : `${destination}/deposit`}
      />
    </main>
  );
}
