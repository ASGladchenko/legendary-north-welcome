'use client';

import type { CSSProperties } from "react";
import { useCallback, useRef, useState } from "react";

import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ParentSiteLink } from "../components/parent-site-link";
import { HalloweenProgressiveImage } from "./halloween-progressive-image";
import { HalloweenPumpkinCube } from "./halloween-pumpkin-cube";

import "swiper/css";

import styles from "./halloween-slider.module.css";

export type HalloweenSlide = {
  accent?: string;
  href: string;
  id: string;
  image: string;
  preview: string;
  title: string;
};
type HalloweenSliderLabels = {
  carousel: string;
  cube: string;
  cubeClose: string;
  cubeLoading: string;
  cubePlay: string;
  cubeResult: string;
  cubeTap: string;
  goTo: string;
  next: string;
  position: string;
  previous: string;
};
type HalloweenSliderProps = {
  className?: string;
  items: HalloweenSlide[];
  labels: HalloweenSliderLabels;
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

  const sync = useCallback((swiper: SwiperInstance) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className={styles.experience}>
      <div aria-hidden="true" className={styles.webDecor}>
        <HalloweenProgressiveImage
          alt=""
          className={`${styles.webImage} ${styles.webTopLeft}`}
          eager
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
          onClick={() => swiperRef.current?.slidePrev()}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m14 5-7 7 7 7" />
          </svg>
        </button>

        <div className={styles.window}>
          <Swiper
            autoplay={{
              delay: 5_000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            centerInsufficientSlides
            centeredSlides
            className={styles.swiper}
            grabCursor={items.length > 1}
            initialSlide={initialSlide}
            loop={items.length > 1}
            modules={[A11y, Autoplay]}
            onSlideChange={sync}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              sync(swiper);
            }}
            slidesPerView="auto"
            spaceBetween={18}
            speed={1_000}
            threshold={6}
            watchSlidesProgress
          >
            {items.map((item, index) => (
              <SwiperSlide className={styles.slide} key={item.id}>
                <div
                  className={styles.card}
                  style={
                    {
                      "--halloween-card-accent": item.accent ?? "#ff8a35",
                    } as CardStyle
                  }
                >
                  <button
                    aria-label={`${labels.goTo} ${item.title}`}
                    className={styles.cardSelect}
                    onClick={() => {
                      swiperRef.current?.autoplay.stop();
                      swiperRef.current?.slideToLoop(index);
                    }}
                    tabIndex={activeIndex === index ? -1 : 0}
                    type="button"
                  >
                    <HalloweenProgressiveImage
                      alt={item.title}
                      className={styles.cardMedia}
                      eager={index < 5}
                      imageClassName={styles.image}
                      preview={item.preview}
                      quality={70}
                      sizes="(max-width: 620px) 158px, (min-width: 1000px) 222px, 182px"
                      src={item.image}
                    />
                  </button>
                  <span aria-hidden="true" className={styles.cardOverlay} />
                  <ParentSiteLink
                    aria-hidden={activeIndex !== index}
                    aria-label={`${labels.cubePlay}: ${item.title}`}
                    className={styles.cardPlay}
                    href={item.href}
                    tabIndex={activeIndex === index ? 0 : -1}
                  >
                    <span aria-hidden="true" className={styles.playButton}>
                      <span aria-hidden="true" className={styles.playIcon} />
                    </span>
                  </ParentSiteLink>
                  <span aria-hidden="true" className={styles.insideBorder} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          aria-label={labels.next}
          className={`${styles.arrow} ${styles.next}`}
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
              onClick={() => swiperRef.current?.slideToLoop(index)}
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
