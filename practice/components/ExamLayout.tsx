"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [showSidebar, setShowSidebar] = useState(false);
  const currentQuestion = questions[currentIndex];
  const currentAnswer = session.answers[currentQuestion?.id];
  const stats = getStats(questions.length);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 truncate">
              {examTitle}
            </h1>
            <span className="text-xs text-gray-400 shrink-0">
              Q{currentIndex + 1}/{questions.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
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
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden lg:flex gap-1.5"
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
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {currentIndex + 1}
                  </span>
                  <span className="text-xs text-gray-400">
                    {currentQuestion.marks} mark{currentQuestion.marks > 1 ? "s" : ""}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFlag(currentQuestion.id)}
                  className={`gap-1.5 ${
                    currentAnswer?.flagged
                      ? "text-yellow-600 hover:text-yellow-700"
                      : "text-gray-400 hover:text-yellow-600"
                  }`}
                >
                  <Flag
                    className={`w-4 h-4 ${
                      currentAnswer?.flagged ? "fill-yellow-400" : ""
                    }`}
                  />
                  {currentAnswer?.flagged ? "Flagged" : "Flag"}
                </Button>
              </div>

              <p className="text-gray-900 text-base leading-relaxed mb-6">
                {currentQuestion.text}
              </p>

              <QuestionRenderer
                question={currentQuestion}
                answer={currentAnswer}
                onAnswer={(value) =>
                  onAnswer(currentQuestion.id, value)
                }
              />
            </Card>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => onNavigate(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={() => onNavigate(currentIndex + 1)}
                disabled={currentIndex === questions.length - 1}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <aside
          className={`w-72 border-l border-gray-200 bg-white p-4 overflow-y-auto hidden lg:block ${
            showSidebar ? "!block" : ""
          }`}
        >
          <AnswerSheet
            questions={questions}
            currentIndex={currentIndex}
            getQuestionStatus={getQuestionStatus}
            onNavigate={(i) => {
              onNavigate(i);
              setShowSidebar(false);
            }}
          />
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p>Answered: {stats.answered}</p>
            <p>Flagged: {stats.flagged}</p>
            <p>Unanswered: {stats.unanswered}</p>
          </div>
        </aside>
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
