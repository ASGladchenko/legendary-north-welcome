import type { HeroLocale } from "./hero-banner";

export const offerModalConfig = {
  delayMs: 5000,
  dismissCookie: {
    name: "offer_modal_hidden",
    maxAgeSeconds: 60 * 60 * 24 * 365,
  },
  image: {
    src: "/images/modal/deposit-offer-host.webp",
    width: 1086,
    height: 1448,
  },
  copy: {
    en: {
      eyebrow: "",
      titleLead: "OOPS...",
      titleAccent: "I CAN'T BELIEVE I'M TELLING YOU THIS",
      descriptionLead: "Make your first deposit of",
      amount: "C$200 or more, ",
      descriptionTail:
        "and unlock an incredible journey packed with seriously epic rewards !",
      action: "LET'S GO",
      dismissAction: "DON'T SHOW AGAIN",
      closeLabel: "Close offer",
    },
    fr: {
      eyebrow: "",
      titleLead: "OUPS...",
      titleAccent: "JE N'ARRIVE PAS À CROIRE QUE JE VOUS DIS ÇA",
      descriptionLead: "Effectuez votre premier dépôt de",
      amount: "200 $ CA ou plus, ",
      descriptionTail:
        "et débloquez une aventure incroyable regorgeant de récompenses vraiment épiques !",
      action: "C'EST PARTI",
      dismissAction: "NE PLUS AFFICHER",
      closeLabel: "Fermer l’offre",
    },
  } satisfies Record<HeroLocale, Record<string, string>>,
} as const;
