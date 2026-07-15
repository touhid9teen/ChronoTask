import type { QuestionEvaluator } from "./types";
import type { Question, UserAnswer, QuestionResult } from "../types";

export const longAnswerEvaluator: QuestionEvaluator = {
  evaluate(question: Question, answer: UserAnswer): QuestionResult {
    return {
      questionId: question.id,
      userAnswer: answer.value,
      correctAnswer: question.correctAnswer,
      isCorrect: false,
      isPartial: false,
      marksObtained: 0,
      marksPossible: question.marks,
      timeSpent: answer.timeSpent,
    };
  },
};
