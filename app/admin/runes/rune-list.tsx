"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AdminRequestError, adminRequest } from "../admin-api";
import type { RuneCore } from "./types";

type RuneListResponse = {
  date: string;
  runes: RuneCore[];
};

export function RuneList({ date }: { date: string }) {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["admin", "runes", "date", date],
    queryFn: () =>
      adminRequest<RuneListResponse>(`/api/admin/runes?date=${date}`),
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
        {query.error instanceof Error ? query.error.message : "Rune data failed"}
      </div>
    );
  }
  if (!query.data) return <div className="admin-loading">Loading rune data…</div>;

  const { data } = query;

  return (
    <section className="admin-runes">
      <div className="admin-detail-topline">
        <Link href="/admin/runes">← Calendar</Link>
        <time dateTime={data.date}>{data.date}</time>
      </div>
      <div className="admin-section-heading">
        <div>
          <span className="admin-kicker">Prediction Core</span>
          <h2>Rune characteristics</h2>
        </div>
      </div>

      {data.runes.length ? (
        <div className="admin-rune-grid">
          {data.runes.map((core) => (
            <Link
              className="admin-rune-card"
              href={`/admin/runes/${core.runeId}?date=${date}`}
              key={core.id}
            >
              <header>
                <div>
                  <span>{core.runeId}</span>
                  <h3>{core.runeConfig.name}</h3>
                </div>
                <b aria-hidden="true">↗</b>
              </header>
              <p>{core.baseState}</p>
              <div className="admin-tags">
                {core.runeConfig.coreTraits.slice(0, 3).map((trait) => (
                  <span key={trait}>{trait}</span>
                ))}
              </div>
              <dl>
                <div>
                  <dt>Theme</dt>
                  <dd>{core.dominantTheme}</dd>
                </div>
                <div>
                  <dt>Decision style</dt>
                  <dd>{core.runeConfig.decisionStyle}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </div>
      ) : (
        <div className="admin-empty">No Rune Core records exist for {date}.</div>
      )}
    </section>
  );
}
