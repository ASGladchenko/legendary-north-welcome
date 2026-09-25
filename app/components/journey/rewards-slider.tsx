import Image from "next/image";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "./rewards-slider.css";

import { journeyConfig, type JourneyLocale } from "../../config/journey";

type RewardsSliderProps = {
  activeStep: number;
  locale: JourneyLocale;
  onNext: () => void;
  onPrevious: () => void;
  onReady: (swiper: SwiperInstance) => void;
  onStepChange: (index: number) => void;
};

type BenefitProps = {
  icon: string;
  label: string;
  value: string;
};

function Benefit({ icon, label, value }: BenefitProps) {
  return (
    <li>
      <Image src={icon} alt="" width={96} height={96} sizes="48px" />
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </li>
  );
}

export function RewardsSlider({
  activeStep,
  locale,
  onNext,
  onPrevious,
  onReady,
  onStepChange,
}: RewardsSliderProps) {
  const labels = journeyConfig.copy[locale];

  return (
    <section className="rewards-carousel" aria-label={labels.carouselLabel}>
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
        {journeyConfig.steps.map((step, index) => {
          const copy = step.copy[locale];
          const bonus = copy.bonus;
          const commonBenefits = [
            {
              icon: journeyConfig.rewardIcons.minimumDeposit,
              label: labels.labels.minimumDeposit,
              value: bonus.minimumDeposit,
            },
            {
              icon: journeyConfig.rewardIcons.depositBonus,
              label: labels.labels.depositBonus,
              value: bonus.depositBonus,
            },
            {
              icon: journeyConfig.rewardIcons.freeSpins,
              label: labels.labels.freeSpins,
              value: bonus.freeSpins,
            },
            {
              icon: journeyConfig.rewardIcons.wager,
              label: labels.labels.wager,
              value: bonus.depositWager,
            },
          ];
          const choiceBenefits = [
            {
              icon: journeyConfig.rewardIcons.minimumDeposit,
              label: labels.labels.minimumDeposit,
              value: bonus.minimumDeposit,
            },
            {
              icon: journeyConfig.rewardIcons.wager,
              label: labels.labels.depositWager,
              value: bonus.depositWager,
            },
            {
              icon: journeyConfig.rewardIcons.wager,
              label: labels.labels.freeSpinsWager,
              value: bonus.freeSpinsWager,
            },
            ...(bonus.cashback === "—"
              ? []
              : [
                  {
                    icon: journeyConfig.rewardIcons.cashback,
                    label: labels.labels.cashback,
                    value: bonus.cashback,
                  },
                ]),
          ];
          const benefits = step.bonusChoice
            ? choiceBenefits
            : [commonBenefits[0], commonBenefits[3]];

          return (
            <SwiperSlide key={step.id}>
              <article className="reward-card">
                <div className="reward-summary">
                  <Image
                    className="reward-image"
                    src={step.image}
                    alt=""
                    width={1254}
                    height={1254}
                    sizes="(max-width: 768px) 118px, 270px"
                  />

                  <div className="reward-copy">
                    <div className="reward-heading">
                      <p className="reward-step">
                        {labels.stepLabel} {index + 1}/{journeyConfig.steps.length}
                      </p>
                      <h2>
                        <strong>{copy.title}</strong>
                      </h2>
                    </div>
                    <p
                      className="reward-description"
                      dangerouslySetInnerHTML={{ __html: copy.description }}
                    />
                  </div>
                </div>

                <fieldset className="reward-choice">
                  <legend>
                    {step.bonusChoice ? labels.choiceLabel : labels.comboLabel}
                  </legend>
                  <div className="reward-choice-options">
                    <div className="reward-option">
                      <Image
                        src={journeyConfig.rewardIcons.depositBonus}
                        alt=""
                        width={96}
                        height={96}
                        sizes="46px"
                      />
                      <span>
                        <strong>{bonus.depositBonus}</strong>
                        <small>{labels.labels.depositBonus}</small>
                      </span>
                    </div>
                    <b>
                      {step.bonusChoice ? labels.orLabel : labels.andLabel}
                    </b>
                    <div className="reward-option">
                      <Image
                        src={journeyConfig.rewardIcons.freeSpins}
                        alt=""
                        width={96}
                        height={96}
                        sizes="46px"
                      />
                      <span>
                        <strong>{bonus.freeSpins}</strong>
                        <small>{labels.labels.freeSpins}</small>
                      </span>
                    </div>
                  </div>
                </fieldset>

                <ul className="reward-benefits">
                  {benefits.map((benefit) => (
                    <Benefit key={benefit.label} {...benefit} />
                  ))}
                </ul>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
