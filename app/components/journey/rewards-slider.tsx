import Image from "next/image";
import { Fragment } from "react";

import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "./rewards-slider.css";

import {
  getJourneySteps,
  journeyConfig,
  type JourneyLocale,
  type JourneyVariant,
} from "../../config/journey";

type RewardsSliderProps = {
  activeStep: number;
  locale: JourneyLocale;
  onNext: () => void;
  onPrevious: () => void;
  onReady: (swiper: SwiperInstance) => void;
  onStepChange: (index: number) => void;
  variant: JourneyVariant;
};

type BenefitProps = {
  icon: string;
  label: string;
  value: string;
};

type RewardOption = {
  detail: string | null;
  icon: string;
  isBonusGame: boolean;
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

function RewardOptionCard({ option }: { option: RewardOption }) {
  return (
    <div
      className={`reward-option${option.isBonusGame ? " reward-option--game" : ""}`}
    >
      <Image src={option.icon} alt="" width={96} height={96} sizes="46px" />
      <span>
        <strong>{option.value}</strong>
        <small>{option.label}</small>
        {option.detail && <em>{option.detail}</em>}
      </span>
    </div>
  );
}

export function RewardsSlider({
  activeStep,
  locale,
  onNext,
  onPrevious,
  onReady,
  onStepChange,
  variant,
}: RewardsSliderProps) {
  const labels = journeyConfig.copy[locale];
  const steps = getJourneySteps(variant);

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
        disabled={activeStep === steps.length - 1}
        onClick={onNext}
      >
        <span aria-hidden="true" />
      </button>

      <Swiper
        key={`${locale}-${variant}`}
        className="reward-swiper"
        modules={[A11y]}
        slidesPerView={1.1}
        spaceBetween={8}
        breakpoints={{
          769: { slidesPerView: 1.1, spaceBetween: 20 },
        }}
        onSwiper={(swiper) => {
          onReady(swiper);
          onStepChange(swiper.realIndex);
        }}
        onSlideChange={(swiper) => onStepChange(swiper.realIndex)}
      >
        {steps.map((step, index) => {
          const copy = step.copy[locale];
          const bonus = copy.bonus;
          const bonusGame =
            "bonusGame" in step ? step.bonusGame : null;
          const minimumDeposit = {
            icon: journeyConfig.rewardIcons.minimumDeposit,
            label: labels.labels.minimumDeposit,
            value: bonus.minimumDeposit,
          };
          const depositWager = {
            icon: journeyConfig.rewardIcons.wager,
            label: labels.labels.depositWager,
            value: bonus.depositWager,
          };
          const freeSpinsWager = {
            icon: journeyConfig.rewardIcons.wager,
            label: labels.labels.freeSpinsWager,
            value: bonus.freeSpinsWager,
          };
          const cashback = {
            icon: journeyConfig.rewardIcons.cashback,
            label:
              variant === "vip"
                ? "+ " + labels.labels.cashback
                : labels.labels.cashback,
            value: bonus.cashback,
          };
          const rewardOptions: RewardOption[] = [
            {
              detail: null,
              icon: journeyConfig.rewardIcons.depositBonus,
              isBonusGame: false,
              label: labels.labels.depositBonus,
              value: bonus.depositBonus,
            },
            ...(bonus.freeSpins === "—"
              ? []
              : [
                  {
                    detail: null,
                    icon: journeyConfig.rewardIcons.freeSpins,
                    isBonusGame: false,
                    label: labels.labels.freeSpins,
                    value: bonus.freeSpins,
                  },
                ]),
            ...(bonusGame
              ? [
                  {
                    detail: bonusGame.wager
                      ? labels.labels.wager + " " + bonusGame.wager
                      : null,
                    icon: bonusGame.image,
                    isBonusGame: true,
                    label: labels.labels.bonusGame,
                    value: bonusGame.name,
                  },
                ]
              : []),
          ];
          const standardBenefits = step.bonusChoice
            ? [
                minimumDeposit,
                depositWager,
                freeSpinsWager,
                ...(bonus.cashback === "—" ? [] : [cashback]),
              ]
            : [
                minimumDeposit,
                {
                  icon: journeyConfig.rewardIcons.wager,
                  label: labels.labels.wager,
                  value: bonus.depositWager,
                },
              ];
          const vipBenefits = [
            minimumDeposit,
            depositWager,
            ...(bonus.freeSpins === "—" ? [] : [freeSpinsWager]),
            ...(bonus.cashback === "—" ? [] : [cashback]),
          ];
          const benefits =
            variant === "vip" ? vipBenefits : standardBenefits;

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
                        {labels.stepLabel} {index + 1}/{steps.length}
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

                <fieldset
                  className={`reward-choice${rewardOptions.length === 3 && !step.bonusChoice ? " reward-choice--triple" : ""}`}
                >
                  <legend>
                    {rewardOptions.length === 3 && !step.bonusChoice
                      ? "TRIPLE"
                      : step.bonusChoice
                        ? labels.choiceLabel
                        : labels.comboLabel}
                  </legend>
                  {rewardOptions.length === 3 ? (
                    <div
                      className={
                        "reward-options-marquee" +
                        (step.bonusChoice
                          ? " reward-options-marquee--choice"
                          : " reward-options-marquee--combo")
                      }
                    >
                      <div className="reward-options-track">
                        {[...rewardOptions, ...rewardOptions].map(
                          (option, optionIndex) => (
                            <div
                              className="reward-options-item"
                              key={`${option.label}-${optionIndex}`}
                              aria-hidden={
                                optionIndex >= rewardOptions.length
                              }
                            >
                              <RewardOptionCard option={option} />
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="reward-choice-options">
                      {rewardOptions.map((option, optionIndex) => (
                        <Fragment key={option.label}>
                          {optionIndex > 0 && (
                            <b>
                              {step.bonusChoice
                                ? labels.orLabel
                                : option.isBonusGame
                                  ? "+"
                                  : labels.andLabel}
                            </b>
                          )}
                          <RewardOptionCard option={option} />
                        </Fragment>
                      ))}
                    </div>
                  )}
                </fieldset>

                <ul className="reward-benefits">
                  {benefits.map((benefit) => (
                    <Benefit key={`${benefit.label}-${benefit.value}`} {...benefit} />
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
