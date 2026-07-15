import { QuestionType } from "../types";
import type { QuestionEvaluator } from "./types";
import { mcqEvaluator } from "./mcq";
import { multiCorrectEvaluator } from "./multi-correct";
import { trueFalseEvaluator } from "./true-false";
import { fillBlankEvaluator } from "./fill-blank";
import { shortAnswerEvaluator } from "./short-answer";
import { longAnswerEvaluator } from "./long-answer";

const evaluators: Record<string, QuestionEvaluator> = {
  [QuestionType.MCQ]: mcqEvaluator,
  [QuestionType.MULTIPLE_CORRECT]: multiCorrectEvaluator,
  [QuestionType.TRUE_FALSE]: trueFalseEvaluator,
  [QuestionType.FILL_BLANK]: fillBlankEvaluator,
  [QuestionType.SHORT_ANSWER]: shortAnswerEvaluator,
  [QuestionType.LONG_ANSWER]: longAnswerEvaluator,
};

export function getEvaluator(type: QuestionType): QuestionEvaluator {
  return evaluators[type] || shortAnswerEvaluator;
}

export {
  mcqEvaluator,
  multiCorrectEvaluator,
  trueFalseEvaluator,
  fillBlankEvaluator,
  shortAnswerEvaluator,
  longAnswerEvaluator,
};
