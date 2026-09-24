export type HeroLocale = "en" | "fr";
type HeroCopy = {
  eyebrow: string;
  titleAccent: string;
  titleLead: string;
};

export const heroConfig = {
  autoplayDelay: 6000,
  fadeDuration: 2200,
  background: "/images/hero/aurora-background.png",
  label: {
    en: "Legendary North welcome offers",
    fr: "Offres de bienvenue du Nord légendaire",
  },
  slides: [
    {
      id: "welcome-bonus",
      character: "/images/hero/welcome-adventurer.png",
      characterAlt: {
        en: "Cheerful northern adventurer celebrating",
        fr: "Aventurier nordique célébrant joyeusement",
      },
      characterWidth: 1463,
      characterHeight: 1075,
      characterSide: "right",
      textSide: "left",
      copy: {
        en: {
          eyebrow: "WELCOME OFFER <span>5 BONUS STEPS</span>",
          titleLead: "UP TO 590%",
          titleAccent: "700 FREESPINS",
        },
        fr: {
          eyebrow: "OFFRE DE BIENVENUE <span>5 ÉTAPES BONUS</span>",
          titleLead: "JUSQU’À 1000 %",
          titleAccent: "700 TOURS GRATUITS",
        },
      } satisfies Record<HeroLocale, HeroCopy>,
    },
    {
      id: "guide",
      character: "/images/hero/compass-guide.png",
      characterAlt: {
        en: "Northern guide holding a compass",
        fr: "Guide nordique tenant une boussole",
      },
      characterWidth: 1330,
      characterHeight: 1182,
      characterSide: "left",
      textSide: "right",
      copy: {
        en: {
          eyebrow: "",
          titleLead: "YOUR JOURNEY",
          titleAccent: "LEGENDARY NORTH",
        },
        fr: {
          eyebrow: "",
          titleLead: "VOTRE AVENTURE",
          titleAccent: "NORD LÉGENDAIRE",
        },
      } satisfies Record<HeroLocale, HeroCopy>,
    },
    {
      id: "explorer",
      character: "/images/hero/ice-axe-explorer.png",
      characterAlt: {
        en: "Northern explorer holding an ice axe",
        fr: "Exploratrice nordique tenant un piolet",
      },
      characterWidth: 1464,
      characterHeight: 1074,
      characterSide: "right",
      textSide: "left",
      copy: {
        en: {
          eyebrow: "",
          titleLead: "FIND YOUR",
          titleAccent: "NEXT ADVENTURE",
        },
        fr: {
          eyebrow: "",
          titleLead: "TROUVEZ VOTRE",
          titleAccent: "PROCHAINE AVENTURE",
        },
      } satisfies Record<HeroLocale, HeroCopy>,
    },
  ],
} as const;
