import type { QuestionEvaluator } from "./types";
import type { Question, UserAnswer, QuestionResult } from "../types";

export const mcqEvaluator: QuestionEvaluator = {
  evaluate(question: Question, answer: UserAnswer): QuestionResult {
    const userAns = String(answer.value).trim();
    const correctAns = String(question.correctAnswer).trim();
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
