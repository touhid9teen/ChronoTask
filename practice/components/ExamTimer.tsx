"use client";

import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamTimerProps {
  formatted: string;
  isRunning: boolean;
  isUrgent: boolean;
  isCritical: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
}

export default function ExamTimer({
  formatted,
  isRunning,
  isUrgent,
  isCritical,
  isPaused,
  onPause,
  onResume,
}: ExamTimerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm font-semibold transition-colors",
        isCritical
          ? "bg-red-100 text-red-700 animate-pulse"
          : isUrgent
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-700"
      )}
      onClick={isRunning ? onPause : onResume}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span>{formatted}</span>
    </div>
  );
}
