import type { StaticImageData } from "next/image";

import backgroundLandscape from "../../public/images/fortune-wheel-brazil/bg-desktop.webp";
import backgroundPortrait from "../../public/images/fortune-wheel-brazil/bg-mob.webp";
import button from "../../public/images/fortune-wheel-brazil/spin-button.webp";
import disk from "../../public/images/fortune-wheel-brazil/wheel-disk.webp";
import frame from "../../public/images/fortune-wheel-brazil/wheel-frame.webp";

export type FortuneWheelConfig = {
  id: string;
  locale: string;
  prizeUrl: string;
  rewards: readonly { value: string; label: string }[];
  winningRewardIndex: number;
  assets: {
    backgroundLandscape: StaticImageData;
    backgroundPortrait: StaticImageData;
    backgroundPreviewLandscape: string;
    backgroundPreviewPortrait: string;
    button: StaticImageData;
    disk: StaticImageData;
    frame: StaticImageData;
    pointer?: StaticImageData;
  };
  copy: {
    action: string;
    spinning: string;
    won: string;
    wonLabel: string;
    claim: string;
    redirecting: string;
    loading: string;
    wheelLabel: string;
  };
};

export const brazilFortuneWheelConfig = {
  id: "brazil",
  locale: "pt-BR",
  prizeUrl: "https://1mlnbet.com/pt/registration/7",
  rewards: [
    { value: "100% +", label: "100 FS" },
    { value: "BONUS", label: "GAME" },
    { value: "75%", label: "" },
    { value: "50% +", label: "50 FS" },
    { value: "100", label: "FS" },
    { value: "50%", label: "" },
  ],
  winningRewardIndex: 0,
  assets: {
    backgroundLandscape,
    backgroundPortrait,
    backgroundPreviewLandscape: "/images/fortune-wheel-brazil/previews/bg-desktop.webp",
    backgroundPreviewPortrait: "/images/fortune-wheel-brazil/previews/bg-mob.webp",
    button,
    disk,
    frame,
  },
  copy: {
    action: "Girar a roda",
    spinning: "Encontrando sua sorte...",
    won: "PARABÉNS!",
    wonLabel: "VOCÊ GANHOU",
    claim: "RECEBER BÔNUS",
    redirecting: "RESGATE EM",
    loading: "Carregando a roda da fortuna",
    wheelLabel: "Roda da fortuna com seis prêmios",
  },
} as const satisfies FortuneWheelConfig;
