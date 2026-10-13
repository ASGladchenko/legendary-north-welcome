import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

import { BirthRuneForm } from "./birth-rune-form";
import { RuneBackground } from "./rune-background";
import { runeAccent, runes } from "./rune-data";
import { RuneStone } from "./rune-stone";

export const metadata: Metadata = {
  title: "Rune Horoscope | Legendary North",
  description: "Choose a rune and discover its Northern signal for today.",
};

export default async function HoroscopePage() {
  return (
    <main className="rune-page rune-index-page">
      <RuneBackground
        desktop="/images/rune/aurora-lake-desktop.webp"
        mobile="/images/rune/aurora-lake-mobile.webp"
        desktopPreview="/images/rune/previews/aurora-lake-desktop.webp"
        mobilePreview="/images/rune/previews/aurora-lake-mobile.webp"
      />
      <div className="rune-page-shade" aria-hidden="true" />

      <section className="rune-index-hero">
        <span className="rune-eyebrow">Daily rune horoscope</span>
        <h1>
          Find your
          <br />
          Northern signal
        </h1>
        <p>Seven runes. Seven paths. Discover the message waiting for you.</p>
        <BirthRuneForm />
      </section>

      <section className="rune-picker" id="choose-rune">
        <div className="rune-section-title">
          <span aria-hidden="true" />
          <h2>Or choose your rune</h2>
          <span aria-hidden="true" />
        </div>

        <div className="rune-grid">
          {runes.map((rune) => {
            const color = runeAccent(rune.accent);

            return (
              <Link
                className="rune-card"
                href={`/horoscope/${rune.id}`}
                key={rune.id}
                style={{ "--rune-color": color } as CSSProperties}
              >
                <RuneStone
                  image={rune.image}
                  name={rune.name}
                  color={color}
                  stone={rune.stone}
                />
                <h3>{rune.name}</h3>
                <p>{rune.teaser}</p>
                <span className="rune-card-link">
                  View forecast <b aria-hidden="true">→</b>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
