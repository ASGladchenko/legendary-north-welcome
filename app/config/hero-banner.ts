export type HeroLocale = "en" | "fr";
type HeroCopy = {
  eyebrow: string;
  subtitle: string;
  tagline?: string;
  titleAccent: string;
  titleLead: string;
};

export const heroConfig = {
  autoplayDelay: 6000,
  fadeDuration: 2200,
  background: "/images/hero/slider/background.png",
  label: {
    en: "Legendary North welcome offers",
    fr: "Offres de bienvenue du Nord légendaire",
  },
  slides: [
    {
      id: "welcome-bonus",
      character: "/images/hero/slider/welcome-man.png",
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
          eyebrow: "WELCOME OFFER",
          titleLead: "UP TO 1000%",
          titleAccent: "700 FREESPINS",
          subtitle: "",
          tagline: "CLAIM IT. SPIN IT. OWN THE NORTH.",
        },
        fr: {
          eyebrow: "OFFRE DE BIENVENUE",
          titleLead: "JUSQU’À 1000 %",
          titleAccent: "700 TOURS GRATUITS",
          subtitle: "",
          tagline: "RÉCLAMEZ. TOURNEZ. CONQUÉREZ LE NORD.",
        },
      } satisfies Record<HeroLocale, HeroCopy>,
    },
    {
      id: "guide",
      character: "/images/hero/slider/man.png",
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
          subtitle: "DEPOSIT. PLAY. UNLOCK BIGGER REWARDS.",
        },
        fr: {
          eyebrow: "",
          titleLead: "VOTRE AVENTURE",
          titleAccent: "NORD LÉGENDAIRE",
          subtitle: "DÉPOSEZ. JOUEZ. DÉBLOQUEZ DE PLUS GRANDES RÉCOMPENSES.",
        },
      } satisfies Record<HeroLocale, HeroCopy>,
    },
    {
      id: "explorer",
      character: "/images/hero/slider/woman-2.png",
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
          subtitle: "PLAY. EXPLORE. CLAIM LEGENDARY REWARDS.",
        },
        fr: {
          eyebrow: "",
          titleLead: "TROUVEZ VOTRE",
          titleAccent: "PROCHAINE AVENTURE",
          subtitle: "JOUEZ. EXPLOREZ. RÉCLAMEZ DES RÉCOMPENSES LÉGENDAIRES.",
        },
      } satisfies Record<HeroLocale, HeroCopy>,
    },
  ],
} as const;
