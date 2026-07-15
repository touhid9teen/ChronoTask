import type { Question, ExamSession, ExamResult, QuestionResult } from "../types";
import { getEvaluator } from "./index";

export function evaluateExam(
  questions: Question[],
  session: ExamSession
): ExamResult {
  const questionResults: QuestionResult[] = questions.map((q) => {
    const answer = session.answers[q.id];
    if (!answer) {
      return {
        questionId: q.id,
        userAnswer: [],
        correctAnswer: q.correctAnswer,
        isCorrect: false,
        isPartial: false,
        marksObtained: 0,
        marksPossible: q.marks,
        timeSpent: 0,
      };
    }

    const evaluator = getEvaluator(q.type);
    return evaluator.evaluate(q, answer);
  });

  let correct = 0;
  let wrong = 0;
  let partiallyCorrect = 0;
  let answered = 0;
  let totalScore = 0;
  let totalNegative = 0;

  for (const qr of questionResults) {
    const hasAnswer =
      qr.userAnswer !== "" &&
      qr.userAnswer !== null &&
      qr.userAnswer !== undefined &&
      (Array.isArray(qr.userAnswer) ? qr.userAnswer.length > 0 : true);

    if (hasAnswer) {
      answered++;
      if (qr.isCorrect) {
        correct++;
        totalScore += qr.marksObtained;
      } else if (qr.isPartial) {
        partiallyCorrect++;
        totalScore += qr.marksObtained;
      } else {
        wrong++;
      }
    }
  }

  const totalQuestions = questions.length;
  const skipped = totalQuestions - answered;
  const totalPossible = questions.reduce((sum, q) => sum + q.marks, 0);
  const accuracy =
    answered > 0 ? Math.round((correct / answered) * 100) : 0;

  const startTime = new Date(session.startedAt).getTime();
  const endTime = session.submittedAt
    ? new Date(session.submittedAt).getTime()
    : Date.now();
  const timeTaken = Math.round((endTime - startTime) / 1000);
  const avgTimePerQuestion =
    totalQuestions > 0 ? Math.round(timeTaken / totalQuestions) : 0;
  const completionPercentage =
    totalQuestions > 0
      ? Math.round((answered / totalQuestions) * 100)
      : 0;

  return {
    id: `result-${session.id}`,
    sessionId: session.id,
    examId: session.examId,
    totalQuestions,
    answered,
    skipped,
    correct,
    wrong,
    partiallyCorrect,
    accuracy,
    score: Math.round(totalScore * 100) / 100,
    negativeMarks: totalNegative,
    timeTaken,
    avgTimePerQuestion,
    completionPercentage,
    questionResults,
    submittedAt: new Date().toISOString(),
  };
}
