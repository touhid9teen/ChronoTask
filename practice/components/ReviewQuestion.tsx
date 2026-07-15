"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { QuestionResult, Question } from "@/practice/types";
import { formatTime } from "@/practice/utils/stats";

interface ReviewQuestionProps {
  question: Question;
  result: QuestionResult;
  index: number;
}

export default function ReviewQuestion({
  question,
  result,
  index,
}: ReviewQuestionProps) {
  const formatAnswer = (answer: string | string[]) => {
    if (Array.isArray(answer)) return answer.join(", ");
    return String(answer) || "No answer";
  };

  return (
    <Card
      className={`p-5 border-l-4 ${
        result.isCorrect
          ? "border-l-green-500"
          : result.isPartial
          ? "border-l-yellow-500"
          : "border-l-red-500"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
            Q{index + 1}
          </span>
          <span className="text-xs text-gray-400">
            {question.marks} mark{question.marks > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {result.isCorrect ? (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
            </span>
          ) : result.isPartial ? (
            <span className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
              Partial ({result.marksObtained}/{result.marksPossible})
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <XCircle className="w-3.5 h-3.5" /> Wrong
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {formatTime(result.timeSpent)}
          </span>
        </div>
      </div>

      <p className="text-gray-900 text-sm leading-relaxed mb-4">
        {question.text}
      </p>

      {question.options && (
        <div className="space-y-1.5 mb-4">
          {question.options.map((opt, i) => {
            const label = String.fromCharCode(65 + i);
            const isUserAnswer =
              result.userAnswer === opt ||
              (Array.isArray(result.userAnswer) &&
                result.userAnswer.includes(opt));
            const isCorrectOpt =
              question.correctAnswer === opt ||
              (Array.isArray(question.correctAnswer) &&
                question.correctAnswer.includes(opt));

            return (
              <div
                key={i}
                className={`flex items-center gap-2 p-2 rounded text-sm ${
                  isCorrectOpt
                    ? "bg-green-50 text-green-800"
                    : isUserAnswer && !isCorrectOpt
                    ? "bg-red-50 text-red-800"
                    : "text-gray-600"
                }`}
              >
                <span className="font-medium w-6">{label}.</span>
                <span>{opt}</span>
                {isCorrectOpt && (
                  <span className="ml-auto text-xs text-green-600">✓</span>
                )}
                {isUserAnswer && !isCorrectOpt && (
                  <span className="ml-auto text-xs text-red-600">✗</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!question.options && (
        <div className="space-y-2 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <p className="text-xs text-gray-400 mb-1">Your Answer:</p>
            <p className="text-gray-900">{formatAnswer(result.userAnswer)}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-sm">
            <p className="text-xs text-gray-400 mb-1">Correct Answer:</p>
            <p className="text-green-800">{formatAnswer(result.correctAnswer)}</p>
          </div>
        </div>
      )}

      {question.explanation && (
        <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="text-xs font-medium text-blue-600 mb-1">Explanation</p>
          {question.explanation}
        </div>
      )}
    </Card>
  );
}
