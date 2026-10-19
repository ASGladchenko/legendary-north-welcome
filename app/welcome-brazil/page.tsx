import type { Metadata } from "next";

import "./welcome-brazil.css";

import { WelcomeBrazil } from "./welcome-brazil";

export const metadata: Metadata = {
  title: "Oferta de boas-vindas | 1MLNBET Brasil",
  description: "Cinco etapas de bônus e recompensas para novos jogadores.",
};

export default async function WelcomeBrazilPage({
  searchParams,
}: PageProps<"/welcome-brazil">) {
  const { welcome } = await searchParams;
  const variant = welcome === "vip" ? "vip" : "standard";

  return <WelcomeBrazil variant={variant} />;
}

