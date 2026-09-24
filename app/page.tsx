'use client';

import { useEffect, useState } from "react";

import Image from "next/image";

import { HeroBanner } from "./components/hero-banner";
import { OfferModal } from "./components/offer-modal";
import { JourneyWidget } from "./components/journey/journey-widget";

const languages = { en: "English", fr: "Français" } as const;
type Locale = keyof typeof languages;
const locales = Object.keys(languages) as Locale[];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <main className="page">
      <header className="header">
        <Image
          className="logo"
          src="/brand/logo.svg"
          alt="1MLNBET"
          width={152}
          height={24}
          unoptimized
        />

        <nav className="languages" aria-label={locale === "fr" ? "Langue" : "Language"}>
          {locales.map((item) => (
            <button
              key={item}
              type="button"
              aria-label={languages[item]}
              aria-pressed={locale === item}
              onClick={() => setLocale(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      <section className="banner">
        <HeroBanner locale={locale} />

        <JourneyWidget locale={locale} />
      </section>

      <OfferModal locale={locale} />
    </main>
  );
}
