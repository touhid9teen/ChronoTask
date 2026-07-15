import type { QuestionEvaluator } from "./types";
import type { Question, UserAnswer, QuestionResult } from "../types";

export const trueFalseEvaluator: QuestionEvaluator = {
  evaluate(question: Question, answer: UserAnswer): QuestionResult {
    const userAns = String(answer.value).trim().toLowerCase();
    const correctAns = String(question.correctAnswer).trim().toLowerCase();
    const isCorrect = userAns === correctAns && userAns !== "";

    return {
      questionId: question.id,
      userAnswer: answer.value,
      correctAnswer: question.correctAnswer,
      isCorrect,
      isPartial: false,
      marksObtained: isCorrect ? question.marks : 0,
      marksPossible: question.marks,
      timeSpent: answer.timeSpent,
    };
  },
};
