export type WelcomeBrazilVariant = "instant" | "sport" | "standard" | "vip";
export type WelcomeBrazilLocale = "en" | "pt-BR";

export const welcomeBrazilConfig = {
  locale: "pt-BR",
  cta: {
    action: "COMEÇAR AGORA",
    promoUrl: "https://1mlnbet.com/pt/promo",
    signupUrl: "https://1mlnbet.com/pt/registration/7",
    instantSignupUrl: "https://1mlnbet.com/pt/registration/11",
    sportSignupUrl: "https://1mlnbet.com/pt/registration/1",
  },
  modal: {
    image: {
      src: "/images/welcome-brazil/modal-girl.webp",
      width: 1040,
      height: 1512,
      blurDataURL: "data:image/webp;base64,UklGRhABAABXRUJQVlA4WAoAAAAQAAAADwAAFgAAQUxQSHMAAAARN6CgbRs2VDJnfxER4Gfr4aiRJEfKGQRr/+4OgAXg/2sRbBd/Dt3SUYjo/wRA8fpWAL3pDBSz9EvQmbRneEpSA7M7UxzukTpzv3yR3+tnoHaOzv89o+Zibs/F4h6Ji0XFImnPMEtSQ3G4MxeLJvmWOagBAFZQOCB2AAAAMAQAnQEqEAAXAD9FirtUsCkmIzAIAgAoiWgAnTKAAmzIXRQgVf95YlcAAP7L97xiJ6G0PnJL2chFA0pXsZiA20w9Lfixq1MpT4OfUVTY5x+fEXZwKpimqLmJorQHmPIwMD40awRqXMhVezVfbo9owvS1HgAAAA==",
    },
  },
  hero: {
    label: "Oferta de boas-vindas do Brasil",
    sportBackground: "/images/welcome-brazil/sport-bg-desktop.avif",
    vipWelcome: {
      eyebrow: "OFERTA DE BOAS-VINDAS VIP",
      titleLead: "ATÉ 750%",
      titleAccent: "450 RODADAS GRÁTIS",
      subtitle: "5 ETAPAS VIP — RECOMPENSAS AINDA MAIORES!",
      action: "COMEÇAR AGORA",
    },
    instantWelcome: {
      eyebrow: "OFERTA DE BOAS-VINDAS PARA JOGOS DE CRASH",
      titleLead: "ATÉ 400% +",
      titleAccent: "70 GG + 45 VG NO AVIATOR",
      subtitle: "",
      action: "COMEÇAR AGORA",
    },
    sportWelcome: {
      eyebrow: "OFERTA DE BOAS-VINDAS",
      titleLead: "ATÉ 175%",
      titleAccent: "+ APOSTAS GRÁTIS + 25 RODADAS GRÁTIS",
      subtitle: "",
      action: "COMEÇAR AGORA",
    },
    vipBadge: "/images/hero/bonus-game.webp",
    slides: [
      {
        id: "welcome-offer",
        src: "/images/welcome-brazil/banner-person-2.avif",
        sportSrc: "/images/welcome-brazil/sport-banner-person-1.avif",
        alt: "Mulher celebrando no Rio de Janeiro",
        sportAlt: "Torcedora do Brasil comemorando",
        characterSide: "right",
        textSide: "left",
        eyebrow: "OFERTA DE BOAS-VINDAS",
        titleLead: "ATÉ 500%",
        titleAccent: "235 RODADAS GRÁTIS",
        subtitle: "4 ETAPAS DE BÔNUS — RECOMPENSAS AINDA MAIORES!",
        action: "COMEÇAR AGORA",
      },
      {
        id: "journey",
        src: "/images/welcome-brazil/banner-person-1.avif",
        sportSrc: "/images/welcome-brazil/sport-banner-person-2.avif",
        alt: "Homem brindando com um coquetel",
        sportAlt: "Torcedora do Brasil com a bandeira nacional",
        characterSide: "left",
        textSide: "right",
        eyebrow: "",
        titleLead: "SUA JORNADA",
        titleAccent: "COMEÇA NA ",
        titleLogo: "1MLN",
        titleBrand: "BET",
        subtitle: "",
        action: "COMEÇAR AGORA",
      },
      {
        id: "good-vibes",
        src: "/images/welcome-brazil/banner-person-3.avif",
        sportSrc: "/images/welcome-brazil/sport-banner-person-3.avif",
        alt: "Mulher com um coquetel tropical",
        sportAlt: "Torcedor do Brasil comemorando",
        characterSide: "right",
        textSide: "left",
        eyebrow: "",
        titleLead: "BOAS VIBRAÇÕES",
        titleAccent: "VITÓRIAS AINDA MAIORES",
        subtitle: "",
        action: "COMEÇAR AGORA",
      },
    ],
  },
  labels: {
    map: "Etapas do bônus de boas-vindas",
    rewards: "Recompensas de boas-vindas",
    step: "ETAPA",
    depositBonus: "Bônus de depósito",
    freeBet: "Aposta grátis",
    freeSpins: "Rodadas grátis",
    minimumDeposit: "Depósito mín.",
    wager: "Rollover",
    cashback: "Cashback",
    bonusGame: "Bonus Game",
    chooseOne: "ESCOLHA 1 BÔNUS",
    chooseOneCombo: "ESCOLHA 1 COMBO",
    combo: "COMBO",
    triple: "COMBO TRIPLO",
    previous: "Etapa anterior",
    next: "Próxima etapa",
    instantOnly: "Somente Instant — sem slots",
    instantOptions: "Opções de bônus Instant",
    or: "OU",
  },
  steps: [
    {
      id: "first-deposit",
      bonusChoice: false,
      shortTitle: "PRIMEIRO DEPÓSITO",
      title: "PRIMEIRO DEPÓSITO",
      description:
        "Deposite 50 BRL e receba um bônus de 135% até 1.800 BRL e 50 rodadas grátis.",
      image: "/images/welcome-brazil/step-1.avif",
      depositBonus: "135% até 1.800 BRL",
      freeSpins: "50 FS",
      minimumDeposit: "50 BRL",
      depositWager: "×35",
      freeSpinsWager: "×30",
      cashback: "—",
    },
    {
      id: "second-deposit",
      bonusChoice: false,
      shortTitle: "SEGUNDO DEPÓSITO",
      title: "SEGUNDO DEPÓSITO",
      description:
        "Deposite 80 BRL e receba um bônus de 115% até 2.000 BRL e 55 rodadas grátis.",
      image: "/images/welcome-brazil/step-2.avif",
      depositBonus: "115% até 2.000 BRL",
      freeSpins: "55 FS",
      minimumDeposit: "80 BRL",
      depositWager: "×35",
      freeSpinsWager: "×30",
      cashback: "—",
    },
    {
      id: "third-deposit",
      bonusChoice: false,
      shortTitle: "TERCEIRO DEPÓSITO",
      title: "TERCEIRO DEPÓSITO",
      description:
        "Deposite 80 BRL e receba um bônus de 100% até 2.200 BRL e 60 rodadas grátis.",
      image: "/images/welcome-brazil/step-3.avif",
      depositBonus: "100% até 2.200 BRL",
      freeSpins: "60 FS",
      minimumDeposit: "80 BRL",
      depositWager: "×35",
      freeSpinsWager: "×30",
      cashback: "—",
    },
    {
      id: "fourth-deposit",
      bonusChoice: false,
      shortTitle: "QUARTO DEPÓSITO",
      title: "QUARTO DEPÓSITO",
      description:
        "Deposite 100 BRL e receba um bônus de 150% até 1.800 BRL e 70 rodadas grátis.",
      image: "/images/welcome-brazil/step-5.avif",
      mapImageIndex: 5,
      depositBonus: "150% até 1.800 BRL",
      freeSpins: "70 FS",
      minimumDeposit: "100 BRL",
      depositWager: "×35",
      freeSpinsWager: "×30",
      cashback: "—",
    },
  ],
} as const;

export const welcomeBrazilVipSteps = [
  {
    id: "vip-first-deposit",
    bonusChoice: false,
    shortTitle: "PRIMEIRO DEPÓSITO",
    title: "PRIMEIRO DEPÓSITO VIP",
    description:
      "Deposite 200 BRL ou mais para receber um bônus de 100% até 1.500 BRL e até 100 rodadas grátis.",
    image: "/images/welcome-brazil/step-1.avif",
    depositBonus: "100% até 1.500 BRL",
    freeSpins: "Até 100 FS",
    minimumDeposit: "200 BRL",
    depositWager: "×35",
    freeSpinsWager: "×35",
    cashback: "—",
  },
  {
    id: "vip-second-deposit",
    bonusChoice: false,
    shortTitle: "SEGUNDO DEPÓSITO",
    title: "SEGUNDO DEPÓSITO VIP",
    description:
      "Receba um bônus de 150% até 2.000 BRL e desbloqueie um Bonus Game Sweet Bonanza Super Scatter.",
    image: "/images/welcome-brazil/step-2.avif",
    depositBonus: "150% até 2.000 BRL",
    freeSpins: "—",
    minimumDeposit: "200 BRL",
    depositWager: "×35",
    freeSpinsWager: "×35",
    cashback: "—",
    bonusGame: {
      image: "/images/rewards/bonus-games/sweet-bonanza-super-scatter.webp",
      name: "Sweet Bonanza",
      wager: null,
    },
  },
  {
    id: "vip-third-deposit",
    bonusChoice: true,
    shortTitle: "TERCEIRO DEPÓSITO",
    title: "TERCEIRO DEPÓSITO VIP",
    description:
      "Escolha um bônus de 150% até 1.200 BRL, 150 rodadas grátis ou um Bonus Game Sugar Rush 1000.",
    image: "/images/welcome-brazil/step-3.avif",
    depositBonus: "150% até 1.200 BRL",
    freeSpins: "150 FS",
    minimumDeposit: "200 BRL",
    depositWager: "×35",
    freeSpinsWager: "×25",
    cashback: "—",
    bonusGame: {
      image: "/images/rewards/bonus-games/sugar-rush-1000.webp",
      name: "Sugar Rush 1000",
      wager: null,
    },
  },
  {
    id: "vip-fourth-deposit",
    bonusChoice: false,
    shortTitle: "QUARTO DEPÓSITO",
    title: "QUARTO DEPÓSITO VIP",
    description:
      "Receba um bônus de 200% até 1.200 BRL, 50 rodadas grátis e um Bonus Game Big Bass Splash.",
    image: "/images/welcome-brazil/step-4.avif",
    depositBonus: "200% até 1.200 BRL",
    freeSpins: "50 FS",
    minimumDeposit: "200 BRL",
    depositWager: "×35",
    freeSpinsWager: "×35",
    cashback: "—",
    bonusGame: {
      image: "/images/rewards/bonus-games/big-bass-splash.webp",
      name: "Big Bass Splash",
      wager: "×35",
    },
  },
  {
    id: "vip-fifth-deposit",
    bonusChoice: true,
    shortTitle: "QUINTO DEPÓSITO",
    title: "QUINTO DEPÓSITO VIP",
    description:
      "Escolha um bônus de 150% até 1.000 BRL ou 150 rodadas grátis e receba 8% de cashback por 3 dias.",
    image: "/images/welcome-brazil/step-5.avif",
    depositBonus: "150% até 1.000 BRL",
    freeSpins: "150 FS",
    minimumDeposit: "200 BRL",
    depositWager: "×35",
    freeSpinsWager: "×25",
    cashback: "8% por 3 dias",
  },
] as const;

const aviatorImage = "/images/welcome-brazil/rewards/aviator.webp";
const bigBassBonanzaImage =
  "/images/welcome-brazil/rewards/big-bass-bonanza.webp";

export const welcomeBrazilInstantSteps = [
  {
    id: "instant-first-deposit",
    bonusChoice: false,
    shortTitle: "PRIMEIRO DEPÓSITO",
    title: "PRIMEIRO DEPÓSITO",
    description:
      "Deposite 30 BRL e receba 75% até 1.500 BRL + 10 FF no Aviator.",
    image: "/images/welcome-brazil/step-1.avif",
    minimumDeposit: "30 BRL",
    depositWager: "×25",
    cashback: "—",
    instantOptions: [
      {
        id: "aviator-10",
        image: aviatorImage,
        depositBonus: "75% até 1.500 BRL",
        reward: "10 FF",
        rewardLabel: "Voos grátis",
        gameName: "Aviator",
      },
    ],
  },
  {
    id: "instant-second-deposit",
    bonusChoice: false,
    shortTitle: "SEGUNDO DEPÓSITO",
    title: "SEGUNDO DEPÓSITO",
    description:
      "Deposite 50 BRL e receba 100% até 1.000 BRL + 15 FF no Aviator.",
    image: "/images/welcome-brazil/step-2.avif",
    minimumDeposit: "50 BRL",
    depositWager: "×25",
    cashback: "—",
    instantOptions: [
      {
        id: "aviator-15",
        image: aviatorImage,
        depositBonus: "100% até 1.000 BRL",
        reward: "15 FF",
        rewardLabel: "Voos grátis",
        gameName: "Aviator",
      },
    ],
  },
  {
    id: "instant-third-deposit",
    bonusChoice: false,
    shortTitle: "TERCEIRO DEPÓSITO",
    title: "TERCEIRO DEPÓSITO",
    description:
      "Deposite 70 BRL e receba 125% até 750 BRL + 20 FF no Aviator.",
    image: "/images/welcome-brazil/step-3.avif",
    minimumDeposit: "70 BRL",
    depositWager: "×25",
    cashback: "—",
    instantOptions: [
      {
        id: "aviator-20",
        image: aviatorImage,
        depositBonus: "125% até 750 BRL",
        reward: "20 FF",
        rewardLabel: "Voos grátis",
        gameName: "Aviator",
      },
    ],
  },
  {
    id: "instant-fourth-deposit",
    bonusChoice: true,
    shortTitle: "QUARTO DEPÓSITO",
    title: "QUARTO DEPÓSITO",
    description:
      "Deposite 70 BRL e escolha uma das duas ofertas Instant.",
    image: "/images/welcome-brazil/step-5.avif",
    mapImageIndex: 5,
    minimumDeposit: "70 BRL",
    depositWager: "×25",
    cashback: "—",
    instantOptions: [
      {
        id: "big-bass-bonanza-70",
        image: bigBassBonanzaImage,
        depositBonus: "100% até 1.800 BRL",
        reward: "70 FS",
        rewardLabel: "Rodadas grátis",
        gameName: "Big Bass Bonanza",
        rewardWager: "×35",
      },
      {
        id: "aviator-30",
        image: aviatorImage,
        depositBonus: "50% até 1.800 BRL",
        reward: "30 FF",
        rewardLabel: "Voos grátis",
        gameName: "Aviator",
      },
    ],
  },
] as const;

export const welcomeBrazilSportSteps = [
  {
    id: "sport-first-deposit",
    bonusChoice: false,
    shortTitle: "PRIMEIRO DEPÓSITO",
    title: "PRIMEIRO DEPÓSITO",
    description:
      "Deposite 5 BRL e receba um bônus de 100% até 700 BRL, uma aposta grátis de 10 BRL e 25 rodadas grátis.",
    image: "/images/welcome-brazil/step-1.avif",
    depositBonus: "100% até 700 BRL",
    freeBet: "10 BRL",
    freeSpins: "25 FS",
    minimumDeposit: "5 BRL",
    depositWager: "—",
    freeSpinsWager: "—",
    cashback: "—",
  },
  {
    id: "sport-second-deposit",
    bonusChoice: false,
    shortTitle: "SEGUNDO DEPÓSITO",
    title: "SEGUNDO DEPÓSITO",
    description:
      "Deposite 5 BRL e receba um bônus de 75% até 1.000 BRL.",
    image: "/images/welcome-brazil/step-2.avif",
    depositBonus: "75% até 1.000 BRL",
    freeBet: "—",
    freeSpins: "—",
    minimumDeposit: "5 BRL",
    depositWager: "—",
    freeSpinsWager: "—",
    cashback: "—",
  },
  {
    id: "sport-third-deposit",
    bonusChoice: false,
    shortTitle: "TERCEIRO DEPÓSITO",
    title: "TERCEIRO DEPÓSITO",
    description:
      "Deposite 5 BRL e receba uma Free Bet de +30% do valor do depósito.",
    image: "/images/welcome-brazil/step-3.avif",
    depositBonus: "—",
    freeBet: "+30% FREE BET",
    freeBetDescription: "do valor do depósito",
    freeSpins: "—",
    minimumDeposit: "5 BRL",
    depositWager: "—",
    freeSpinsWager: "—",
    cashback: "—",
  },
] as const;

export const welcomeBrazilEnglishConfig = {
  ...welcomeBrazilConfig,
  locale: "en",
  cta: {
    action: "START NOW",
    promoUrl: "https://1mlnbet.com/en/promo",
    signupUrl: "https://1mlnbet.com/en/registration/7",
    instantSignupUrl: "https://1mlnbet.com/en/registration/11",
    sportSignupUrl: "https://1mlnbet.com/en/registration/1",
  },
  hero: {
    ...welcomeBrazilConfig.hero,
    label: "Brazil welcome offer",
    vipWelcome: {
      eyebrow: "VIP WELCOME OFFER",
      titleLead: "UP TO 750%",
      titleAccent: "450 FREE SPINS",
      subtitle: "5 VIP STAGES — EVEN BIGGER REWARDS!",
      action: "START NOW",
    },
    instantWelcome: {
      eyebrow: "CRASH GAMES WELCOME OFFER",
      titleLead: "UP TO 400% +",
      titleAccent: "70 FS + 45 FF IN AVIATOR",
      subtitle: "",
      action: "START NOW",
    },
    sportWelcome: {
      eyebrow: "WELCOME OFFER",
      titleLead: "UP TO 175%",
      titleAccent: "+ FREE BETS + 25 FREE SPINS",
      subtitle: "",
      action: "START NOW",
    },
    slides: [
      {
        ...welcomeBrazilConfig.hero.slides[0],
        alt: "Woman celebrating in Rio de Janeiro",
        sportAlt: "Brazil supporter celebrating",
        eyebrow: "WELCOME OFFER",
        titleLead: "UP TO 500%",
        titleAccent: "235 FREE SPINS",
        subtitle: "4 BONUS STAGES — EVEN BIGGER REWARDS!",
        action: "START NOW",
      },
      {
        ...welcomeBrazilConfig.hero.slides[1],
        alt: "Man raising a cocktail",
        sportAlt: "Brazil supporter holding the national flag",
        titleLead: "YOUR JOURNEY",
        titleAccent: "STARTS AT ",
        action: "START NOW",
      },
      {
        ...welcomeBrazilConfig.hero.slides[2],
        alt: "Woman holding a tropical cocktail",
        sportAlt: "Brazil supporter celebrating",
        titleLead: "GOOD VIBES",
        titleAccent: "EVEN BIGGER WINS",
        action: "START NOW",
      },
    ],
  },
  labels: {
    map: "Welcome bonus stages",
    rewards: "Welcome rewards",
    step: "STAGE",
    depositBonus: "Deposit bonus",
    freeBet: "Free Bet",
    freeSpins: "Free spins",
    minimumDeposit: "Min. deposit",
    wager: "Wager",
    cashback: "Cashback",
    bonusGame: "Bonus Game",
    chooseOne: "CHOOSE 1 BONUS",
    chooseOneCombo: "CHOOSE 1 COMBO",
    combo: "COMBO",
    triple: "TRIPLE COMBO",
    previous: "Previous stage",
    next: "Next stage",
    instantOnly: "Instant only — no slots",
    instantOptions: "Instant bonus options",
    or: "OR",
  },
  steps: [
    {
      ...welcomeBrazilConfig.steps[0],
      shortTitle: "FIRST DEPOSIT",
      title: "FIRST DEPOSIT",
      description:
        "Deposit 50 BRL and receive a 135% bonus up to 1,800 BRL and 50 free spins.",
    },
    {
      ...welcomeBrazilConfig.steps[1],
      shortTitle: "SECOND DEPOSIT",
      title: "SECOND DEPOSIT",
      description:
        "Deposit 80 BRL and receive a 115% bonus up to 2,000 BRL and 55 free spins.",
    },
    {
      ...welcomeBrazilConfig.steps[2],
      shortTitle: "THIRD DEPOSIT",
      title: "THIRD DEPOSIT",
      description:
        "Deposit 80 BRL and receive a 100% bonus up to 2,200 BRL and 60 free spins.",
    },
    {
      ...welcomeBrazilConfig.steps[3],
      shortTitle: "FOURTH DEPOSIT",
      title: "FOURTH DEPOSIT",
      description:
        "Deposit 100 BRL and receive a 150% bonus up to 1,800 BRL and 70 free spins.",
    },
  ],
} as const;

export const welcomeBrazilEnglishVipSteps = [
  {
    ...welcomeBrazilVipSteps[0],
    shortTitle: "FIRST DEPOSIT",
    title: "FIRST VIP DEPOSIT",
    description:
      "Deposit 200 BRL or more to receive a 100% bonus up to 1,500 BRL and up to 100 free spins.",
    freeSpins: "Up to 100 FS",
  },
  {
    ...welcomeBrazilVipSteps[1],
    shortTitle: "SECOND DEPOSIT",
    title: "SECOND VIP DEPOSIT",
    description:
      "Receive a 150% bonus up to 2,000 BRL and unlock a Sweet Bonanza Super Scatter Bonus Game.",
  },
  {
    ...welcomeBrazilVipSteps[2],
    shortTitle: "THIRD DEPOSIT",
    title: "THIRD VIP DEPOSIT",
    description:
      "Choose a 150% bonus up to 1,200 BRL, 150 free spins or a Sugar Rush 1000 Bonus Game.",
  },
  {
    ...welcomeBrazilVipSteps[3],
    shortTitle: "FOURTH DEPOSIT",
    title: "FOURTH VIP DEPOSIT",
    description:
      "Receive a 200% bonus up to 1,200 BRL, 50 free spins and a Big Bass Splash Bonus Game.",
  },
  {
    ...welcomeBrazilVipSteps[4],
    shortTitle: "FIFTH DEPOSIT",
    title: "FIFTH VIP DEPOSIT",
    description:
      "Choose a 150% bonus up to 1,000 BRL or 150 free spins and receive 8% cashback for 3 days.",
    cashback: "8% for 3 days",
  },
] as const;

export const welcomeBrazilEnglishInstantSteps = welcomeBrazilInstantSteps.map(
  (step, index) => ({
    ...step,
    shortTitle: [
      "FIRST DEPOSIT",
      "SECOND DEPOSIT",
      "THIRD DEPOSIT",
      "FOURTH DEPOSIT",
    ][index],
    title: [
      "FIRST DEPOSIT",
      "SECOND DEPOSIT",
      "THIRD DEPOSIT",
      "FOURTH DEPOSIT",
    ][index],
    description: [
      "Deposit 30 BRL and receive 75% up to 1,500 BRL + 10 FF in Aviator.",
      "Deposit 50 BRL and receive 100% up to 1,000 BRL + 15 FF in Aviator.",
      "Deposit 70 BRL and receive 125% up to 750 BRL + 20 FF in Aviator.",
      "Deposit 70 BRL and choose one of two Instant offers.",
    ][index],
    instantOptions: step.instantOptions.map((option) => ({
      ...option,
      depositBonus: option.depositBonus.replace("até", "up to"),
      rewardLabel: option.reward.endsWith("FF")
        ? "Free flights"
        : "Free spins",
    })),
  }),
);

export const welcomeBrazilEnglishSportSteps = welcomeBrazilSportSteps.map(
  (step, index) => ({
    ...step,
    shortTitle: ["FIRST DEPOSIT", "SECOND DEPOSIT", "THIRD DEPOSIT"][index],
    title: ["FIRST DEPOSIT", "SECOND DEPOSIT", "THIRD DEPOSIT"][index],
    description: [
      "Deposit 5 BRL and receive a 100% bonus up to 700 BRL, a 10 BRL Free Bet and 25 Free Spins.",
      "Deposit 5 BRL and receive a 75% bonus up to 1,000 BRL.",
      "Deposit 5 BRL and receive a Free Bet worth +30% of the deposit.",
    ][index],
    depositBonus: ["100% up to 700 BRL", "75% up to 1,000 BRL", "—"][index],
    freeBet: ["10 BRL", "—", "+30% FREE BET"][index],
    freeBetDescription: [undefined, undefined, "of the deposit"][index],
  }),
);

export function getWelcomeBrazilConfig(locale: WelcomeBrazilLocale) {
  return locale === "en" ? welcomeBrazilEnglishConfig : welcomeBrazilConfig;
}

export function getWelcomeBrazilSteps(
  locale: WelcomeBrazilLocale,
  variant: WelcomeBrazilVariant,
) {
  if (locale === "en") {
    if (variant === "instant") return welcomeBrazilEnglishInstantSteps;
    if (variant === "sport") return welcomeBrazilEnglishSportSteps;
    return variant === "vip" ? welcomeBrazilEnglishVipSteps : welcomeBrazilEnglishConfig.steps;
  }

  if (variant === "instant") return welcomeBrazilInstantSteps;
  if (variant === "sport") return welcomeBrazilSportSteps;
  return variant === "vip" ? welcomeBrazilVipSteps : welcomeBrazilConfig.steps;
}

