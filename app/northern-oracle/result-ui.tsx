import type { Prediction } from "./predictions";

export function ResultUi({ prediction }: { prediction: Prediction | null }) {
  return (
    <div
      className={`oracle-result${prediction ? " is-visible" : ""}`}
      aria-live="polite"
    >
      {prediction && (
        <>
          <span>Your northern sign</span>
          <h2>{prediction.title}</h2>
          <p>{prediction.description}</p>
        </>
      )}
    </div>
  );
}
