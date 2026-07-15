"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import type {
  PracticeData,
  PracticeExam,
  ExamSession,
  ExamResult,
} from "../practice/types";
import {
  loadPracticeData,
  savePracticeData,
} from "../practice/utils/storage";

export function usePracticeManager() {
  const { data: session, status } = useSession();
  const [exams, setExams] = useState<PracticeExam[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error">(
    "idle"
  );

  const DRIVE_FILE_NAME = "practiceExamData.json";

  useEffect(() => {
    const initializeData = async () => {
      if (status === "loading") return;

      const isDriveAvailable =
        status === "authenticated" && !!session?.accessToken;

      if (isDriveAvailable) {
        try {
          setSyncStatus("syncing");
          const response = await fetch("/api/drive/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: DRIVE_FILE_NAME }),
          });

          if (response.ok) {
            const data: PracticeData = await response.json();
            setExams(data.exams || []);
            setSessions(data.sessions || []);
            setResults(data.results || []);
            setIsLoaded(true);
            setSyncStatus("idle");
            return;
          }
        } catch (error) {
          console.error("Drive download failed for practice data:", error);
          setSyncStatus("error");
        }
      }

      const localData = loadPracticeData();
      setExams(localData.exams);
      setSessions(localData.sessions);
      setResults(localData.results);
      setIsLoaded(true);
      setSyncStatus("idle");
    };

    initializeData();
  }, [status, session]);

  useEffect(() => {
    if (!isLoaded) return;

    const data: PracticeData = { exams, sessions, results };
    savePracticeData(data);

    if (status === "authenticated" && session?.accessToken) {
      uploadToCloud(data);
    }
  }, [exams, sessions, results, isLoaded, status, session]);

  const uploadToCloud = async (data: PracticeData) => {
    try {
      setSyncStatus("syncing");
      const formData = new FormData();
      formData.append("fileName", DRIVE_FILE_NAME);
      formData.append("content", JSON.stringify(data));

      const response = await fetch("/api/drive/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSyncStatus("idle");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Drive sync failed for practice data:", error);
      setSyncStatus("error");
    }
  };

  const addExam = useCallback((exam: PracticeExam) => {
    setExams((prev) => [...prev, exam]);
  }, []);

  const updateExam = useCallback((updated: PracticeExam) => {
    setExams((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  }, []);

  const deleteExam = useCallback((examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
    setSessions((prev) => prev.filter((s) => s.examId !== examId));
    setResults((prev) => prev.filter((r) => r.examId !== examId));
  }, []);

  const addSession = useCallback((session: ExamSession) => {
    setSessions((prev) => [...prev, session]);
  }, []);

  const updateSession = useCallback((updated: ExamSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  }, []);

  const addResult = useCallback((result: ExamResult) => {
    setResults((prev) => [...prev, result]);
  }, []);

  const getExamById = useCallback(
    (examId: string) => exams.find((e) => e.id === examId),
    [exams]
  );

  const getSessionsForExam = useCallback(
    (examId: string) => sessions.filter((s) => s.examId === examId),
    [sessions]
  );

  const getResultsForExam = useCallback(
    (examId: string) => results.filter((r) => r.examId === examId),
    [results]
  );

  const getExamHistory = useCallback(() => {
    return results
      .map((result) => {
        const exam = exams.find((e) => e.id === result.examId);
        const session = sessions.find((s) => s.id === result.sessionId);
        return { result, exam, session };
      })
      .sort(
        (a, b) =>
          new Date(b.result.submittedAt).getTime() -
          new Date(a.result.submittedAt).getTime()
      );
  }, [results, exams, sessions]);

  return {
    exams,
    sessions,
    results,
    isLoaded,
    syncStatus,
    addExam,
    updateExam,
    deleteExam,
    addSession,
    updateSession,
    addResult,
    getExamById,
    getSessionsForExam,
    getResultsForExam,
    getExamHistory,
  };
}
