import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import colorsIcon from "@/public/images/rune/symbol-four-diamonds.webp";
import energyIcon from "@/public/images/rune/symbol-eight-point-star.webp";
import numbersIcon from "@/public/images/rune/symbol-triquetra.webp";
import playIcon from "@/public/images/rune/symbol-cardinal-circle.webp";
import luckIcon from "@/public/images/rune/symbol-compass-star.webp";
import tempoIcon from "@/public/images/rune/symbol-waves.webp";
import crystalIcon from "@/public/images/rune/crystal-crescent.webp";

import { RuneBackground } from "./rune-background";
import type { RuneForecast, RunePresentation } from "./rune-data";
import { runeAccent } from "./rune-data";
import { RuneMark } from "./rune-stone";

export function RuneForecastView({
  rune,
  forecast,
}: {
  rune: RunePresentation;
  forecast?: RuneForecast["forecast"];
}) {
  const color = runeAccent(rune.accent);

  return (
    <main
      className="rune-page rune-detail-page"
      style={{ "--rune-color": color } as CSSProperties}
    >
      <RuneBackground
        desktop="/images/rune/monolith-landscape-desktop.webp"
        mobile="/images/rune/monolith-landscape-mobile.webp"
        desktopPreview="/images/rune/previews/monolith-landscape-desktop.webp"
        mobilePreview="/images/rune/previews/monolith-landscape-mobile.webp"
      />
      <div className="rune-page-shade" aria-hidden="true" />

      <Link className="rune-back" href="/horoscope">
        <span aria-hidden="true">←</span> All runes
      </Link>

      <section className="rune-detail-hero">
        <span className="rune-eyebrow">Today&apos;s rune</span>
        <h1>{rune.name}</h1>
        {forecast && <strong>{forecast.mood}</strong>}
        <div className="rune-detail-mark">
          <RuneMark image={rune.image} name={rune.name} color={color} />
        </div>
      </section>

      {forecast ? (
        <div className="rune-forecast">
          <section className="rune-signal">
            <span className="rune-eyebrow">Signal</span>
            <h2>{forecast.signal}</h2>
            <p>{forecast.prediction}</p>
          </section>

          <section className="rune-oracle-card">
            <span className="rune-eyebrow">The oracle whispers</span>
            <blockquote>“{forecast.oracleLine}”</blockquote>
            <div className="rune-action">
              <span aria-hidden="true">✦</span>
              <div>
                <small>Recommended action</small>
                <p>{forecast.action}</p>
              </div>
            </div>
          </section>

          <section className="rune-guidance">
            <div className="rune-section-title">
              <span aria-hidden="true" />
              <h2>Daily guidance</h2>
              <span aria-hidden="true" />
            </div>
            <dl>
              <Guidance icon={playIcon} label="Play mode" value={forecast.playMode} />
              <Guidance icon={crystalIcon} label="Stone" value={forecast.stone} />
              <Guidance
                icon={numbersIcon}
                label="Lucky numbers"
                value={forecast.numbers.join(" · ")}
              />
              <Guidance
                icon={colorsIcon}
                label="Colors"
                value={forecast.colors.join(" · ")}
              />
            </dl>
          </section>

          <section className="rune-meters" aria-label="Daily levels">
            <Meter icon={energyIcon} label="Energy" value={forecast.energy} />
            <Meter
              icon={luckIcon}
              label="Luck"
              value={forecast.luck.score}
              status={forecast.luck.label}
            />
            <Meter icon={tempoIcon} label="Tempo" value={forecast.tempo} />
          </section>
        </div>
      ) : (
        <section className="rune-unavailable" role="status">
          <span className="rune-eyebrow">The signal is forming</span>
          <h2>The North is quiet for a moment.</h2>
          <p>Please return shortly to receive the rune&apos;s guidance.</p>
          <Link href="/horoscope">Explore another rune</Link>
        </section>
      )}
    </main>
  );
}

function Guidance({
  icon,
  label,
  value,
}: {
  icon: typeof playIcon;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt>
        <Image src={icon} alt="" width={34} height={34} quality={60} />
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

function Meter({
  icon,
  label,
  status,
  value,
}: {
  icon: typeof energyIcon;
  label: string;
  status?: string;
  value: number;
}) {
  const level = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <div className="rune-meter">
      <div className="rune-meter-heading">
        <Image src={icon} alt="" width={38} height={38} quality={60} />
        <span>{label}</span>
      </div>
      <div className="rune-meter-level" aria-label={`${label}: ${level} out of 5`}>
        {Array.from({ length: 5 }, (_, index) => (
          <i className={index < level ? "is-active" : ""} key={index} />
        ))}
      </div>
      <strong>{level} / 5{status ? ` · ${status}` : ""}</strong>
    </div>
  );
}
