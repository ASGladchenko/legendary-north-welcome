export type JourneyLocale = "en" | "fr";
type JourneyStepCopy = {
  description: string;
  rewards: readonly string[];
  title: string;
};

export const journeyConfig = {
  map: {
    desktop: {
      src: "/images/map/route-desktop.png",
      width: 2078,
      height: 564,
    },
    mobile: {
      src: "/images/map/route-mobile.png",
      width: 1808,
      height: 727,
    },
  },
  rewardIcons: [
    "/icons/rewards/deposit-bonus.png",
    "/icons/rewards/free-spins.png",
    "/icons/rewards/wager.png",
    "/icons/rewards/validity.png",
  ],
  copy: {
    en: {
      mapLabel: "Five steps through the legendary north",
      carouselLabel: "Welcome bonus steps",
      stepLabel: "STEP",
    },
    fr: {
      mapLabel: "Cinq étapes à travers le nord légendaire",
      carouselLabel: "Étapes du bonus de bienvenue",
      stepLabel: "ÉTAPE",
    },
  },
  steps: [
    {
      id: "first-deposit",
      image: "/images/rewards/step-1-cabin.png",
      position: {
        desktop: { x: "14.5%", y: "30%" },
        mobile: { x: "12.6%", y: "32.3%" },
      },
      copy: {
        en: {
          title: "FIRST DEPOSIT",
          description:
            "Start your journey with a deposit and get an instant bonus to boost your game.",
          rewards: ["100% up to 500 CAD", "50 Free Spins", "Wager x35", "7 Days"],
        },
        fr: {
          title: "PREMIER DÉPÔT",
          description:
            "Commencez votre aventure avec un dépôt et obtenez un bonus instantané pour booster votre jeu.",
          rewards: ["100 % jusqu’à 500 CAD", "50 tours gratuits", "Mise x35", "7 jours"],
        },
      } satisfies Record<JourneyLocale, JourneyStepCopy>,
    },
    {
      id: "second-deposit",
      image: "/images/rewards/step-2-bear.png",
      position: {
        desktop: { x: "33.5%", y: "60%" },
        mobile: { x: "34.9%", y: "54%" },
      },
      copy: {
        en: {
          title: "SECOND DEPOSIT",
          description:
            "Continue your journey and unlock another reward on your second deposit.",
          rewards: ["75% up to 500 CAD", "75 Free Spins", "Wager x30", "7 Days"],
        },
        fr: {
          title: "DEUXIÈME DÉPÔT",
          description:
            "Poursuivez votre aventure et débloquez une autre récompense lors de votre deuxième dépôt.",
          rewards: ["75 % jusqu’à 500 CAD", "75 tours gratuits", "Mise x30", "7 jours"],
        },
      } satisfies Record<JourneyLocale, JourneyStepCopy>,
    },
    {
      id: "third-deposit",
      image: "/images/rewards/step-3-mountain.png",
      position: {
        desktop: { x: "50%", y: "22%" },
        mobile: { x: "50%", y: "22.2%" },
      },
      copy: {
        en: {
          title: "THIRD DEPOSIT",
          description:
            "Reach the mountain pass and claim an even bigger bonus package.",
          rewards: ["100% up to 750 CAD", "100 Free Spins", "Wager x30", "7 Days"],
        },
        fr: {
          title: "TROISIÈME DÉPÔT",
          description:
            "Atteignez le col et réclamez un ensemble de bonus encore plus généreux.",
          rewards: ["100 % jusqu’à 750 CAD", "100 tours gratuits", "Mise x30", "7 jours"],
        },
      } satisfies Record<JourneyLocale, JourneyStepCopy>,
    },
    {
      id: "fourth-deposit",
      image: "/images/rewards/step-4-waterfall.png",
      position: {
        desktop: { x: "69%", y: "66%" },
        mobile: { x: "64%", y: "59%" },
      },
      copy: {
        en: {
          title: "FOURTH DEPOSIT",
          description:
            "Cross the northern falls and collect your next set of rewards.",
          rewards: ["125% up to 1,000 CAD", "125 Free Spins", "Wager x25", "7 Days"],
        },
        fr: {
          title: "QUATRIÈME DÉPÔT",
          description:
            "Traversez les chutes nordiques et récupérez votre prochaine série de récompenses.",
          rewards: ["125 % jusqu’à 1 000 CAD", "125 tours gratuits", "Mise x25", "7 jours"],
        },
      } satisfies Record<JourneyLocale, JourneyStepCopy>,
    },
    {
      id: "final-treasure",
      image: "/images/rewards/step-5-treasure.png",
      position: {
        desktop: { x: "91.5%", y: "35%" },
        mobile: { x: "89.9%", y: "37.7%" },
      },
      copy: {
        en: {
          title: "FINAL TREASURE",
          description:
            "Complete the journey and open the legendary final treasure.",
          rewards: ["150% up to 1,500 CAD", "150 Free Spins", "Wager x25", "7 Days"],
        },
        fr: {
          title: "TRÉSOR FINAL",
          description:
            "Terminez l’aventure et ouvrez le légendaire trésor final.",
          rewards: ["150 % jusqu’à 1 500 CAD", "150 tours gratuits", "Mise x25", "7 jours"],
        },
      } satisfies Record<JourneyLocale, JourneyStepCopy>,
    },
  ],
} as const;
