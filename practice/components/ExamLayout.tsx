"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Flag, Send } from "lucide-react";
import ExamTimer from "./ExamTimer";
import QuestionRenderer from "./QuestionRenderer";
import AnswerSheet from "./AnswerSheet";
import ConfirmSubmitDialog from "./ConfirmSubmitDialog";
import type { Question, ExamSession, UserAnswer } from "@/practice/types";

interface ExamLayoutProps {
  examTitle: string;
  questions: Question[];
  session: ExamSession;
  currentIndex: number;
  timerFormatted: string;
  timerIsRunning: boolean;
  timerIsUrgent: boolean;
  timerIsCritical: boolean;
  timerIsPaused: boolean;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onNavigate: (index: number) => void;
  onAnswer: (questionId: string, value: string | string[]) => void;
  onToggleFlag: (questionId: string) => void;
  onSubmit: () => void;
  getQuestionStatus: (id: string) => string;
  getStats: (total: number) => { answered: number; flagged: number; unanswered: number };
}

export default function ExamLayout({
  examTitle,
  questions,
  session,
  currentIndex,
  timerFormatted,
  timerIsRunning,
  timerIsUrgent,
  timerIsCritical,
  timerIsPaused,
  onPauseTimer,
  onResumeTimer,
  onNavigate,
  onAnswer,
  onToggleFlag,
  onSubmit,
  getQuestionStatus,
  getStats,
}: ExamLayoutProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const currentQuestion = questions[currentIndex];
  const currentAnswer = session.answers[currentQuestion?.id];
  const stats = getStats(questions.length);
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header bar — timer + progress */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate hidden sm:block">
              {examTitle}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ExamTimer
              formatted={timerFormatted}
              isRunning={timerIsRunning}
              isUrgent={timerIsUrgent}
              isCritical={timerIsCritical}
              isPaused={timerIsPaused}
              onPause={onPauseTimer}
              onResume={onResumeTimer}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSheet(!showSheet)}
              className="gap-1.5"
            >
              Sheet
            </Button>
            <Button
              size="sm"
              onClick={() => setShowConfirm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Submit
            </Button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Question area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Question number + marks + flag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-blue-600">
                  Q{currentIndex + 1}
                </span>
                <span className="text-xs text-gray-400">
                  of {questions.length}
                </span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                  {currentQuestion.marks} mark{currentQuestion.marks > 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={() => onToggleFlag(currentQuestion.id)}
                className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  currentAnswer?.flagged
                    ? "bg-yellow-100 text-yellow-700"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                }`}
              >
                <Flag
                  className={`w-4 h-4 ${
                    currentAnswer?.flagged ? "fill-yellow-400" : ""
                  }`}
                />
                {currentAnswer?.flagged ? "Flagged" : "Flag"}
              </button>
            </div>

            {/* Question text */}
            <p className="text-gray-900 text-base leading-relaxed">
              {currentQuestion.text}
            </p>

            {/* Answer options */}
            <QuestionRenderer
              question={currentQuestion}
              answer={currentAnswer}
              onAnswer={(value) => onAnswer(currentQuestion.id, value)}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => onNavigate(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>

              <span className="text-xs text-gray-400">
                {stats.answered} answered · {stats.unanswered} left
              </span>

              {currentIndex < questions.length - 1 ? (
                <Button
                  onClick={() => onNavigate(currentIndex + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowConfirm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Answer sheet sidebar */}
        {showSheet && (
          <aside className="w-64 border-l border-gray-200 bg-white p-4 overflow-y-auto shrink-0">
            <AnswerSheet
              questions={questions}
              currentIndex={currentIndex}
              getQuestionStatus={getQuestionStatus}
              onNavigate={(i) => {
                onNavigate(i);
                setShowSheet(false);
              }}
            />
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>Answered: {stats.answered}</p>
              <p>Flagged: {stats.flagged}</p>
              <p>Unanswered: {stats.unanswered}</p>
            </div>
          </aside>
        )}
      </div>

      <ConfirmSubmitDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={onSubmit}
        answered={stats.answered}
        total={questions.length}
      />
    </div>
  );
}
