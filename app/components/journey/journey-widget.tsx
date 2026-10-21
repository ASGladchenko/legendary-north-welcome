"use client";

import { useRef, useState } from "react";

import type { Swiper as SwiperInstance } from "swiper";

import "./journey-widget.css";

import {
  journeyConfig,
  type JourneyLocale,
  type JourneyVariant,
} from "../../config/journey";
import { ParentSiteLink } from "../parent-site-link";
import { JourneyMap } from "./journey-map";
import { RewardsSlider } from "./rewards-slider";

type JourneyWidgetProps = {
  actionHref: string;
  locale: JourneyLocale;
  variant: JourneyVariant;
};

export function JourneyWidget({
  actionHref,
  locale,
  variant,
}: JourneyWidgetProps) {
  const [activeStep, setActiveStep] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <div className="journey-widget">
      <JourneyMap
        locale={locale}
        variant={variant}
        activeStep={activeStep}
        onStepSelect={(index) => swiperRef.current?.slideTo(index)}
      />

      <div className="journey-cta-anchor">
        <ParentSiteLink className="journey-cta" href={actionHref}>
          {journeyConfig.copy[locale].signupAction}
        </ParentSiteLink>
      </div>

      <RewardsSlider
        activeStep={activeStep}
        locale={locale}
        variant={variant}
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
