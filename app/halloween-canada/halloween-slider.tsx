"use client";

import type { CSSProperties } from "react";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { ParentSiteLink } from "../components/parent-site-link";
import { HalloweenPumpkinCube } from "./halloween-pumpkin-cube";
import styles from "./halloween-slider.module.css";

export type HalloweenSlide = {
  id: string;
  image: string;
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
  const initialSlide = Math.floor(Math.max(items.length - 1, 0) / 2);
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
        <Image
          alt=""
          className={`${styles.webImage} ${styles.webTopLeft}`}
          height={512}
          loading="lazy"
          quality={70}
          sizes="(max-width: 620px) 250px, 440px"
          src="/images/halloween-canada/decor/web-top-left.webp"
          width={768}
        />
        <Image
          alt=""
          className={`${styles.webImage} ${styles.webBottomRight}`}
          height={512}
          loading="lazy"
          quality={70}
          sizes="(max-width: 620px) 240px, 420px"
          src="/images/halloween-canada/decor/web-bottom-right.webp"
          width={768}
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
                  <Image
                    alt={item.title}
                    className={styles.image}
                    decoding="async"
                    draggable={false}
                    fetchPriority={index === initialSlide ? "high" : "auto"}
                    height="234"
                    loading={index === initialSlide ? "eager" : "lazy"}
                    quality={70}
                    sizes="(max-width: 620px) 158px, 182px"
                    src={item.image}
                    width="416"
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
          play: labels.cubePlay,
          result: labels.cubeResult,
          spin: labels.cube,
          tap: labels.cubeTap,
        }}
      />
    </div>
  );
}
