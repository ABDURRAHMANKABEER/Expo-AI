import React from "react";
import PropTypes from "prop-types";

/**
 * OptionButton
 * - label: string
 * - onClick: () => void
 * - selected: boolean
 * - disabled: boolean
 * - reveal: 'none' | 'showCorrect' | 'showAll'  (controls styling when showing correctness)
 * - correct: boolean (whether this option is correct)
 */
export default function OptionButton({
  label,
  onClick,
  selected = false,
  disabled = false,
  reveal = "none",
  correct = false,
  indexLabel = null,
}) {
  // colors vary for dark/light using Tailwind classes
  const base = "w-full text-left px-3 py-2 rounded border transition-shadow flex items-start gap-3";
  const neutral = "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100";
  const selectedCls = "ring-2 ring-offset-1 ring-primary-light bg-primary-light/5 border-primary-light";
  const correctCls = "border-green-400 bg-green-50 dark:bg-green-900/20";
  const incorrectCls = "border-red-400 bg-red-50 dark:bg-red-900/20 opacity-95";

  let cls = `${base} ${neutral}`;
  if (selected) cls += ` ${selectedCls}`;
  if (reveal === "showCorrect" || reveal === "showAll") {
    if (correct) cls += ` ${correctCls}`;
    else if (selected && !correct) cls += ` ${incorrectCls}`;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cls}
      aria-pressed={selected}
      type="button"
    >
      <div className="w-6 flex-none text-sm font-semibold text-gray-700 dark:text-gray-200">{indexLabel}</div>
      <div className="flex-1">
        <div className="leading-snug">{label}</div>
      </div>
    </button>
  );
}

OptionButton.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  reveal: PropTypes.oneOf(["none", "showCorrect", "showAll"]),
  correct: PropTypes.bool,
  indexLabel: PropTypes.string,
};