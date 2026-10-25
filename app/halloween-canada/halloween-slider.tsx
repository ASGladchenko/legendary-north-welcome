"use client";

import type { CSSProperties } from "react";
import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { ParentSiteLink } from "../components/parent-site-link";
import { HalloweenProgressiveImage } from "./halloween-progressive-image";
import { HalloweenPumpkinCube } from "./halloween-pumpkin-cube";
import styles from "./halloween-slider.module.css";

export type HalloweenSlide = {
  id: string;
  image: string;
  preview: string;
  title: string;
  href: string;
  accent?: string;
};

type HalloweenSliderLabels = {
  carousel: string;
  previous: string;
  next: string;
  position: string;
  goTo: string;
  cube: string;
  cubeLoading: string;
  cubeTap: string;
  cubeResult: string;
  cubePlay: string;
  cubeClose: string;
};

type HalloweenSliderProps = {
  items: HalloweenSlide[];
  labels: HalloweenSliderLabels;
  className?: string;
};

type CardStyle = CSSProperties & { "--halloween-card-accent": string };

export function HalloweenSlider({
  items,
  labels,
  className,
}: HalloweenSliderProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const initialSlide = Math.min(2, Math.max(items.length - 1, 0));
  const [activeIndex, setActiveIndex] = useState(initialSlide);
  const [atStart, setAtStart] = useState(initialSlide === 0);
  const [atEnd, setAtEnd] = useState(initialSlide === items.length - 1);

  const sync = useCallback((swiper: SwiperInstance) => {
    setActiveIndex(swiper.activeIndex);
    setAtStart(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className={styles.experience}>
      <div aria-hidden="true" className={styles.webDecor}>
        <HalloweenProgressiveImage
          alt=""
          className={`${styles.webImage} ${styles.webTopLeft}`}
          preview="/images/halloween-canada/previews/web-top-left.webp"
          quality={70}
          sizes="(max-width: 620px) 250px, 440px"
          src="/images/halloween-canada/decor/web-top-left.webp"
        />
        <HalloweenProgressiveImage
          alt=""
          className={`${styles.webImage} ${styles.webBottomRight}`}
          preview="/images/halloween-canada/previews/web-bottom-right.webp"
          quality={70}
          sizes="(max-width: 620px) 240px, 420px"
          src="/images/halloween-canada/decor/web-bottom-right.webp"
        />
      </div>

      <section
        aria-label={labels.carousel}
        className={[styles.root, className].filter(Boolean).join(" ")}
      >
        <button
          aria-label={labels.previous}
          className={`${styles.arrow} ${styles.previous}`}
          disabled={atStart}
          onClick={() => swiperRef.current?.slidePrev()}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m14 5-7 7 7 7" />
          </svg>
        </button>

        <div className={styles.window}>
          <Swiper
            centerInsufficientSlides
            centeredSlides
            className={styles.swiper}
            grabCursor={items.length > 1}
            initialSlide={initialSlide}
            modules={[A11y]}
            onSlideChange={sync}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              sync(swiper);
            }}
            slidesPerView="auto"
            spaceBetween={18}
            speed={420}
            threshold={6}
            watchSlidesProgress
          >
            {items.map((item, index) => (
              <SwiperSlide className={styles.slide} key={item.id}>
                <ParentSiteLink
                  aria-label={item.title}
                  className={styles.card}
                  href={item.href}
                  style={
                    {
                      "--halloween-card-accent": item.accent ?? "#ff8a35",
                    } as CardStyle
                  }
                >
                  <HalloweenProgressiveImage
                    alt={item.title}
                    className={styles.cardMedia}
                    eager={index === initialSlide}
                    imageClassName={styles.image}
                    preview={item.preview}
                    quality={70}
                    sizes="(max-width: 620px) 158px, 182px"
                    src={item.image}
                  />
                  <span aria-hidden="true" className={styles.insideBorder} />
                </ParentSiteLink>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          aria-label={labels.next}
          className={`${styles.arrow} ${styles.next}`}
          disabled={atEnd}
          onClick={() => swiperRef.current?.slideNext()}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m10 5 7 7-7 7" />
          </svg>
        </button>

        <div aria-label={labels.position} className={styles.pagination}>
          {items.map((item, index) => (
            <button
              aria-label={`${labels.goTo} ${item.title}`}
              aria-pressed={index === activeIndex}
              className={styles.bullet}
              key={item.id}
              onClick={() => swiperRef.current?.slideTo(index)}
              type="button"
            />
          ))}
        </div>
      </section>

      <HalloweenPumpkinCube
        items={items}
        labels={{
          close: labels.cubeClose,
          loading: labels.cubeLoading,
          play: labels.cubePlay,
          result: labels.cubeResult,
          spin: labels.cube,
          tap: labels.cubeTap,
        }}
      />
    </div>
  );
}
