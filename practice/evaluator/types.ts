import type { Question, UserAnswer, QuestionResult } from "../types";

export interface QuestionEvaluator {
  evaluate(question: Question, answer: UserAnswer): QuestionResult;
}
