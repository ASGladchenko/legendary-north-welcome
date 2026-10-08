import type { Prediction } from "./predictions";

type ResultUiProps = {
  prediction: Prediction | null;
  onClose: () => void;
};

export function ResultUi({ prediction, onClose }: ResultUiProps) {
  if (!prediction) return null;

  return (
    <div className="oracle-prediction" role="status" aria-live="polite">
      <button
        className="oracle-prediction-close"
        type="button"
        aria-label="Close prediction"
        onClick={onClose}
      >
        ×
      </button>
      <span>Your northern sign</span>
      <p>{prediction.description}</p>
    </div>
  );
}
