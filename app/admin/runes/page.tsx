import type { Metadata } from "next";

import { RuneCalendarPage } from "./rune-calendar-page";

export const metadata: Metadata = {
  title: "Horoscope Calendar | Legendary North",
};

export default function RuneDataPage() {
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Legendary North</span>
          <h1>Horoscope Platform</h1>
        </div>
      </header>
      <RuneCalendarPage />
    </>
  );
}
