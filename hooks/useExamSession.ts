"use client";

import { useState, useEffect, useCallback } from "react";
import type { ExamSession, UserAnswer } from "@/practice/types";
import { ExamStatus } from "@/practice/types";
import { generateId } from "@/practice/utils/id";

const SESSION_KEY = "currentExamSession";

export function useExamSession(examId: string, durationMinutes: number) {
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed: ExamSession = JSON.parse(stored);
        if (parsed.examId === examId && parsed.status === ExamStatus.IN_PROGRESS) {
          setSession(parsed);
          return;
        }
      } catch {}
    }

    const newSession: ExamSession = {
      id: generateId(),
      examId,
      startedAt: new Date().toISOString(),
      answers: {},
      timeRemaining: durationMinutes * 60,
      status: ExamStatus.IN_PROGRESS,
    };
    setSession(newSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  }, [examId, durationMinutes]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }, [session]);

  const saveAnswer = useCallback(
    (questionId: string, value: string | string[], timeSpent: number) => {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: {
              questionId,
              value,
              timeSpent,
              flagged: prev.answers[questionId]?.flagged || false,
            },
          },
        };
      });
    },
    []
  );

  const toggleFlag = useCallback((questionId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const existing = prev.answers[questionId];
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: {
            questionId,
            value: existing?.value || "",
            timeSpent: existing?.timeSpent || 0,
            flagged: !existing?.flagged,
          },
        },
      };
    });
  }, []);

  const updateTimeRemaining = useCallback((remaining: number) => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, timeRemaining: remaining };
    });
  }, []);

  const submitSession = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        submittedAt: new Date().toISOString(),
        status: ExamStatus.SUBMITTED,
      };
    });
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  const getQuestionStatus = useCallback(
    (questionId: string) => {
      if (!session) return "unanswered";
      const answer = session.answers[questionId];
      if (!answer) return "unanswered";
      if (answer.flagged) return "review";
      if (
        answer.value !== "" &&
        answer.value !== null &&
        answer.value !== undefined &&
        (Array.isArray(answer.value) ? answer.value.length > 0 : true)
      ) {
        return "answered";
      }
      return "unanswered";
    },
    [session]
  );

  const getStats = useCallback(
    (totalQuestions: number) => {
      if (!session)
        return { answered: 0, flagged: 0, unanswered: totalQuestions };
      const answers = Object.values(session.answers);
      const answered = answers.filter(
        (a) =>
          a.value !== "" &&
          a.value !== null &&
          a.value !== undefined &&
          (Array.isArray(a.value) ? a.value.length > 0 : true)
      ).length;
      const flagged = answers.filter((a) => a.flagged).length;
      return {
        answered,
        flagged,
        unanswered: totalQuestions - answered,
      };
    },
    [session]
  );

  return {
    session,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    saveAnswer,
    toggleFlag,
    updateTimeRemaining,
    submitSession,
    clearSession,
    getQuestionStatus,
    getStats,
  };
}
