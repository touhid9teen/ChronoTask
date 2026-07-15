import type { QuestionEvaluator } from "./types";
import type { Question, UserAnswer, QuestionResult } from "../types";

export const multiCorrectEvaluator: QuestionEvaluator = {
  evaluate(question: Question, answer: UserAnswer): QuestionResult {
    const userAns = Array.isArray(answer.value)
      ? answer.value.map((v) => String(v).trim()).sort()
      : typeof answer.value === "string"
      ? answer.value.split(",").map((v) => v.trim()).sort()
      : [];

    const correctAns = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.map((v) => String(v).trim()).sort()
      : [String(question.correctAnswer).trim()];

    const correctSet = new Set(correctAns);
    const userSet = new Set(userAns);

    const correctSelected = userAns.filter((a) => correctSet.has(a)).length;
    const wrongSelected = userAns.filter((a) => !correctSet.has(a)).length;

    const isCorrect =
      correctSelected === correctAns.length && wrongSelected === 0;
    const isPartial =
      !isCorrect && correctSelected > 0 && wrongSelected === 0;

    let marksObtained = 0;
    if (isCorrect) {
      marksObtained = question.marks;
    } else if (isPartial) {
      marksObtained = Math.round(
        (correctSelected / correctAns.length) * question.marks * 100
      ) / 100;
    }

    return {
      questionId: question.id,
      userAnswer: answer.value,
      correctAnswer: question.correctAnswer,
      isCorrect,
      isPartial,
      marksObtained,
      marksPossible: question.marks,
      timeSpent: answer.timeSpent,
    };
  },
};
