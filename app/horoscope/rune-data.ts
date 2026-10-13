import "server-only";

import type { StaticImageData } from "next/image";

import { backendRequest } from "@/app/api/admin/backend";

import dravikImage from "@/public/images/rune/dravik.webp";
import erynnImage from "@/public/images/rune/erynn.webp";
import norvethImage from "@/public/images/rune/norveth.webp";
import skaarnImage from "@/public/images/rune/skaarn.webp";
import thalvenImage from "@/public/images/rune/thalven.webp";
import vaelrImage from "@/public/images/rune/vaelr.webp";
import veyraImage from "@/public/images/rune/veyra.webp";

export const runeIds = [
  "vaelr",
  "erynn",
  "norveth",
  "veyra",
  "skaarn",
  "dravik",
  "thalven",
] as const;

export type RuneId = (typeof runeIds)[number];

export type RuneForecast = {
  date: string;
  rune: { id: RuneId; name: string; segment: string };
  forecast: {
    signal: string;
    prediction: string;
    action: string;
    oracleLine: string;
    mood: string;
    playMode: string;
    tempo: number;
    luck: { score: number; label: string };
    energy: number;
    numbers: number[];
    colors: string[];
    stone: string;
  };
};

export type RunePresentation = {
  id: RuneId;
  name: string;
  teaser: string;
  image: StaticImageData;
  accent: string;
  stone: "blue" | "cyan" | "violet";
};

export const runes: readonly RunePresentation[] = [
  {
    id: "vaelr",
    name: "VAELR",
    teaser: "Direction appears when intention becomes clear.",
    image: vaelrImage,
    accent: "ice blue",
    stone: "blue",
  },
  {
    id: "erynn",
    name: "ERYNN",
    teaser: "Look beyond what is immediately visible.",
    image: erynnImage,
    accent: "violet",
    stone: "violet",
  },
  {
    id: "norveth",
    name: "NORVETH",
    teaser: "Balance returns through deliberate choices.",
    image: norvethImage,
    accent: "emerald",
    stone: "cyan",
  },
  {
    id: "veyra",
    name: "VEYRA",
    teaser: "Focus turns uncertainty into motion.",
    image: veyraImage,
    accent: "sky blue",
    stone: "blue",
  },
  {
    id: "skaarn",
    name: "SKAARN",
    teaser: "Courage protects what matters most.",
    image: skaarnImage,
    accent: "gold",
    stone: "violet",
  },
  {
    id: "dravik",
    name: "DRAVIK",
    teaser: "Change begins with one decisive spark.",
    image: dravikImage,
    accent: "deep red",
    stone: "cyan",
  },
  {
    id: "thalven",
    name: "THALVEN",
    teaser: "Connection reveals the hidden pattern.",
    image: thalvenImage,
    accent: "royal blue",
    stone: "violet",
  },
];

const colorValues: Record<string, string> = {
  amber: "#ffbd5b",
  aqua: "#43f4e8",
  black: "#76869e",
  burgundy: "#ca4264",
  charcoal: "#8192aa",
  crimson: "#ff536c",
  "deep green": "#2bc8a0",
  "deep red": "#ff4f57",
  emerald: "#39e0a1",
  "earth brown": "#c08b61",
  gold: "#ffd06b",
  graphite: "#91a8c4",
  "forest green": "#48c889",
  "ice blue": "#73ddff",
  navy: "#668fff",
  plum: "#c074d5",
  "pearl white": "#eafcff",
  "royal blue": "#668dff",
  "royal purple": "#a77bff",
  sage: "#9bd8b0",
  "sea blue": "#45c8ed",
  "sea green": "#46d6ba",
  silver: "#c6e9ff",
  "sky blue": "#65d8ff",
  violet: "#a981ff",
  yellow: "#ffe56c",
};

export function isRuneId(value: string): value is RuneId {
  return runeIds.includes(value as RuneId);
}

export function getRune(id: RuneId) {
  return runes.find((rune) => rune.id === id)!;
}

export function runeAccent(color?: string) {
  return colorValues[color?.toLowerCase() ?? ""] ?? "#73ddff";
}

export async function getRuneForecast(id: RuneId) {
  const query = new URLSearchParams({ runeId: id });
  const result = await backendRequest(`/oracle/forecast?${query}`);

  if (result.status !== 200 || !isRuneForecast(result.data, id)) return null;
  return result.data;
}

export async function getBirthRuneForecast(monthDay: string) {
  if (!isMonthDay(monthDay)) return null;

  const query = new URLSearchParams({ birthDate: `2000-${monthDay}` });
  const result = await backendRequest(`/oracle/forecast?${query}`);

  if (result.status !== 200 || !isRuneForecast(result.data)) return null;
  return result.data;
}

export function isMonthDay(value: string) {
  if (!/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) return false;

  const date = new Date(`2000-${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(5, 10) === value;
}

function isRuneForecast(value: unknown, id?: RuneId): value is RuneForecast {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const data = value as Partial<RuneForecast>;
  const forecast = data.forecast;

  return Boolean(
    typeof data.rune?.id === "string" &&
      isRuneId(data.rune.id) &&
      (!id || data.rune.id === id) &&
      typeof data.rune.name === "string" &&
      forecast &&
      typeof forecast.signal === "string" &&
      typeof forecast.prediction === "string" &&
      typeof forecast.action === "string" &&
      typeof forecast.oracleLine === "string" &&
      typeof forecast.mood === "string" &&
      typeof forecast.playMode === "string" &&
      typeof forecast.stone === "string" &&
      typeof forecast.energy === "number" &&
      forecast.luck &&
      typeof forecast.luck === "object" &&
      !Array.isArray(forecast.luck) &&
      typeof forecast.luck.score === "number" &&
      typeof forecast.luck.label === "string" &&
      typeof forecast.tempo === "number" &&
      Array.isArray(forecast.numbers) &&
      Array.isArray(forecast.colors),
  );
}
