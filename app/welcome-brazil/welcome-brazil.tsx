"use client";

import { useRef, useState, type CSSProperties, type SyntheticEvent } from "react";

import Image from "next/image";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";

import { CapybaraPeekMascot } from "../components/capybara-peek-mascot";
import { ParentSiteLink } from "../components/parent-site-link";
import {
  getWelcomeBrazilSteps,
  welcomeBrazilConfig as config,
  type WelcomeBrazilVariant,
} from "../config/welcome-brazil";

const assetRoot = "/images/welcome-brazil";

type ProgressiveImageProps = {
  alt: string;
  eager?: boolean;
  mobileSrc?: string;
  preview: string;
  src: string;
  wrapperClassName: string;
};

function ProgressiveImage({
  alt,
  eager = false,
  mobileSrc,
  preview,
  src,
  wrapperClassName,
}: ProgressiveImageProps) {
  const fallbackSrc = src.replace(/\.avif$/, ".webp");
  const mobileFallbackSrc = mobileSrc?.replace(/\.avif$/, ".webp");

  const reveal = (event: SyntheticEvent<HTMLImageElement>) => {
    const imageHost = event.currentTarget.parentElement;
    imageHost?.classList.add("is-loaded");
    imageHost?.parentElement?.classList.add("is-loaded");
  };

  return (
    <span
      className={`brazil-progressive ${wrapperClassName}`}
      style={{ "--brazil-preview": `url("${preview}")` } as CSSProperties}
    >
      <span className="brazil-progressive-preview" aria-hidden="true" />
      <picture className="brazil-progressive-full">
        {mobileSrc?.endsWith(".avif") && (
          <source media="(max-width: 700px)" srcSet={mobileSrc} type="image/avif" />
        )}
        {mobileFallbackSrc && (
          <source media="(max-width: 700px)" srcSet={mobileFallbackSrc} type="image/webp" />
        )}
        {src.endsWith(".avif") && <source srcSet={src} type="image/avif" />}
        <img
          src={fallbackSrc}
          alt={alt}
          decoding="async"
          draggable={false}
          fetchPriority={eager ? "high" : "low"}
          loading={eager ? "eager" : "lazy"}
          onLoad={reveal}
        />
      </picture>
    </span>
  );
}

function previewFor(src: string) {
  return src.replace(`${assetRoot}/`, `${assetRoot}/previews/`).replace(".avif", ".webp");
}

function mobileFor(src: string) {
  return src.replace(".avif", "-mobile.avif");
}

export function WelcomeBrazil({
  actionHref,
  mascotDelay,
  variant,
}: {
  actionHref: string;
  mascotDelay: number | null;
  variant: WelcomeBrazilVariant;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const rewardSwiperRef = useRef<SwiperInstance | null>(null);
  const steps = getWelcomeBrazilSteps(variant);
  const isFourStepJourney = steps.length === 4;
  const desktopMapPath = isFourStepJourney
    ? "M125 90 C210 70 285 180 375 160 C465 140 535 70 625 90 C715 110 785 180 875 160"
    : "M100 90 C130 72 150 112 180 101 C205 92 215 151 250 143 C270 139 280 158 300 160 C338 174 356 188 389 172 C425 155 448 121 467 105 C480 94 488 91 500 90 C535 70 545 125 575 112 C605 98 598 160 635 145 C662 132 670 174 700 160 C735 178 748 132 780 145 C808 158 820 105 850 118 C872 128 880 92 900 90";
  const mobileMapPath = isFourStepJourney
    ? "M113 52 C155 30 210 72 250 50 C270 39 282 38 300 52 C330 70 365 28 405 48 C430 62 452 70 478 52 C535 74 548 112 520 132 C500 150 455 143 446 165 C438 181 420 190 400 187"
    : "M113 52 C155 30 210 72 250 50 C270 39 282 38 300 52 C330 70 365 28 405 48 C430 62 452 70 478 52 C535 74 548 112 520 132 C500 150 455 143 446 165 C438 181 420 190 400 187 C360 165 330 215 285 192 C250 174 230 205 200 187";

  const selectStep = (index: number) => {
    rewardSwiperRef.current?.slideTo(index);
  };

  return (
    <main className="brazil-page" lang={config.locale}>
      {mascotDelay !== null && <CapybaraPeekMascot delay={mascotDelay} />}
      <div className="brazil-banner">
        <section className="brazil-hero" aria-label={config.hero.label}>
          <ProgressiveImage
            wrapperClassName="brazil-hero-background"
            src={`${assetRoot}/bg-desktop.avif`}
            preview={`${assetRoot}/previews/bg-desktop.webp`}
            alt=""
            eager
          />

          <Swiper
            className="brazil-hero-slider"
            modules={[A11y, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={2200}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            allowTouchMove={false}
            simulateTouch={false}
            loop
          >
            {config.hero.slides.map((slide, index) => {
              const isOffer = slide.id === "welcome-offer";
              const copy = variant === "vip" && isOffer
                ? config.hero.vipWelcome
                : slide;

              return (
              <SwiperSlide key={slide.id}>
                <article className={`brazil-hero-slide brazil-hero-slide--${slide.textSide}`}>
                <div className={`brazil-hero-copy brazil-hero-copy--${slide.textSide}${isOffer ? " brazil-hero-copy--offer" : ""}`}>
                  {copy.eyebrow && <p>{copy.eyebrow}</p>}
                  <h1>
                    <span>{copy.titleLead}</span>
                    <strong>
                      {copy.titleAccent}
                      {"titleLogo" in copy && <i>{copy.titleLogo}</i>}
                      {"titleBrand" in copy && <em>{copy.titleBrand}</em>}
                    </strong>
                  </h1>
                  {copy.subtitle && <small>{copy.subtitle}</small>}
                </div>

                <ProgressiveImage
                  wrapperClassName={`brazil-person brazil-person--${slide.characterSide} brazil-person--${slide.id}`}
                  src={slide.src}
                  preview={previewFor(slide.src)}
                  alt={slide.alt}
                  eager={index === 0}
                />

                {isOffer && variant === "standard" && (
                  <ProgressiveImage
                    wrapperClassName="brazil-vibe"
                    src={`${assetRoot}/vibe-text.avif`}
                    preview={`${assetRoot}/previews/vibe-text.webp`}
                    alt="Good vibes, bigger wins"
                  />
                )}

                </article>
              </SwiperSlide>
              );
            })}
          </Swiper>

        </section>

        <div className="brazil-hero-liana" aria-hidden="true">
          <Image
            src={`${assetRoot}/liana.webp`}
            alt=""
            width={2032}
            height={232}
            sizes="(max-width: 700px) 104vw, 1240px"
            loading="eager"
            draggable={false}
          />
        </div>

        <section className="brazil-journey" aria-label={config.labels.map}>
        <div className="brazil-map">
          <div className="brazil-map-track">
            <svg className="brazil-map-line brazil-map-line--desktop" viewBox="0 0 1000 285" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="brazil-map-gold" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#f5a900" />
                  <stop offset="0.5" stopColor="#ffe57a" />
                  <stop offset="1" stopColor="#f5a900" />
                </linearGradient>
              </defs>
              <path className="brazil-map-line-glow" d={desktopMapPath} />
              <path className="brazil-map-line-core" d={desktopMapPath} />
            </svg>

            <svg className="brazil-map-line brazil-map-line--mobile" viewBox="0 0 600 270" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="brazil-map-gold-mobile" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#f5a900" />
                  <stop offset="0.5" stopColor="#ffe57a" />
                  <stop offset="1" stopColor="#f5a900" />
                </linearGradient>
              </defs>
              <path className="brazil-map-line-glow" d={mobileMapPath} />
              <path className="brazil-map-line-core brazil-map-line-core--mobile" d={mobileMapPath} />
            </svg>

            <ol style={{ "--brazil-step-count": steps.length } as CSSProperties}>
              {steps.map((item, index) => {
                const mapImageIndex = "mapImageIndex" in item ? item.mapImageIndex : index + 1;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="brazil-map-link"
                      aria-label={`${config.labels.step} ${index + 1}: ${item.title}`}
                      aria-pressed={activeStep === index}
                      onClick={() => selectStep(index)}
                    >
                      <ProgressiveImage
                        wrapperClassName="brazil-map-thumb"
                        src={`${assetRoot}/map-${mapImageIndex}.avif`}
                        mobileSrc={`${assetRoot}/map-${mapImageIndex}-mobile.avif`}
                        preview={`${assetRoot}/previews/map-${mapImageIndex}.webp`}
                        alt=""
                        eager={index === 0}
                      />
                      <span className="brazil-map-step-number">{index + 1}</span>
                    </button>
                    <strong>{item.shortTitle}</strong>
                    <small>{item.caption}</small>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="brazil-cta-anchor">
          <ParentSiteLink className="brazil-cta" href={actionHref}>
            {config.cta.action}
          </ParentSiteLink>
        </div>

        <section className="brazil-rewards-carousel" aria-label="Recompensas de boas-vindas">
          <button className="brazil-arrow brazil-arrow--left" type="button" aria-label={config.labels.previous} disabled={activeStep === 0} onClick={() => rewardSwiperRef.current?.slidePrev()}>‹</button>
          <button className="brazil-arrow brazil-arrow--right" type="button" aria-label={config.labels.next} disabled={activeStep === steps.length - 1} onClick={() => rewardSwiperRef.current?.slideNext()}>›</button>

          <Swiper
            key={variant}
            className="brazil-reward-swiper"
            modules={[A11y]}
            slidesPerView={1.2}
            spaceBetween={8}
            breakpoints={{ 769: { slidesPerView: 1.1, spaceBetween: 20 } }}
            onSwiper={(swiper) => {
              rewardSwiperRef.current = swiper;
              setActiveStep(swiper.realIndex);
            }}
            onSlideChange={(swiper) => setActiveStep(swiper.realIndex)}
          >
            {steps.map((item, index) => (
              <SwiperSlide key={item.id}>
                <article className="brazil-reward">
                  <div className="brazil-card-background" aria-hidden="true">
                    <ProgressiveImage wrapperClassName="brazil-card-background-image" src={`${assetRoot}/card-bg.avif`} preview={`${assetRoot}/previews/card-bg.webp`} alt="" />
                  </div>
                  <div className="brazil-step-image">
                    <ProgressiveImage wrapperClassName="brazil-step-visual" src={item.image} mobileSrc={mobileFor(item.image)} preview={previewFor(item.image)} alt="" eager={index === 0} />
                  </div>
                  <span className="brazil-step-label">{config.labels.step} {index + 1}/{steps.length}</span>

                  <div className="brazil-reward-copy">
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <p className="brazil-offer-mode">
                      {item.bonusChoice
                        ? config.labels.chooseOne
                        : "bonusGame" in item
                          ? config.labels.triple
                          : config.labels.combo}
                    </p>
                    <div className={`brazil-offers${"bonusGame" in item && item.freeSpins !== "—" ? " brazil-offers--triple" : ""}`}>
                      <div>
                        <Image src="/icons/rewards/deposit-bonus.webp" alt="" width={76} height={76} />
                        <span><strong>{item.depositBonus}</strong><small>{config.labels.depositBonus}</small></span>
                      </div>
                      {item.freeSpins !== "—" && (
                        <div>
                          <Image src="/icons/rewards/free-spins.webp" alt="" width={76} height={76} />
                          <span><strong>{item.freeSpins}</strong><small>{config.labels.freeSpins}</small></span>
                        </div>
                      )}
                      {"bonusGame" in item && (
                        <div className="brazil-offer-game">
                          <Image src={item.bonusGame.image} alt="" width={76} height={76} />
                          <span>
                            <strong>{item.bonusGame.name}</strong>
                            <small>{config.labels.bonusGame}{item.bonusGame.wager ? ` · ${config.labels.wager} ${item.bonusGame.wager}` : ""}</small>
                          </span>
                        </div>
                      )}
                    </div>
                    <dl className="brazil-details">
                      <div>
                        <Image src="/icons/rewards/minimum-deposit.webp" alt="" width={48} height={48} />
                        <dt>{config.labels.minimumDeposit}</dt><dd>{item.minimumDeposit}</dd>
                      </div>
                      <div>
                        <Image src="/icons/rewards/wagering-requirement.webp" alt="" width={48} height={48} />
                        <dt>{config.labels.wager}</dt><dd>{item.depositWager}</dd>
                      </div>
                      {item.freeSpins !== "—" && (
                        <div>
                          <Image src="/icons/rewards/wagering-requirement.webp" alt="" width={48} height={48} />
                          <dt>FS {config.labels.wager}</dt><dd>{item.freeSpinsWager}</dd>
                        </div>
                      )}
                      {item.cashback !== "—" && (
                        <div>
                          <Image src="/icons/rewards/cashback.webp" alt="" width={48} height={48} />
                          <dt>{config.labels.cashback}</dt><dd>{item.cashback}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        </section>
      </div>
    </main>
  );
}

