export const openAIModels = [
  {
    id: "gpt-5.4-mini",
    label: "GPT-5.4 Mini — recommended for Oracle",
  },
  {
    id: "gpt-5.4-nano",
    label: "GPT-5.4 Nano — lightweight",
  },
  {
    id: "gpt-6.1-sol",
    label: "GPT-6.1 Sol — advanced",
  },
  {
    id: "gpt-6-luna",
    label: "GPT-6 Luna — fastest and lowest cost",
  },
  {
    id: "gpt-6-astra",
    label: "GPT-6 Astra — highest quality",
  },
] as const;

export const defaultOpenAIModel = openAIModels[0].id;
export type OpenAIModel = (typeof openAIModels)[number]["id"];

export function isOpenAIModel(value: string): value is OpenAIModel {
  return openAIModels.some((model) => model.id === value);
}
