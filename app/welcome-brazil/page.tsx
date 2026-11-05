import type { Metadata } from "next";

import "./welcome-brazil.css";

import { OfferModal } from "../components/offer-modal";
import {
  getWelcomeBrazilConfig,
  type WelcomeBrazilLocale,
} from "../config/welcome-brazil";
import { WelcomeBrazil } from "./welcome-brazil";

const getLocale = (lang: string | string[] | undefined): WelcomeBrazilLocale =>
  lang === "en" ? "en" : "pt-BR";

export async function generateMetadata({
  searchParams,
}: PageProps<"/welcome-brazil">): Promise<Metadata> {
  const query = await searchParams;
  const locale = getLocale(query.lang);

  if (query.welcome === "instant") {
    return locale === "en"
      ? {
          title: "Instant welcome offer | 1MLNBET Brazil",
          description: "Four Instant bonus stages with Aviator and Big Bass Bonanza rewards.",
        }
      : {
          title: "Oferta de boas-vindas Instant | 1MLNBET Brasil",
          description: "Quatro etapas de bônus Instant com recompensas no Aviator e Big Bass Bonanza.",
        };
  }

  return locale === "en"
    ? {
        title: "Welcome offer | 1MLNBET Brazil",
        description: "Five stages of bonuses and rewards for new players.",
      }
    : {
        title: "Oferta de boas-vindas | 1MLNBET Brasil",
        description: "Cinco etapas de bônus e recompensas para novos jogadores.",
      };
}

export default async function WelcomeBrazilPage({
  searchParams,
}: PageProps<"/welcome-brazil">) {
  const { lang, login, maskot, modal, welcome } = await searchParams;
  const locale = getLocale(lang);
  const config = getWelcomeBrazilConfig(locale);
  const variant = welcome === "instant"
    ? "instant"
    : welcome === "vip"
      ? "vip"
      : "standard";
  const showSignup = login === "no";
  const showModal = modal === "yes";
  const mascotDelay = typeof maskot === "string" && /^\d+$/.test(maskot)
    ? Math.min(Number(maskot), 2_147_483_647)
    : null;
  const actionHref = showSignup
    ? variant === "instant"
      ? config.cta.instantSignupUrl
      : config.cta.signupUrl
    : config.cta.promoUrl;

  return (
    <>
      <WelcomeBrazil
        actionHref={actionHref}
        locale={locale}
        mascotDelay={mascotDelay}
        variant={variant}
      />
      {showModal && (
        <OfferModal
          actionHref={config.cta.signupUrl}
          image={config.modal.image}
          locale={locale === "en" ? "en-BR" : "pt-BR"}
        />
      )}
    </>
  );
}

