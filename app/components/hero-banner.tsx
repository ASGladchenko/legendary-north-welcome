'use client';

import Image from "next/image";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "./hero-banner.css";

import { heroConfig, type HeroLocale } from "../config/hero-banner";
import type { JourneyVariant } from "../config/journey";

type HeroBannerProps = {
  locale: HeroLocale;
  variant: JourneyVariant;
};

export function HeroBanner({ locale, variant }: HeroBannerProps) {
  return (
    <section aria-label={heroConfig.label[locale]}>
      <div className="hero-slider-shell">
        <Image
          className="hero-background"
          src={heroConfig.background}
          alt=""
          fill
          sizes="(min-width: 769px) 1180px, 100vw"
          loading="eager"
        />

        <Swiper
          className="hero-slider"
          modules={[A11y, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={heroConfig.fadeDuration}
          autoplay={{
            delay: heroConfig.autoplayDelay,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          allowTouchMove={false}
          simulateTouch={false}
          loop
        >
          {heroConfig.slides.map((slide, index) => {
            const copy =
              variant === "vip" && index === 0
                ? heroConfig.vipWelcomeCopy[locale]
                : slide.copy[locale];

            return (
              <SwiperSlide key={slide.id}>
                <article
                  className={`hero-slide hero-slide--${slide.textSide}`}
                >
                  <Image
                    className={`hero-character hero-character--${slide.characterSide}`}
                    src={slide.character}
                    alt={slide.characterAlt[locale]}
                    width={slide.characterWidth}
                    height={slide.characterHeight}
                    sizes="(min-width: 769px) 52vw, 58vw"
                    loading={index === 0 ? "eager" : "lazy"}
                  />

                  <div className={`hero-copy hero-copy--${slide.textSide}`}>
                    {copy.eyebrow && (
                      <p
                        className="hero-eyebrow"
                        dangerouslySetInnerHTML={{ __html: copy.eyebrow }}
                      />
                    )}
                    <h1>
                      <span>{copy.titleLead}</span>
                      {copy.titleAccent && <strong>{copy.titleAccent}</strong>}
                    </h1>
                  </div>

                  {variant === "vip" && index === 0 && (
                    <Image
                      className="hero-vip-badge"
                      src={heroConfig.vipBonusBadge}
                      alt={
                        locale === "fr"
                          ? "3 jeux bonus supplémentaires"
                          : "3 bonus games"
                      }
                      width={1254}
                      height={1254}
                      sizes="(min-width: 769px) 220px, 11vw"
                      loading="eager"
                    />
                  )}
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
