"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReviewQuestion from "./ReviewQuestion";
import type { ExamResult, Question } from "@/practice/types";

interface ReviewModeProps {
  result: ExamResult;
  questions: Question[];
  onBack: () => void;
}

export default function ReviewMode({ result, questions, onBack }: ReviewModeProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h2 className="text-lg font-semibold text-gray-900">
          Review Answers ({result.questionResults.length} questions)
        </h2>
      </div>

      <div className="space-y-4">
        {result.questionResults.map((qr, i) => {
          const question = questions.find((q) => q.id === qr.questionId);
          if (!question) return null;
          return (
            <ReviewQuestion
              key={qr.questionId}
              question={question}
              result={qr}
              index={i}
            />
          );
        })}
      </div>
    </div>
  );
}
