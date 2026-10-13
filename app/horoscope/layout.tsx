import { Cinzel } from "next/font/google";
import type { ReactNode } from "react";

import "./horoscope.css";

const runeDisplay = Cinzel({
  subsets: ["latin"],
  variable: "--font-rune-display",
  display: "swap",
});

export default function HoroscopeLayout({ children }: { children: ReactNode }) {
  return <div className={runeDisplay.variable}>{children}</div>;
}
