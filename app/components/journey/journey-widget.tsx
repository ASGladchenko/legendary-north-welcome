"use client";

import { useRef, useState } from "react";

import type { Swiper as SwiperInstance } from "swiper";

import "./journey-widget.css";

import { journeyConfig, type JourneyLocale } from "../../config/journey";
import { JourneyMap } from "./journey-map";
import { RewardsSlider } from "./rewards-slider";

type JourneyWidgetProps = {
  actionHref: string;
  locale: JourneyLocale;
  showSignup: boolean;
};

export function JourneyWidget({
  actionHref,
  locale,
  showSignup,
}: JourneyWidgetProps) {
  const [activeStep, setActiveStep] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <div className="journey-widget">
      <JourneyMap
        locale={locale}
        activeStep={activeStep}
        onStepSelect={(index) => swiperRef.current?.slideTo(index)}
      />

      <div className="journey-cta-anchor">
        <a className="journey-cta" href={actionHref} target="_top">
          {showSignup
            ? journeyConfig.copy[locale].signupAction
            : journeyConfig.copy[locale].promoAction}
        </a>
      </div>

      <RewardsSlider
        activeStep={activeStep}
        locale={locale}
        onNext={() => swiperRef.current?.slideNext()}
        onPrevious={() => swiperRef.current?.slidePrev()}
        onReady={(swiper) => {
          swiperRef.current = swiper;
        }}
        onStepChange={setActiveStep}
      />
    </div>
  );
}
