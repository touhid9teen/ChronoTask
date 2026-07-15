import type { ParsedQuestion, QuestionType } from "../types";
import { QuestionType as QT } from "../types";

export function detectQuestionType(
  text: string,
  options?: string[],
  answer?: string | string[]
): QuestionType {
  if (options && options.length >= 2) {
    if (Array.isArray(answer) && answer.length > 1) {
      return QT.MULTIPLE_CORRECT;
    }
    return QT.MCQ;
  }

  if (answer !== undefined) {
    const ans = Array.isArray(answer) ? answer[0] : String(answer);
    const lower = ans.toLowerCase().trim();
    if (lower === "true" || lower === "false") {
      return QT.TRUE_FALSE;
    }
  }

  if (text.includes("____") || text.includes("___") || text.includes("______")) {
    return QT.FILL_BLANK;
  }

  return QT.SHORT_ANSWER;
}
