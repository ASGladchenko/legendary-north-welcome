"use client";

import dayjs from "dayjs";
import type { ReactNode } from "react";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type RuneCalendarProps = {
  month: string;
  today: string;
  availableDates: string[];
  overlay?: ReactNode;
  onMonthChange: (month: string) => void;
  onDateClick: (date: string) => void;
};

export function RuneCalendar({
  month,
  today,
  availableDates,
  overlay,
  onMonthChange,
  onDateClick,
}: RuneCalendarProps) {
  const firstDay = dayjs(`${month}-01`);
  const leadingDays = (firstDay.day() + 6) % 7;
  const available = new Set(availableDates);
  const currentMonth = dayjs(today).startOf("month");
  const canGoForward = firstDay.isBefore(currentMonth, "month");

  return (
    <section className="admin-calendar" aria-label="Forecast calendar">
      <header>
        <div>
          <span className="admin-kicker">Forecast archive</span>
          <h2>{firstDay.format("MMMM YYYY")}</h2>
        </div>
        <div className="admin-calendar-controls">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => onMonthChange(firstDay.subtract(1, "month").format("YYYY-MM"))}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next month"
            disabled={!canGoForward}
            onClick={() => onMonthChange(firstDay.add(1, "month").format("YYYY-MM"))}
          >
            →
          </button>
        </div>
      </header>

      <div className="admin-calendar-body">
        <div className="admin-calendar-grid">
          {weekdays.map((weekday) => (
            <span className="admin-calendar-weekday" key={weekday}>
              {weekday}
            </span>
          ))}
          {Array.from({ length: 42 }, (_, index) => {
            const dayNumber = index - leadingDays + 1;
            const date = firstDay.date(dayNumber);
            const inMonth = date.month() === firstDay.month();

            if (!inMonth) {
              return <span aria-hidden="true" key={`empty-${index}`} />;
            }

            const value = date.format("YYYY-MM-DD");
            const hasForecast = available.has(value);

            return (
              <button
                type="button"
                key={value}
                disabled={!hasForecast}
                aria-label={date.format("D MMMM YYYY")}
                aria-current={value === today ? "date" : undefined}
                onClick={() => onDateClick(value)}
              >
                <span>{dayNumber}</span>
                {hasForecast && <i aria-hidden="true" />}
              </button>
            );
          })}
        </div>
        {overlay}
      </div>
    </section>
  );
}
