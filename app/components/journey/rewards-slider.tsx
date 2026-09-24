import Image from "next/image";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { journeyConfig, type JourneyLocale } from "../../config/journey";

type RewardsSliderProps = {
  activeStep: number;
  locale: JourneyLocale;
  onNext: () => void;
  onPrevious: () => void;
  onReady: (swiper: SwiperInstance) => void;
  onStepChange: (index: number) => void;
};

export function RewardsSlider({
  activeStep,
  locale,
  onNext,
  onPrevious,
  onReady,
  onStepChange,
}: RewardsSliderProps) {
  return (
    <section
      className="rewards-carousel"
      aria-label={journeyConfig.copy[locale].carouselLabel}
    >
      <button
        className="reward-nav reward-prev"
        type="button"
        aria-label={locale === "fr" ? "Récompense précédente" : "Previous reward"}
        disabled={activeStep === 0}
        onClick={onPrevious}
      >
        <span aria-hidden="true" />
      </button>

      <button
        className="reward-nav reward-next"
        type="button"
        aria-label={locale === "fr" ? "Récompense suivante" : "Next reward"}
        disabled={activeStep === journeyConfig.steps.length - 1}
        onClick={onNext}
      >
        <span aria-hidden="true" />
      </button>

      <Swiper
        key={locale}
        className="reward-swiper"
        modules={[A11y]}
        slidesPerView={1}
        spaceBetween={20}
        onSwiper={(swiper) => {
          onReady(swiper);
          onStepChange(swiper.realIndex);
        }}
        onSlideChange={(swiper) => onStepChange(swiper.realIndex)}
      >
        {journeyConfig.steps.map((step, index) => (
          <SwiperSlide key={step.id}>
            <article className="reward-card">
              <Image
                className="reward-image"
                src={step.image}
                alt=""
                width={1254}
                height={1254}
                sizes="(max-width: 768px) 105px, 260px"
              />

              <div className="reward-copy">
                <p className="reward-step">
                  {journeyConfig.copy[locale].stepLabel} {index + 1}/{journeyConfig.steps.length}
                </p>
                <h2>{step.copy[locale].title}</h2>
                <p className="reward-description">
                  {step.copy[locale].description}
                </p>
              </div>

              <ul className="reward-benefits">
                {step.copy[locale].rewards.map((reward, rewardIndex) => (
                  <li key={reward}>
                    <Image
                      className="reward-benefit-icon"
                      src={journeyConfig.rewardIcons[rewardIndex]}
                      alt=""
                      width={64}
                      height={64}
                      sizes="(max-width: 768px) 25px, 31px"
                    />
                    <small>{reward}</small>
                  </li>
                ))}
              </ul>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
