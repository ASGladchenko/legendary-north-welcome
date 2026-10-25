import type { Metadata } from "next";

import { SpiderField } from "../components/spider-field";
import { HalloweenCanadaBanner, type HalloweenLocale } from "./halloween-canada-banner";
import { type HalloweenSlide, HalloweenSlider } from "./halloween-slider";
import { HalloweenCasperMascot, HalloweenTournamentMascot } from "./halloween-tournament-mascot";

import "./halloween-canada.css";

type HalloweenCanadaPageProps = {
  searchParams: Promise<{
    casperD?: string | string[];
    casperF?: string | string[];
    delay?: string | string[];
    frequency?: string | string[];
    lang?: string | string[];
}>;
};

const getLocale = (lang: string | string[] | undefined): HalloweenLocale =>
  lang === "fr" ? "fr" : "en";

const getIntegerParam = (
  value: string | string[] | undefined,
  fallback: number,
  maximum: number,
) =>
  typeof value === "string" && /^\d+$/.test(value)
    ? Math.min(Number(value), maximum)
    : fallback;

const hasIntegerParam = (value: string | string[] | undefined) =>
  typeof value === "string" && /^\d+$/.test(value);

const cards = [
  {
    id: "big-bass-halloween-3",
    accent: "#c9ff41",
    title: { en: "Big Bass Halloween 3", fr: "Big Bass Halloween 3" },
    href: "/casino/slots/game/pragmatic-big-bass-halloween-3",
  },
  {
    id: "witch-heart-megaways",
    accent: "#f05cff",
    title: { en: "Witch Heart Megaways", fr: "Witch Heart Megaways" },
    href: "/casino/slots/game/pragmatic-witch-heart-megaways",
  },
  {
    id: "zombie-school-megaways",
    accent: "#75e65b",
    title: {
      en: "Zombie School Megaways",
      fr: "Zombie School Megaways",
    },
    href: "/casino/slots/game/pragmatic-zombie-school-megaways",
  },
  {
    id: "big-bass-halloween-2",
    accent: "#ff6d35",
    title: { en: "Big Bass Halloween 2", fr: "Big Bass Halloween 2" },
    href: "/casino/slots/game/pragmatic-big-bass-halloween-2",
  },
  {
    id: "forever-split-megaways",
    accent: "#e55bca",
    title: { en: "Forever Split Megaways", fr: "Forever Split Megaways" },
    href: "/casino/slots/game/pragmatic-forever-split-megaways",
  },
  {
    id: "mr-hallow-win",
    accent: "#ff9a2f",
    title: { en: "Mr. Hallow-Win", fr: "Mr. Hallow-Win" },
    href: "/casino/slots/game/zth-pgsoft-mr-hallow-win",
  },
  {
    id: "frightening-frankie",
    accent: "#88f151",
    title: { en: "Frightening Frankie", fr: "Frightening Frankie" },
    href: "/casino/slots/game/pragmatic-frightening-frankie",
  },
  {
    id: "le-vampire",
    accent: "#ef4444",
    title: { en: "Le Vampire", fr: "Le Vampire" },
    href: "/casino/slots/game/hacksaw-le-vampire",
  },
  {
    id: "gates-of-hades",
    accent: "#ff7c32",
    title: { en: "Gates of Hades", fr: "Gates of Hades" },
    href: "/casino/slots/game/pragmatic-gates-of-hades",
  },
  {
    id: "ghost-booster-go-guaranteed",
    accent: "#75ef58",
    title: {
      en: "Ghost Booster! GO Guaranteed",
      fr: "Ghost Booster! GO Guaranteed",
    },
    href: "/casino/slots/game/softgamings-playngo-ghost-booster-go-guaranteed",
  },
  {
    id: "infective-wild",
    accent: "#c653ef",
    title: { en: "Infective Wild™", fr: "Infective Wild™" },
    href: "/casino/slots/game/pragmatic-infective-wild",
  },
] as const;

const getCards = (locale: HalloweenLocale): HalloweenSlide[] =>
  cards.map((card) => ({
    id: card.id,
    accent: card.accent,
    title: card.title[locale],
    image: `/images/halloween-canada/cards/${card.id}-637x336.webp`,
    preview: `/images/halloween-canada/previews/card-${card.id}-637x336.webp`,
    href: card.href,
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
  const query = await searchParams;
  const locale = getLocale(query.lang);
  const mascotDelay = getIntegerParam(query.delay, 0, 2_147_483_647);
  const mascotFrequency = getIntegerParam(query.frequency, 1, 20);
  const casperDelay = getIntegerParam(query.casperD, 0, 2_147_483_647);
  const casperFrequency = getIntegerParam(query.casperF, 2, 20);

  return (
    <>
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
                    cubeLoading: "Chargement du cube citrouille",
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
                    cubeLoading: "Loading the pumpkin cube",
                      cubeTap: "Tap me",
                    cubeResult: "The cube chose",
                    cubePlay: "Play",
                    cubeClose: "Close",
                  }
            }
          />
        </main>
      </SpiderField>
      {hasIntegerParam(query.delay) && (
        <HalloweenTournamentMascot
          delay={mascotDelay}
          frequency={mascotFrequency}
          locale={locale}
        />
      )}
      {hasIntegerParam(query.casperD) && (
        <HalloweenCasperMascot
          delay={casperDelay}
          frequency={casperFrequency}
          locale={locale}
        />
      )}
    </>
  );
}
