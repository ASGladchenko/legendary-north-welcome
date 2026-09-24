"use client";

import { useRef, useState } from "react";

import type { Swiper as SwiperInstance } from "swiper";

import type { JourneyLocale } from "../../config/journey";
import { JourneyMap } from "./journey-map";
import { RewardsSlider } from "./rewards-slider";

export function JourneyWidget({ locale }: { locale: JourneyLocale }) {
  const [activeStep, setActiveStep] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <div className="journey-widget">
      <JourneyMap
        locale={locale}
        activeStep={activeStep}
        onStepSelect={(index) => swiperRef.current?.slideTo(index)}
      />
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
