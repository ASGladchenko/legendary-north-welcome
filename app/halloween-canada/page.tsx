import type { Metadata } from "next";

import { SpiderField } from "../components/spider-field";

import "./halloween-canada.css";

import {
  HalloweenCanadaBanner,
  type HalloweenLocale,
} from "./halloween-canada-banner";
import {
  HalloweenSlider,
  type HalloweenSlide,
} from "./halloween-slider";

type HalloweenCanadaPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

const getLocale = (lang: string | string[] | undefined): HalloweenLocale =>
  lang === "fr" ? "fr" : "en";

const cards = [
  { id: "witch", accent: "#c97ae4", title: { en: "Witch", fr: "Sorcière" } },
  {
    id: "pumpkin",
    accent: "#ff9a3d",
    title: { en: "Pumpkin curse", fr: "Malédiction de la citrouille" },
  },
  { id: "wolf", accent: "#ff7a2f", title: { en: "Werewolf", fr: "Loup-garou" } },
  { id: "wraith", accent: "#83bdfa", title: { en: "Wraith", fr: "Spectre" } },
  {
    id: "plague",
    accent: "#b588eb",
    title: { en: "Plague doctor", fr: "Médecin de peste" },
  },
] as const;

const getCards = (locale: HalloweenLocale): HalloweenSlide[] =>
  cards.map((card) => ({
    id: card.id,
    accent: card.accent,
    title: card.title[locale],
    image: `/images/halloween-canada/cards/${card.id}.webp`,
    href: "/casino",
  }));

export async function generateMetadata({
  searchParams,
}: HalloweenCanadaPageProps): Promise<Metadata> {
  const locale = getLocale((await searchParams).lang);
  return locale === "fr"
    ? {
        title: "Halloween au Canada | 1MLNBET",
        description: "Découvrez nos sélections de machines à sous d’Halloween.",
      }
    : {
        title: "Halloween in Canada | 1MLNBET",
        description: "Discover our wicked Halloween slot picks.",
      };
}

export default async function HalloweenCanadaPage({
  searchParams,
}: HalloweenCanadaPageProps) {
  const locale = getLocale((await searchParams).lang);

  return (
    <SpiderField
      className="canada-spider-field"
      seed="halloween-canada"
      toggleLabel={locale === "fr" ? "Araignées" : "Spiders"}
    >
      <main
        className="canada-page"
        lang={locale === "fr" ? "fr-CA" : "en-CA"}
      >
        <HalloweenCanadaBanner locale={locale} />
        <HalloweenSlider
          items={getCards(locale)}
          labels={
            locale === "fr"
              ? {
                  carousel: "Jeux d’Halloween",
                  previous: "Jeu précédent",
                  next: "Jeu suivant",
                  position: "Position dans le carrousel",
                  goTo: "Afficher",
                  cube: "Faire tourner le cube citrouille",
                  cubeTap: "Touche-moi",
                  cubeResult: "Le cube a choisi",
                  cubePlay: "Jouer",
                  cubeClose: "Fermer",
                }
              : {
                  carousel: "Halloween games",
                  previous: "Previous game",
                  next: "Next game",
                  position: "Carousel position",
                  goTo: "Show",
                  cube: "Spin the pumpkin cube",
                  cubeTap: "Tap me",
                  cubeResult: "The cube chose",
                  cubePlay: "Play game",
                  cubeClose: "Close",
                }
          }
        />
      </main>
    </SpiderField>
  );
}
