"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseExamTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  onTick?: (remaining: number) => void;
}

export function useExamTimer({
  initialTime,
  onTimeUp,
  onTick,
}: UseExamTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  const onTickRef = useRef(onTick);

  onTimeUpRef.current = onTimeUp;
  onTickRef.current = onTick;

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const next = prev - 1;
          onTickRef.current?.(next);
          if (next <= 0) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            onTimeUpRef.current();
            return 0;
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeRemaining]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newTime?: number) => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeRemaining(newTime ?? initialTime);
  }, [initialTime]);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  return {
    timeRemaining,
    isRunning,
    start,
    pause,
    reset,
    setTimeRemaining,
    formatted: formatTime(timeRemaining),
    isUrgent: timeRemaining <= 300,
    isCritical: timeRemaining <= 60,
  };
}
