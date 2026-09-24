export type JourneyLocale = "en" | "fr";

type BonusDetails = {
  cashback: string;
  depositBonus: string;
  depositWager: string;
  freeSpins: string;
  freeSpinsWager: string;
  minimumDeposit: string;
};

type JourneyStepCopy = {
  bonus: BonusDetails;
  description: string;
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
  rewardIcons: {
    cashback: "/icons/rewards/cashback.png",
    depositBonus: "/icons/rewards/deposit-bonus.png",
    freeSpins: "/icons/rewards/free-spins.png",
    minimumDeposit: "/icons/rewards/minimum-deposit.png",
    wager: "/icons/rewards/wagering-requirement.png",
  },
  copy: {
    en: {
      mapLabel: "Five steps through the legendary north",
      carouselLabel: "Welcome bonus steps",
      stepLabel: "STEP",
      choiceLabel: "CHOOSE 1 BONUS",
      orLabel: "OR",
      labels: {
        cashback: "Cashback",
        depositBonus: "Deposit Bonus",
        depositWager: "Bonus Wager",
        freeSpins: "Free Spins",
        freeSpinsWager: "FS Wager",
        minimumDeposit: "Min Deposit",
        wager: "Wager",
      },
    },
    fr: {
      mapLabel: "Cinq étapes à travers le nord légendaire",
      carouselLabel: "Étapes du bonus de bienvenue",
      stepLabel: "ÉTAPE",
      choiceLabel: "CHOISISSEZ 1 BONUS",
      orLabel: "OU",
      labels: {
        cashback: "Cashback",
        depositBonus: "Bonus dépôt",
        depositWager: "Mise bonus",
        freeSpins: "Tours gratuits",
        freeSpinsWager: "Mise FS",
        minimumDeposit: "Dépôt min.",
        wager: "Mise",
      },
    },
  },
  steps: [
    {
      id: "first-deposit",
      image: "/images/rewards/step-1-cabin.png",
      bonusChoice: false,
      position: {
        desktop: { x: "14.5%", y: "30%" },
        mobile: { x: "12.6%", y: "32.3%" },
      },
      copy: {
        en: {
          title: "FIRST DEPOSIT",
          description:
            "Start your journey with a deposit of 50 CAD to claim an instant bonus.<br />Deposit 200 CAD or more to unlock an enhanced welcome package with a surprise inside.",
          bonus: {
            minimumDeposit: "50 CAD",
            depositBonus: "100% up to 1,500 CAD",
            freeSpins: "Up to 100 FS",
            cashback: "—",
            depositWager: "×35",
            freeSpinsWager: "×35",
          },
        },
        fr: {
          title: "PREMIER DÉPÔT",
          description:
            "Commencez votre aventure avec un dépôt de 50 CAD pour obtenir un bonus instantané.<br />Déposez 200 CAD ou plus pour débloquer une offre de bienvenue améliorée avec une surprise à l’intérieur.",
          bonus: {
            minimumDeposit: "50 CAD",
            depositBonus: "100 % jusqu’à 1 500 CAD",
            freeSpins: "Jusqu’à 100 FS",
            cashback: "—",
            depositWager: "×35",
            freeSpinsWager: "×35",
          },
        },
      } satisfies Record<JourneyLocale, JourneyStepCopy>,
    },
    {
      id: "second-deposit",
      image: "/images/rewards/step-2-bear.png",
      bonusChoice: false,
      position: {
        desktop: { x: "33.5%", y: "60%" },
        mobile: { x: "34.9%", y: "54%" },
      },
      copy: {
        en: {
          title: "SECOND DEPOSIT",
          description: "Continue your journey and unlock another reward on your second deposit.",
          bonus: {
            minimumDeposit: "50 CAD",
            depositBonus: "120% up to 1,000 CAD",
            freeSpins: "Up to 150 FS",
            cashback: "—",
            depositWager: "×35",
            freeSpinsWager: "×35",
          },
        },
        fr: {
          title: "DEUXIÈME DÉPÔT",
          description: "Poursuivez votre aventure et débloquez une autre récompense lors de votre deuxième dépôt.",
          bonus: {
            minimumDeposit: "50 CAD",
            depositBonus: "120 % jusqu’à 1 000 CAD",
            freeSpins: "Jusqu’à 150 FS",
            cashback: "—",
            depositWager: "×35",
            freeSpinsWager: "×35",
          },
        },
      } satisfies Record<JourneyLocale, JourneyStepCopy>,
    },
    {
      id: "third-deposit",
      image: "/images/rewards/step-3-mountain.png",
      bonusChoice: true,
      position: {
        desktop: { x: "50%", y: "22%" },
        mobile: { x: "50%", y: "22.2%" },
      },
      copy: {
        en: {
          title: "THIRD DEPOSIT",
          description: "Reach the mountain pass and choose the reward that fits your journey.",
          bonus: {
            minimumDeposit: "50 CAD",
            depositBonus: "120% up to 1,000 CAD",
            freeSpins: "100 FS",
            cashback: "—",
            depositWager: "×35",
            freeSpinsWager: "×30",
          },
        },
        fr: {
          title: "TROISIÈME DÉPÔT",
          description: "Atteignez le col et choisissez la récompense qui correspond à votre aventure.",
          bonus: {
            minimumDeposit: "50 CAD",
            depositBonus: "120 % jusqu’à 1 000 CAD",
            freeSpins: "100 FS",
            cashback: "—",
            depositWager: "×35",
            freeSpinsWager: "×30",
          },
        },
      } satisfies Record<JourneyLocale, JourneyStepCopy>,
    },
    {
      id: "fourth-deposit",
      image: "/images/rewards/step-4-waterfall.png",
      bonusChoice: false,
      position: {
        desktop: { x: "69%", y: "66%" },
        mobile: { x: "64%", y: "59%" },
      },
      copy: {
        en: {
          title: "FOURTH DEPOSIT",
          description: "Cross the northern falls and collect your next set of rewards.",
          bonus: {
            minimumDeposit: "50 CAD",
            depositBonus: "150% up to 750 CAD",
            freeSpins: "75 FS",
            cashback: "—",
            depositWager: "×35",
            freeSpinsWager: "×35",
          },
        },
        fr: {
          title: "QUATRIÈME DÉPÔT",
          description: "Traversez les chutes nordiques et récupérez votre prochaine série de récompenses.",
          bonus: {
            minimumDeposit: "50 CAD",
            depositBonus: "150 % jusqu’à 750 CAD",
            freeSpins: "75 FS",
            cashback: "—",
            depositWager: "×35",
            freeSpinsWager: "×35",
          },
        },
      } satisfies Record<JourneyLocale, JourneyStepCopy>,
    },
    {
      id: "final-treasure",
      image: "/images/rewards/step-5-treasure.png",
      bonusChoice: true,
      position: {
        desktop: { x: "91.5%", y: "35%" },
        mobile: { x: "89.9%", y: "37.7%" },
      },
      copy: {
        en: {
          title: "FINAL TREASURE",
          description: "Complete the journey and choose the final reward that suits you best.",
          bonus: {
            minimumDeposit: "50 CAD",
            depositBonus: "100% up to 750 CAD",
            freeSpins: "75 FS",
            cashback: "5% for 3 days",
            depositWager: "×35",
            freeSpinsWager: "×25",
          },
        },
        fr: {
          title: "TRÉSOR FINAL",
          description: "Terminez l’aventure et choisissez la récompense finale qui vous convient le mieux.",
          bonus: {
            minimumDeposit: "50 CAD",
            depositBonus: "100 % jusqu’à 750 CAD",
            freeSpins: "75 FS",
            cashback: "5 % pendant 3 jours",
            depositWager: "×35",
            freeSpinsWager: "×25",
          },
        },
      } satisfies Record<JourneyLocale, JourneyStepCopy>,
    },
  ],
} as const;
