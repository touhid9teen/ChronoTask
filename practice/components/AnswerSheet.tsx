"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "@/practice/types";

interface AnswerSheetProps {
  questions: Question[];
  currentIndex: number;
  getQuestionStatus: (id: string) => string;
  onNavigate: (index: number) => void;
}

export default function AnswerSheet({
  questions,
  currentIndex,
  getQuestionStatus,
  onNavigate,
}: AnswerSheetProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Answer Sheet</h3>
      <div className="grid grid-cols-6 gap-1.5">
        {questions.map((q, i) => {
          const status = getQuestionStatus(q.id);
          return (
            <button
              key={q.id}
              onClick={() => onNavigate(i)}
              className={cn(
                "w-full aspect-square rounded-md text-xs font-semibold transition-all flex items-center justify-center",
                i === currentIndex &&
                  "ring-2 ring-blue-500 ring-offset-1",
                status === "answered" &&
                  "bg-green-100 text-green-700 hover:bg-green-200",
                status === "review" &&
                  "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
                status === "unanswered" &&
                  "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-100" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-100" />
          <span>Flagged for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-100" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}
