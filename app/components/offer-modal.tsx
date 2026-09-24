"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

import "./offer-modal.css";

import { offerModalConfig } from "../config/offer-modal";
import type { HeroLocale } from "../config/hero-banner";

export function OfferModal({ locale }: { locale: HeroLocale }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const copy = offerModalConfig.copy[locale];

  useEffect(() => {
    const { name } = offerModalConfig.dismissCookie;
    const isDismissed = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith(`${name}=`));

    if (isDismissed) return;

    const timer = window.setTimeout(() => {
      dialogRef.current?.showModal();
    }, offerModalConfig.delayMs);

    return () => window.clearTimeout(timer);
  }, []);

  const close = () => dialogRef.current?.close();
  const dismiss = () => {
    const { name, maxAgeSeconds } = offerModalConfig.dismissCookie;

    document.cookie = `${name}=1; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
    close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="offer-modal"
      aria-labelledby="offer-modal-title"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const outside =
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom;

        if (outside) close();
      }}
    >
      <button
        className="offer-modal-close"
        type="button"
        aria-label={copy.closeLabel}
        onClick={close}
      >
        ×
      </button>

      <div className="offer-modal-visual" aria-hidden="true">
        <Image
          className="offer-modal-character"
          src={offerModalConfig.image.src}
          alt=""
          width={offerModalConfig.image.width}
          height={offerModalConfig.image.height}
          sizes="(max-width: 768px) 72vw, 430px"
        />
      </div>

      <div className="offer-modal-copy">
        <p className="offer-modal-eyebrow">{copy.eyebrow}</p>
        <h2 id="offer-modal-title">
          <span>{copy.titleLead}</span>
          {copy.titleAccent}
        </h2>
        <p className="offer-modal-description">
          {copy.descriptionLead} <strong>{copy.amount}</strong>{" "}
          {copy.descriptionTail}
        </p>
        <button className="offer-modal-action" type="button" onClick={close}>
          {copy.action}
        </button>
        <button className="offer-modal-dismiss" type="button" onClick={dismiss}>
          {copy.dismissAction}
        </button>
      </div>
    </dialog>
  );
}
