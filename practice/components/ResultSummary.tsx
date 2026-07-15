"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Percent,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import type { ExamResult } from "@/practice/types";
import { formatTime } from "@/practice/utils/stats";

interface ResultSummaryProps {
  result: ExamResult;
  passingMarks?: number;
  onReview: () => void;
  onRetake: () => void;
}

export default function ResultSummary({
  result,
  passingMarks,
  onReview,
  onRetake,
}: ResultSummaryProps) {
  const passed = passingMarks ? result.score >= passingMarks : null;

  return (
    <div className="space-y-6">
      <Card className="p-6 text-center">
        <div
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
            passed === null
              ? "bg-blue-100"
              : passed
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          {passed === null ? (
            <BarChart3 className="w-10 h-10 text-blue-600" />
          ) : passed ? (
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {passed === null
            ? "Exam Completed"
            : passed
            ? "You Passed!"
            : "Not Passed"}
        </h2>
        {passed !== null && (
          <p className="text-sm text-gray-500">
            {passed ? "Great job! You cleared the exam." : "Keep practicing, you'll get there!"}
          </p>
        )}
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{result.score}</p>
          <p className="text-xs text-gray-500 mt-1">Score</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{result.accuracy}%</p>
          <p className="text-xs text-gray-500 mt-1">Accuracy</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {result.correct}/{result.totalQuestions}
          </p>
          <p className="text-xs text-gray-500 mt-1">Correct</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">
            {formatTime(result.timeTaken)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Time Taken</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{result.correct}</p>
            <p className="text-xs text-gray-500">Correct</p>
          </div>
        </Card>
        <Card className="p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{result.wrong}</p>
            <p className="text-xs text-gray-500">Wrong</p>
          </div>
        </Card>
        <Card className="p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{result.skipped}</p>
            <p className="text-xs text-gray-500">Skipped</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-500">Answered</span>
          <span className="font-medium">{result.answered}</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-500">Partially Correct</span>
          <span className="font-medium">{result.partiallyCorrect}</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-500">Avg Time/Question</span>
          <span className="font-medium">{formatTime(result.avgTimePerQuestion)}</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-500">Completion</span>
          <span className="font-medium">{result.completionPercentage}%</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onReview}
          variant="outline"
          className="flex-1 gap-2"
        >
          Review Answers
        </Button>
        <Button
          onClick={onRetake}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          Retake Exam
        </Button>
      </div>
    </div>
  );
}
