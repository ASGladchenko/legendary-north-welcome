"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AdminRequestError, adminRequest } from "../../admin-api";
import type { RuneCore, RuneForecast } from "../types";

type RuneDetailResponse = {
  date: string;
  core: RuneCore;
  rune: RuneForecast["rune"];
  forecast: RuneForecast["forecast"];
};

export function RuneForecastView({
  runeId,
  date,
}: {
  runeId: string;
  date?: string;
}) {
  const router = useRouter();
  const requestQuery = date ? `?date=${encodeURIComponent(date)}` : "";
  const query = useQuery({
    queryKey: ["admin", "rune-forecast", runeId, date ?? "today"],
    queryFn: () =>
      adminRequest<RuneDetailResponse>(
        `/api/admin/runes/${runeId}${requestQuery}`,
      ),
  });

  useEffect(() => {
    if (query.error instanceof AdminRequestError && query.error.status === 401) {
      router.replace("/admin");
      router.refresh();
    }
  }, [query.error, router]);

  if (query.error) {
    return (
      <div className="admin-empty is-error">
        {query.error instanceof Error ? query.error.message : "Forecast failed"}
      </div>
    );
  }
  if (!query.data) {
    return <div className="admin-loading">Loading today’s forecast…</div>;
  }

  const { data } = query;
  const { core } = data;
  const { forecast } = data;

  return (
    <article className="admin-rune-detail">
      <div className="admin-detail-topline">
        <Link href={date ? `/admin/runes/date/${date}` : "/admin/runes"}>
          ← All runes
        </Link>
        <time dateTime={data.date}>{data.date}</time>
      </div>

      <header className="admin-rune-hero">
        <span>{core.runeId} · {forecast.mood}</span>
        <h2>{data.rune.name}</h2>
        <strong>{forecast.signal}</strong>
        <p>{forecast.prediction}</p>
      </header>

      <div className="admin-forecast-grid">
        <section className="admin-forecast-callout">
          <span>Oracle line</span>
          <blockquote>{forecast.oracleLine}</blockquote>
          <b>{forecast.action}</b>
        </section>
        <section className="admin-forecast-facts">
          <dl>
            <div><dt>Play mode</dt><dd>{forecast.playMode}</dd></div>
            <div><dt>Stone</dt><dd>{forecast.stone}</dd></div>
            <div><dt>Numbers</dt><dd>{forecast.numbers.join(" · ")}</dd></div>
            <div><dt>Colors</dt><dd>{forecast.colors.join(" · ")}</dd></div>
            <div><dt>Energy</dt><dd>{forecast.energy}/5</dd></div>
            <div><dt>Luck</dt><dd>{forecast.luck.score}/5 · {forecast.luck.label}</dd></div>
          </dl>
        </section>
      </div>

      <section className="admin-core-details">
        <div className="admin-section-heading">
          <div>
            <span className="admin-kicker">Generated source</span>
            <h2>Prediction Core</h2>
          </div>
          <small>{core.model} · {core.promptVersion}</small>
        </div>
        <dl>
          {[
            ["Base state", core.baseState],
            ["Daily pressure", core.dailyPressure],
            ["Conflict", core.conflict],
            ["Situation", core.situation],
            ["Tension", core.tension],
            ["Resolution", core.resolution],
            ["Warning", core.warning],
            ["Opportunity", core.opportunity],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
