"use client";

import { useEffect, useRef } from "react";

interface UseAutoSaveProps {
  onSave: () => void;
  intervalMs?: number;
  enabled?: boolean;
}

export function useAutoSave({
  onSave,
  intervalMs = 30000,
  enabled = true,
}: UseAutoSaveProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      onSaveRef.current();
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, intervalMs]);

  const saveNow = () => {
    onSaveRef.current();
  };

  return { saveNow };
}
