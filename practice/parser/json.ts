import type { QuestionParser } from "./types";
import type { ParsedQuestion } from "../types";
import { QuestionType } from "../types";

interface JSONQuestion {
  question?: string;
  text?: string;
  type?: string;
  options?: string[];
  choices?: string[];
  answer?: string | string[];
  correctAnswer?: string | string[];
  correct_answer?: string | string[];
  explanation?: string;
  marks?: number;
  difficulty?: string;
}

export const jsonParser: QuestionParser = {
  supportedFormats: ["json"],

  async parse(content: string | ArrayBuffer): Promise<ParsedQuestion[]> {
    const text =
      typeof content === "string" ? content : new TextDecoder().decode(content);
    const parsed = JSON.parse(text);
    const questions: ParsedQuestion[] = [];

    const items: JSONQuestion[] = Array.isArray(parsed)
      ? parsed
      : parsed.questions || parsed.data || [parsed];

    for (const item of items) {
      const questionText = item.question || item.text || "";
      if (!questionText) continue;

      const options = item.options || item.choices;
      const answer = item.answer || item.correctAnswer || item.correct_answer || "";

      let type: QuestionType;
      switch (item.type?.toLowerCase()) {
        case "mcq":
        case "multiple_choice":
          type = QuestionType.MCQ;
          break;
        case "multiple_correct":
        case "multi_answer":
          type = QuestionType.MULTIPLE_CORRECT;
          break;
        case "true_false":
        case "boolean":
          type = QuestionType.TRUE_FALSE;
          break;
        case "fill_blank":
        case "fill_in_blank":
          type = QuestionType.FILL_BLANK;
          break;
        case "short_answer":
          type = QuestionType.SHORT_ANSWER;
          break;
        case "long_answer":
        case "essay":
          type = QuestionType.LONG_ANSWER;
          break;
        default:
          type = inferType(questionText, options, answer);
      }

      questions.push({
        raw: JSON.stringify(item),
        type,
        text: questionText,
        options,
        answer,
        explanation: item.explanation,
      });
    }

    return questions;
  },
};

function inferType(
  text: string,
  options?: string[],
  answer?: string | string[]
): QuestionType {
  if (options && options.length >= 2) {
    if (Array.isArray(answer) && answer.length > 1) {
      return QuestionType.MULTIPLE_CORRECT;
    }
    return QuestionType.MCQ;
  }

  if (typeof answer === "string") {
    const lower = answer.toLowerCase().trim();
    if (lower === "true" || lower === "false") {
      return QuestionType.TRUE_FALSE;
    }
  }

  if (text.includes("____") || text.includes("___")) {
    return QuestionType.FILL_BLANK;
  }

  return QuestionType.SHORT_ANSWER;
}
