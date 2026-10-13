export type RuneConfig = {
  id: string;
  name: string;
  temperament: string[];
  coreTraits: string[];
  strengths: string[];
  shadows: string[];
  decisionStyle: string;
  gamingArchetype: string;
  riskProfile: number;
  tempo: number;
  stones: string[];
  numberPool: number[];
  colorPool: string[];
};

export type RuneCore = {
  id: string;
  date: string;
  runeId: string;
  segment: string;
  baseState: string;
  dailyPressure: string;
  conflict: string;
  situation: string;
  tension: string;
  resolution: string;
  warning: string;
  opportunity: string;
  dominantTheme: string;
  secondaryTheme: string;
  model: string;
  promptVersion: string;
  generatedAt: string;
  runeConfig: RuneConfig;
};

export type RuneForecast = {
  date: string;
  rune: { id: string; name: string; segment: string };
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
