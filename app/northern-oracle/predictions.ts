export type Prediction = {
  id: string;
  title: string;
  description: string;
  runeId: string;
};

export const predictions: Prediction[] = [
  {
    id: "lucky-day",
    title: "Lucky Day",
    description: "Today is a good moment to trust your instinct.",
    runeId: "rune-01",
  },
  {
    id: "bold-path",
    title: "Bold Path",
    description: "The road that asks for courage carries the richest reward.",
    runeId: "rune-02",
  },
  {
    id: "hidden-gift",
    title: "Hidden Gift",
    description: "Look twice at what seems ordinary. Fortune is concealed there.",
    runeId: "rune-03",
  },
  {
    id: "clear-signal",
    title: "Clear Signal",
    description: "A small sign will confirm the choice you already understand.",
    runeId: "rune-04",
  },
  {
    id: "rising-tide",
    title: "Rising Tide",
    description: "Momentum is building. Move with it before the moment passes.",
    runeId: "rune-05",
  },
  {
    id: "north-star",
    title: "North Star",
    description: "Keep your direction steady. The outcome is closer than it appears.",
    runeId: "rune-06",
  },
];

export function getRandomPrediction() {
  const random = crypto.getRandomValues(new Uint32Array(1))[0];

  return predictions[random % predictions.length];
}
