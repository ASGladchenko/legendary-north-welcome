"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminRequestError, adminRequest } from "../admin-api";
import { RuneCalendar } from "./rune-calendar";
import type { RuneCore } from "./types";

type RuneMonthResponse = {
  month: string;
  today: string;
  runes: RuneCore[];
};

export function RuneCalendarPage() {
  const router = useRouter();
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const query = useQuery({
    queryKey: ["admin", "runes", "month", month],
    queryFn: () =>
      adminRequest<RuneMonthResponse>(`/api/admin/runes?month=${month}`),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (query.error instanceof AdminRequestError && query.error.status === 401) {
      router.replace("/admin");
      router.refresh();
    }
  }, [query.error, router]);

  const loading = query.isPending || query.isPlaceholderData;
  const error = query.error instanceof Error ? query.error.message : "";

  const availableDates = [
    ...new Set((query.data?.runes ?? []).map((core) => core.date.slice(0, 10))),
  ];

  return (
    <>
      <div className="admin-calendar-stage" aria-busy={loading}>
        <RuneCalendar
          month={month}
          today={query.data?.today ?? dayjs().format("YYYY-MM-DD")}
          availableDates={availableDates}
          overlay={
            loading ? (
              <div className="admin-calendar-loading" role="status">
                <i aria-hidden="true" />
                <span>Loading calendar…</span>
              </div>
            ) : !error && !availableDates.length ? (
              <div className="admin-calendar-empty" role="status">
                No forecasts were generated for this month.
              </div>
            ) : undefined
          }
          onMonthChange={setMonth}
          onDateClick={(date) => router.push(`/admin/runes/date/${date}`)}
        />
      </div>
      {error && <div className="admin-empty is-error">{error}</div>}
    </>
  );
}
