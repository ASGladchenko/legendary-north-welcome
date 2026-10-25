"use client";

import { useCallback, useState, type CSSProperties } from "react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";

export type HalloweenLocale = "en" | "fr";

const assetRoot = "/images/halloween-canada";

const slides = [
  {
    id: "man",
    characterSide: "left",
    textSide: "right",
    characterAlt: {
      en: "Canadian Halloween adventurer holding a glowing pumpkin lantern",
      fr: "Aventurier canadien d’Halloween tenant une lanterne citrouille",
    },
    label: {
      en: "Make some noise, monsters! Pick your Halloween slot and join the madness!",
      fr: "Fais du bruit, monstre! Choisis ton jeu d’Halloween et embarque dans la folie!",
    },
  },
  {
    id: "blonde",
    characterSide: "right",
    textSide: "left",
    characterAlt: {
      en: "Blonde Halloween witch holding a glowing pumpkin lantern",
      fr: "Sorcière blonde d’Halloween tenant une lanterne citrouille",
    },
    label: {
      en: "Trick or spin, darling? Take a peek at the spooky slots below!",
      fr: "Un sort ou un tour, chéri? Découvre les jeux d’Halloween juste en bas!",
    },
  },
  {
    id: "redhead",
    characterSide: "right",
    textSide: "left",
    characterAlt: {
      en: "Red-haired Halloween witch with a glowing pumpkin lantern",
      fr: "Sorcière rousse d’Halloween avec une lanterne citrouille",
    },
    label: {
      en: "Scared? That’s cute. Dare to try one of our wicked Halloween slots?",
      fr: "T’as peur? C’est mignon. Tu oses essayer une de nos machines?",
    },
  },
] as const;

function BannerPicture({
  alt,
  className,
  eager = false,
  name,
}: {
  alt: string;
  className: string;
  eager?: boolean;
  name: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const reveal = useCallback((image: HTMLImageElement) => {
    void image
      .decode()
      .catch(() => undefined)
      .then(() => setLoaded(true));
  }, []);
  const catchCachedImage = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) reveal(image);
  }, [reveal]);

  return (
    <span
      className={`canada-progressive ${className}${loaded ? " is-loaded" : ""}`}
      style={
        {
          "--canada-preview": `url("${assetRoot}/previews/${name}.webp")`,
        } as CSSProperties
      }
    >
      <span aria-hidden="true" className="canada-progressive-preview" />
      <picture className="canada-progressive-full">
        <source
          media="(max-width: 768px)"
          srcSet={`${assetRoot}/${name}-mobile.avif`}
          type="image/avif"
        />
        <source
          media="(max-width: 768px)"
          srcSet={`${assetRoot}/${name}-mobile.webp`}
          type="image/webp"
        />
        <source srcSet={`${assetRoot}/${name}.avif`} type="image/avif" />
        <img
          alt={alt}
          decoding="async"
          draggable={false}
          fetchPriority={eager ? "high" : "low"}
          loading={eager ? "eager" : "lazy"}
          onLoad={(event) => reveal(event.currentTarget)}
          ref={catchCachedImage}
          src={`${assetRoot}/${name}.webp`}
        />
      </picture>
    </span>
  );
}

export function HalloweenCanadaBanner({
  locale,
}: {
  locale: HalloweenLocale;
}) {
  return (
    <section
      className="canada-banner"
      aria-label={
        locale === "fr"
          ? "Sélections d’Halloween au Canada"
          : "Halloween picks for Canada"
      }
    >
      <h1 className="canada-sr-only">
        {locale === "fr" ? "Halloween au Canada" : "Halloween in Canada"}
      </h1>

      <BannerPicture
        alt=""
        className="canada-background"
        eager
        name="background"
      />

      <Swiper
        className="canada-slider"
        modules={[A11y, Autoplay, EffectFade]}
        allowTouchMove={false}
        simulateTouch={false}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={2200}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        loop
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <article className="canada-slide" aria-label={slide.label[locale]}>
              <h2 className="canada-sr-only">{slide.label[locale]}</h2>

              <BannerPicture
                alt={slide.characterAlt[locale]}
                className={`canada-character canada-character--${slide.characterSide}`}
                eager={index === 0}
                name={`character-${slide.id}`}
              />

              <BannerPicture
                alt=""
                className={`canada-copy canada-copy--${slide.textSide}`}
                eager={index === 0}
                name={`copy-${slide.id}-${locale}`}
              />
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
