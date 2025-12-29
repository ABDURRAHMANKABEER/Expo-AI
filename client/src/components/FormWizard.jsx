// src/components/FormWizard.jsx
import React from "react";
import PropTypes from "prop-types";
import Button from "./../components/Button";

/**
 * Simple FormWizard wrapper
 * - steps: number of steps
 * - step: current step (1-indexed)
 * - onNext, onPrev, onSubmit
 * - children: render step contents
 *
 * This is intentionally minimal: it provides layout + controls only.
 */
export default function FormWizard({
  step,
  setStep,
  steps,
  onSubmit,
  loading = false,
  children,
}) {
  const isLast = step >= steps;
  const isFirst = step <= 1;

  return (
    <div>
      <div className="mb-4">
        <div className="flex gap-2">
          {Array.from({ length: steps }).map((_, i) => (
            <div key={i} className={`px-3 py-1 rounded-full text-sm ${i+1 === step ? 'bg-primary-light text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`}>
              Step {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div>{children}</div>

      <div className="mt-5 flex justify-between">
        <div>
          <Button variant="secondary" size="md" onClick={() => setStep(Math.max(1, step - 1))} disabled={isFirst}>
            Back
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {!isLast && (
            <Button variant="primary" size="md" onClick={() => setStep(Math.min(steps, step + 1))}>
              Next
            </Button>
          )}

          {isLast && (
            <Button variant="success" size="md" onClick={onSubmit} disabled={loading}>
              {loading ? "Processing..." : "Create & Generate"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

FormWizard.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  steps: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.node,
};