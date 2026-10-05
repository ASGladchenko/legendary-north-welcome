import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import { ParentUrlLogger } from "./components/parent-url-logger";

const montserrat = Montserrat({
  weight: "variable",
  style: "normal",
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
});

const montserratItalic = Montserrat({
  weight: "variable",
  style: "italic",
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat-italic",
});

export const metadata: Metadata = {
  title: "Legendary North",
  description: "Five steps to legendary rewards.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${montserratItalic.variable}`}
    >
      <body>
        <ParentUrlLogger />
        {children}
      </body>
    </html>
  );
}
