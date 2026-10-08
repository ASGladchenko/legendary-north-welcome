import {
  exhaustedPrediction,
  predictions,
  type Prediction,
} from "./prediction-config";

export { predictions, type Prediction } from "./prediction-config";

const storageKey = "northern-oracle-predictions";
let memoryHistory: PredictionHistory | null = null;

type PredictionHistory = {
  date: string;
  usedIds: string[];
};

function getLocalDate() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function readHistory(date: string): PredictionHistory {
  try {
    const saved = JSON.parse(
      window.localStorage.getItem(storageKey) ?? "null",
    ) as Partial<PredictionHistory> | null;

    if (saved?.date === date && Array.isArray(saved.usedIds)) {
      return { date, usedIds: saved.usedIds };
    }
  } catch {
    // The in-memory fallback still prevents repeats while this page is open.
  }

  return memoryHistory?.date === date
    ? memoryHistory
    : { date, usedIds: [] };
}

function saveHistory(history: PredictionHistory) {
  memoryHistory = history;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(history));
  } catch {
    // localStorage can be unavailable in privacy mode; memoryHistory is enough.
  }
}

export function getNextPrediction() {
  const date = getLocalDate();
  const history = readHistory(date);
  const usedIds = new Set(history.usedIds);
  const available = predictions.filter(({ id }) => !usedIds.has(id));

  if (available.length === 0) return exhaustedPrediction;

  const random = crypto.getRandomValues(new Uint32Array(1))[0];
  const prediction = available[random % available.length];

  saveHistory({ date, usedIds: [...usedIds, prediction.id] });

  return prediction;
}

export function getPredictionFaceIndex(prediction: Prediction) {
  const index = predictions.findIndex(({ id }) => id === prediction.id);

  return index < 0 ? predictions.length % 6 : index % 6;
}
