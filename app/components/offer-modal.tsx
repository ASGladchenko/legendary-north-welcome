"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

import "./offer-modal.css";

import {
  offerModalConfig,
  type OfferModalLocale,
} from "../config/offer-modal";

type OfferModalImage = {
  height: number;
  src: string;
  width: number;
};

type OfferModalProps = {
  actionHref: string;
  image?: OfferModalImage;
  locale: OfferModalLocale;
};

export function OfferModal({
  actionHref,
  image = offerModalConfig.image,
  locale,
}: OfferModalProps) {
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
      className={`offer-modal${locale === "pt-BR" ? " offer-modal--brazil" : ""}`}
      lang={locale}
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
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
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
        <div className="offer-modal-actions">
          <a
            className="offer-modal-action"
            href={actionHref}
            target="_top"
            onClick={close}
          >
            {copy.action}
          </a>
          <button className="offer-modal-dismiss" type="button" onClick={dismiss}>
            {copy.dismissAction}
          </button>
        </div>
      </div>
    </dialog>
  );
}
