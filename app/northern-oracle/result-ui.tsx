import type { Prediction } from "./predictions";

type ResultUiProps = {
  prediction: Prediction | null;
  collapsed: boolean;
  onToggle: () => void;
};

export function ResultUi({ prediction, collapsed, onToggle }: ResultUiProps) {
  return (
    <div
      className={`oracle-result${prediction ? " is-visible" : ""}${collapsed ? " is-collapsed" : ""}`}
      aria-live="polite"
    >
      {prediction && (
        <>
          <button
            className="oracle-result-toggle"
            type="button"
            aria-expanded={!collapsed}
            aria-controls="oracle-result-content"
            aria-label={collapsed ? "Show prediction" : "Hide prediction"}
            onClick={onToggle}
          />
          <div id="oracle-result-content" className="oracle-result-content">
            <span>Your northern sign</span>
            <h2>{prediction.title}</h2>
            <p>{prediction.description}</p>
          </div>
        </>
      )}
    </div>
  );
}
