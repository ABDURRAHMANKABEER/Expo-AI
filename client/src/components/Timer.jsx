// src/components/Timer.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * Timer (circular)
 * props:
 * - duration (seconds)
 * - onExpire()
 * - onTick(remainingSeconds) optional
 * - size (px)
 */
export default function Timer({ duration = 60, onExpire, onTick, size = 64 }) {
  const [remaining, setRemaining] = useState(duration);
  // eslint-disable-next-line no-unused-vars
  const ref = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(duration);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const rem = Math.max(duration - elapsed, 0);
      setRemaining(rem);
      if (onTick) onTick(rem);
      if (rem <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 500);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [duration]);

  // eslint-disable-next-line no-unused-vars
  const pct = useMemo(() => {
    if (duration <= 0) return 0;
    return Math.round(((duration - remaining) / duration) * 100);
  }, [remaining, duration]);

  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const stroke = 6;
  const progress = Math.max(0, Math.min(1, (duration ? (remaining / duration) : 0)));
  const dash = circumference * progress;

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <defs />
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle
            r={radius}
            fill="transparent"
            stroke="rgba(226,226,231,0.7)"
            strokeWidth={stroke}
            className="dark:stroke-slate-700"
          />
          <circle
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={circumference - dash}
            style={{ color: "var(--tw-color-primary)" }}
            className="text-primary-light"
          />
        </g>
      </svg>

      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{minutes}:{seconds}</div>
        <div className="text-xs text-gray-500 dark:text-gray-300">time left</div>
      </div>
    </div>
  );
}

Timer.propTypes = {
  duration: PropTypes.number,
  onExpire: PropTypes.func,
  onTick: PropTypes.func,
  size: PropTypes.number,
};