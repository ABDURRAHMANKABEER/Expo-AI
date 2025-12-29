import React from "react";
import PropTypes from "prop-types";
import OptionButton from "./OptionButton";

/**
 * QuestionCard
 * props:
 * - question: { _id, questionText, options: [{option, isCorrect}], explanation, metadata }
 * - qIndex: page-scoped index (0..)
 * - selectedIndex: number|null
 * - onSelect(optionIndex)
 * - reveal (bool) - whether to show correct/incorrect states
 */
export default function QuestionCard({
  question,
  qIndex,
  selectedIndex,
  onSelect,
  reveal = false,
}) {
  // eslint-disable-next-line no-unused-vars
  const qid = question?._id || `q-${qIndex}`;
  const options = Array.isArray(question?.options) ? question.options : [];

  return (
    <div className="p-4 border rounded bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-700">
      <div className="mb-3 text-sm text-gray-700 dark:text-gray-200">
        <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">{qIndex + 1}.</span>
        <span>{question?.questionText || question?.text || "Untitled question"}</span>
      </div>

      <div className="grid gap-2">
        {options.map((opt, idx) => {
          const label = typeof opt === "string" ? opt : opt?.option ?? String(opt);
          const isCorrect = typeof opt === "object" && !!opt?.isCorrect;
          const indexLabel = String.fromCharCode(65 + idx);
          return (
            <OptionButton
              key={idx}
              label={label}
              indexLabel={indexLabel}
              onClick={() => onSelect(idx)}
              selected={selectedIndex === idx}
              reveal={reveal ? "showAll" : "none"}
              correct={isCorrect}
              disabled={reveal}
            />
          );
        })}
      </div>

      {reveal && question?.explanation && (
        <div className="mt-3 p-3 bg-white dark:bg-slate-800 border rounded text-sm text-gray-700 dark:text-gray-200">
          <div className="font-medium mb-1">Explanation</div>
          <div>{question.explanation}</div>
        </div>
      )}
    </div>
  );
}

QuestionCard.propTypes = {
  question: PropTypes.object.isRequired,
  qIndex: PropTypes.number,
  selectedIndex: PropTypes.number,
  onSelect: PropTypes.func,
  reveal: PropTypes.bool,
};