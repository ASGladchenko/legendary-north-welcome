import type { StaticImageData } from "next/image";

import backgroundLandscape from "../../public/images/fortune-wheel-brazil/bg-desktop.webp";
import backgroundPortrait from "../../public/images/fortune-wheel-brazil/bg-mob.webp";
import button from "../../public/images/fortune-wheel-brazil/spin-button.webp";
import disk from "../../public/images/fortune-wheel-brazil/wheel-disk.webp";
import frame from "../../public/images/fortune-wheel-brazil/wheel-frame.webp";

export type FortuneWheelConfig = {
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
    claim: string;
    loading: string;
    redirecting: string;
    spinning: string;
    wheelLabel: string;
    won: string;
    wonLabel: string;
};
  id: string;
  locale: string;
  modalReward?: {
 value: string; label: string 

};
  prizeUrl: string;
  rewards: readonly {
 value: string; label: string 

}[];
  winningRewardIndex: number;
};
export type BrazilFortuneWheelLocale = "en" | "pt-BR";

export const brazilFortuneWheelConfig = {
  id: "brazil",
  locale: "pt-BR",
  prizeUrl: "https://1mlnbet.com/pt/registration/7",
  rewards: [
    { value: "500% +", label: "235 FS" },
    { value: "150% +", label: "75 FS" },
    { value: "250% +", label: "150 FS" },
    { value: "100% +", label: "50 FS" },
    { value: "300% +", label: "200 FS" },
    { value: "200% +", label: "100 FS" },
  ],
  winningRewardIndex: 0,
  modalReward: { value: "ATÉ 500%", label: "& 235 FS" },
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
    won: "Você ganhou",
    wonLabel: "Pacote de boas-vindas de slots",
    claim: "RECEBER BÔNUS",
    redirecting: "RESGATE EM",
    loading: "Carregando a roda da fortuna",
    wheelLabel: "Roda da fortuna com seis prêmios",
  },
} as const satisfies FortuneWheelConfig;

export const brazilFortuneWheelEnglishConfig = {
  ...brazilFortuneWheelConfig,
  locale: "en",
  prizeUrl: "https://1mlnbet.com/en/registration/7",
  modalReward: { value: "UP TO 500%", label: "& 235 FS" },
  copy: {
    action: "Spin the wheel",
    spinning: "Finding your fortune...",
    won: "You won",
    wonLabel: "Slots welcome package",
    claim: "GET BONUS",
    redirecting: "CLAIM IN",
    loading: "Loading fortune wheel",
    wheelLabel: "Fortune wheel with six prizes",
  },
} as const satisfies FortuneWheelConfig;

export function getBrazilFortuneWheelConfig(
  locale: BrazilFortuneWheelLocale,
): FortuneWheelConfig {
  return locale === "en"
    ? brazilFortuneWheelEnglishConfig
    : brazilFortuneWheelConfig;
}
