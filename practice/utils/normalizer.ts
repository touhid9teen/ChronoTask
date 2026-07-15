import type { ParsedQuestion, Question, QuestionType, QuestionDifficulty } from "../types";
import { generateId } from "./id";

export function normalizeQuestions(
  parsed: ParsedQuestion[],
  startOrder: number = 1
): Question[] {
  return parsed.map((pq, i) => ({
    id: generateId(),
    type: normalizeType(pq.type),
    text: pq.text.trim(),
    options: pq.options?.map((o) => o.trim()),
    correctAnswer: normalizeAnswer(pq.answer),
    explanation: pq.explanation?.trim(),
    marks: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    order: startOrder + i,
    createdAt: new Date().toISOString(),
  }));
}

function normalizeType(type: QuestionType): QuestionType {
  return type;
}

function normalizeAnswer(answer: string | string[]): string | string[] {
  if (Array.isArray(answer)) {
    return answer.map((a) => a.trim()).filter(Boolean);
  }
  return answer.trim();
}
