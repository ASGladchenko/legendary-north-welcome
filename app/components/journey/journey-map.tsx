import type { CSSProperties } from "react";

import { getImageProps } from "next/image";

import "./journey-map.css";

import { journeyConfig, type JourneyLocale } from "../../config/journey";

const map = {
  desktop: getImageProps({
    ...journeyConfig.map.desktop,
    alt: "",
    quality: 75,
    sizes: "(min-width: 769px) 1180px, 100vw",
  }).props,
  mobile: getImageProps({
    ...journeyConfig.map.mobile,
    alt: "",
    sizes: "100vw",
    loading: "eager",
    unoptimized: true,
  }).props,
};

type JourneyMapProps = {
  locale: JourneyLocale;
  activeStep: number;
  onStepSelect: (index: number) => void;
};

export function JourneyMap({
  locale,
  activeStep,
  onStepSelect,
}: JourneyMapProps) {
  return (
    <div className="map" aria-label={journeyConfig.copy[locale].mapLabel}>
      <picture>
        <source media="(min-width: 769px)" srcSet={map.desktop.srcSet} />
        <img
          {...map.mobile}
          alt=""
          aria-hidden="true"
          className="map-image"
        />
      </picture>

      <ol className="steps">
        {journeyConfig.steps.map((step, index) => (
          <li
            className="step"
            key={step.id}
            style={{
              "--step-x": step.position.desktop.x,
              "--step-y": step.position.desktop.y,
              "--step-mobile-x": step.position.mobile.x,
              "--step-mobile-y": step.position.mobile.y,
            } as CSSProperties}
          >
            <button
              type="button"
              aria-label={step.copy[locale].title}
              aria-pressed={activeStep === index}
              onClick={() => onStepSelect(index)}
            >
              {index + 1}
            </button>
            <strong>{step.copy[locale].title}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
