import type { ExamResult, QuestionResult, Question } from "../types";

export interface TypePerformance {
  type: string;
  correct: number;
  wrong: number;
  total: number;
  accuracy: number;
}

export interface DifficultyPerformance {
  difficulty: string;
  correct: number;
  total: number;
  accuracy: number;
}

export interface SubjectPerformance {
  subject: string;
  correct: number;
  total: number;
  accuracy: number;
}

export function getTypePerformance(
  result: ExamResult,
  questions: Question[]
): TypePerformance[] {
  const map = new Map<string, { correct: number; total: number }>();

  for (const qr of result.questionResults) {
    const q = questions.find((q) => q.id === qr.questionId);
    if (!q) continue;
    const entry = map.get(q.type) || { correct: 0, total: 0 };
    entry.total++;
    if (qr.isCorrect) entry.correct++;
    map.set(q.type, entry);
  }

  return Array.from(map.entries()).map(([type, data]) => ({
    type: type.replace("_", " "),
    correct: data.correct,
    wrong: data.total - data.correct,
    total: data.total,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
  }));
}

export function getDifficultyPerformance(
  result: ExamResult,
  questions: Question[]
): DifficultyPerformance[] {
  const map = new Map<string, { correct: number; total: number }>();

  for (const qr of result.questionResults) {
    const q = questions.find((q) => q.id === qr.questionId);
    if (!q) continue;
    const entry = map.get(q.difficulty) || { correct: 0, total: 0 };
    entry.total++;
    if (qr.isCorrect) entry.correct++;
    map.set(q.difficulty, entry);
  }

  return Array.from(map.entries()).map(([difficulty, data]) => ({
    difficulty,
    correct: data.correct,
    total: data.total,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
  }));
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
