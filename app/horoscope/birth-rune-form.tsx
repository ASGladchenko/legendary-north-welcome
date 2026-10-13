"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState, useTransition } from "react";

const wheelRowHeight = 32;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function daysInMonth(month: string) {
  return month ? new Date(2000, Number(month), 0).getDate() : 31;
}

export function BirthRuneForm() {
  const router = useRouter();
  const [day, setDay] = useState(() => String(new Date().getDate()));
  const [month, setMonth] = useState(() => String(new Date().getMonth() + 1));
  const [pending, startTransition] = useTransition();
  const dayCount = daysInMonth(month);

  function selectMonth(nextMonth: string) {
    setMonth(nextMonth);
    if (day && Number(day) > daysInMonth(nextMonth)) {
      setDay(String(daysInMonth(nextMonth)));
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!day || !month) return;

    const monthDay = `${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    startTransition(() => router.push(`/horoscope/birth/${monthDay}`));
  }

  return (
    <form className="birth-rune-form" onSubmit={submit}>
      <span>Reveal your birth rune</span>
      <div>
        <div className="birth-wheel-field">
          <span>Day</span>
          <WheelPicker
            ariaLabel="Birth day"
            value={day}
            onChange={setDay}
            items={Array.from({ length: dayCount }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }))}
          />
        </div>

        <div className="birth-wheel-field">
          <span>Month</span>
          <WheelPicker
            ariaLabel="Birth month"
            value={month}
            onChange={selectMonth}
            items={months.map((label, index) => ({ value: String(index + 1), label }))}
          />
        </div>

        <button type="submit" disabled={!day || !month || pending}>
          {pending ? "Reading the North…" : "Find my rune"}
          {!pending && <b aria-hidden="true">→</b>}
        </button>
      </div>
    </form>
  );
}

function WheelPicker({
  ariaLabel,
  items,
  value,
  onChange,
}: {
  ariaLabel: string;
  items: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  const wheel = useRef<HTMLDivElement>(null);
  const initialIndex = useRef(Math.max(0, items.findIndex((item) => item.value === value)));

  useEffect(() => {
    if (wheel.current) wheel.current.scrollTop = initialIndex.current * wheelRowHeight;
  }, []);

  function pick(index: number, nextValue: string) {
    onChange(nextValue);
    wheel.current?.scrollTo({ top: index * wheelRowHeight, behavior: "smooth" });
  }

  return (
    <div className="birth-wheel-shell">
      <div
        className="birth-wheel"
        ref={wheel}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={(event) => {
          const index = Math.round(event.currentTarget.scrollTop / wheelRowHeight);
          const nextValue = items[index]?.value;
          if (nextValue !== undefined && nextValue !== value) onChange(nextValue);
        }}
      >
        {items.map((item, index) => (
          <button
            type="button"
            role="option"
            aria-selected={item.value === value}
            className={item.value === value ? "is-selected" : undefined}
            key={item.value || "placeholder"}
            onClick={() => pick(index, item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
