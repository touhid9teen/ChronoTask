import type { QuestionEvaluator } from "./types";
import type { Question, UserAnswer, QuestionResult } from "../types";

export const fillBlankEvaluator: QuestionEvaluator = {
  evaluate(question: Question, answer: UserAnswer): QuestionResult {
    const normalize = (s: string) =>
      String(s)
        .toLowerCase()
        .replace(/[_\s]+/g, " ")
        .trim();

    const userAns = normalize(String(answer.value));
    const correctAns = normalize(String(question.correctAnswer));
    const isCorrect = userAns !== "" && userAns === correctAns;

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
