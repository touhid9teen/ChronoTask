"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import { useExamTimer } from "@/hooks/useExamTimer";
import { useExamSession } from "@/hooks/useExamSession";
import { useAutoSave } from "@/hooks/useAutoSave";
import ExamLayout from "@/practice/components/ExamLayout";
import { evaluateExam } from "@/practice/evaluator/engine";
import type { PracticeExam } from "@/practice/types";
import { Loader2 } from "lucide-react";

export default function TakeExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const { getExamById, addSession, addResult, isLoaded } = usePracticeManager();

  const [exam, setExam] = useState<PracticeExam | null>(null);

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

  const { saveNow } = useAutoSave({
    onSave: () => {},
    enabled: timer.isRunning,
  });

  useEffect(() => {
    if (session && !timer.isRunning) {
      timer.reset(session.timeRemaining);
      timer.start();
    }
  }, [session?.id]);

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
