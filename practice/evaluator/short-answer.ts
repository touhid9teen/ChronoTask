import type { QuestionEvaluator } from "./types";
import type { Question, UserAnswer, QuestionResult } from "../types";

export const shortAnswerEvaluator: QuestionEvaluator = {
  evaluate(question: Question, answer: UserAnswer): QuestionResult {
    const userAns = String(answer.value).trim();
    const isAnswered = userAns.length > 0;

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
