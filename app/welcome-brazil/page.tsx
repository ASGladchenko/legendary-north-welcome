import type { Metadata } from "next";

import "./welcome-brazil.css";

import { OfferModal } from "../components/offer-modal";
import { welcomeBrazilConfig } from "../config/welcome-brazil";
import { WelcomeBrazil } from "./welcome-brazil";

export const metadata: Metadata = {
  title: "Oferta de boas-vindas | 1MLNBET Brasil",
  description: "Cinco etapas de bônus e recompensas para novos jogadores.",
};

export default async function WelcomeBrazilPage({
  searchParams,
}: PageProps<"/welcome-brazil">) {
  const { login, welcome } = await searchParams;
  const variant = welcome === "vip" ? "vip" : "standard";
  const showSignup = login === "no";
  const actionHref = showSignup
    ? welcomeBrazilConfig.cta.signupUrl
    : welcomeBrazilConfig.cta.promoUrl;

  return (
    <>
      <WelcomeBrazil actionHref={actionHref} variant={variant} />
      {showSignup && (
        <OfferModal
          actionHref={welcomeBrazilConfig.cta.signupUrl}
          image={welcomeBrazilConfig.modal.image}
          locale="pt-BR"
        />
      )}
    </>
  );
}

