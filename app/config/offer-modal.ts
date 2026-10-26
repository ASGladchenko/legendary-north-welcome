import type { HeroLocale } from "./hero-banner";

export type OfferModalLocale = HeroLocale | "en-BR" | "pt-BR";

export const offerModalConfig = {
  delayMs: 12000,
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
      amount: "200 CAD or more, ",
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
      amount: "200 CAD ou plus, ",
      descriptionTail:
        "et débloquez une aventure incroyable regorgeant de récompenses vraiment épiques !",
      action: "C'EST PARTI",
      dismissAction: "NE PLUS AFFICHER",
      closeLabel: "Fermer l’offre",
    },
    "en-BR": {
      eyebrow: "",
      titleLead: "OOPS...",
      titleAccent: "I CAN'T BELIEVE I'M TELLING YOU THIS",
      descriptionLead: "Make your first deposit of",
      amount: "200 BRL or more, ",
      descriptionTail:
        "and unlock an incredible journey packed with seriously epic rewards!",
      action: "LET'S GO",
      dismissAction: "DON'T SHOW AGAIN",
      closeLabel: "Close offer",
    },
    "pt-BR": {
      eyebrow: "",
      titleLead: "OPA...",
      titleAccent: "NÃO ACREDITO QUE ESTOU TE CONTANDO ISSO",
      descriptionLead: "Faça seu primeiro depósito de",
      amount: "200 BRL ou mais, ",
      descriptionTail:
        "e desbloqueie uma jornada incrível cheia de recompensas épicas!",
      action: "VAMOS LÁ",
      dismissAction: "NÃO MOSTRAR NOVAMENTE",
      closeLabel: "Fechar oferta",
    },
  } satisfies Record<OfferModalLocale, Record<string, string>>,
} as const;
