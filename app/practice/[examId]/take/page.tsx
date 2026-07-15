"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import { useExamTimer } from "@/hooks/useExamTimer";
import { useExamSession } from "@/hooks/useExamSession";
import ExamLayout from "@/practice/components/ExamLayout";
import { evaluateExam } from "@/practice/evaluator/engine";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Play,
  Clock,
  FileText,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import type { PracticeExam } from "@/practice/types";

export default function TakeExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const { getExamById, addSession, addResult, isLoaded } = usePracticeManager();

  const [exam, setExam] = useState<PracticeExam | null>(null);
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const found = getExamById(examId);
      if (found && found.questions.length > 0) {
        setExam(found);
      } else {
        router.push("/practice");
      }
    }
  }, [isLoaded, examId, getExamById, router]);

  const {
    session,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    saveAnswer,
    toggleFlag,
    updateTimeRemaining,
    submitSession,
    getQuestionStatus,
    getStats,
  } = useExamSession(examId, exam?.duration || 60);

  const handleTimeUp = () => {
    if (!session || !exam) return;
    const submittedSession = {
      ...session,
      submittedAt: new Date().toISOString(),
    };
    const result = evaluateExam(exam.questions, submittedSession);
    addSession(submittedSession);
    addResult(result);
    localStorage.removeItem("currentExamSession");
    router.push(`/practice/${examId}/result/${result.id}`);
  };

  const timer = useExamTimer({
    initialTime: session?.timeRemaining || (exam?.duration || 60) * 60,
    onTimeUp: handleTimeUp,
    onTick: updateTimeRemaining,
  });

  useEffect(() => {
    if (examStarted && session && !timer.isRunning) {
      timer.reset(session.timeRemaining);
      timer.start();
    }
  }, [examStarted, session?.id]);

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleAnswer = (questionId: string, value: string | string[]) => {
    saveAnswer(questionId, value, 0);
  };

  const handleSubmit = () => {
    if (!exam || !session) return;
    timer.pause();
    const submittedSession = {
      ...session,
      submittedAt: new Date().toISOString(),
    };
    const result = evaluateExam(exam.questions, submittedSession);
    addSession(submittedSession);
    addResult(result);
    localStorage.removeItem("currentExamSession");
    router.push(`/practice/${examId}/result/${result.id}`);
  };

  if (!isLoaded || !exam || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Before exam starts — show confirmation screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 md:px-8 h-16 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/practice/${examId}/edit`)}
              className="text-gray-500 hover:text-gray-900 gap-2 -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </header>

        <main className="max-w-3xl mx-auto p-4 md:p-8">
          <Card className="p-6 md:p-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {exam.title}
                </h1>
                {exam.description && (
                  <p className="text-sm text-gray-500">{exam.description}</p>
                )}
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  {exam.questions.length} questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {exam.duration} minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-medium">{exam.totalMarks}</span> marks
                </span>
              </div>

              {exam.instructions && (
                <div className="p-4 bg-gray-50 rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Instructions
                  </h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {exam.instructions}
                  </p>
                </div>
              )}

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-left">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Before you begin:</p>
                    <ul className="mt-1 space-y-0.5 list-disc list-inside text-yellow-700">
                      <li>
                        The timer will start immediately after you click Start
                      </li>
                      <li>
                        Your answers are auto-saved every 30 seconds
                      </li>
                      <li>The exam auto-submits when time runs out</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/practice/${examId}/edit`)}
                >
                  Go Back
                </Button>
                <Button
                  onClick={handleStartExam}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2 px-8"
                >
                  <Play className="w-4 h-4" />
                  Start Test
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <ExamLayout
      examTitle={exam.title}
      questions={exam.questions}
      session={session}
      currentIndex={currentQuestionIndex}
      timerFormatted={timer.formatted}
      timerIsRunning={timer.isRunning}
      timerIsUrgent={timer.isUrgent}
      timerIsCritical={timer.isCritical}
      timerIsPaused={!timer.isRunning}
      onPauseTimer={timer.pause}
      onResumeTimer={timer.start}
      onNavigate={setCurrentQuestionIndex}
      onAnswer={handleAnswer}
      onToggleFlag={toggleFlag}
      onSubmit={handleSubmit}
      getQuestionStatus={getQuestionStatus}
      getStats={getStats}
    />
  );
}
