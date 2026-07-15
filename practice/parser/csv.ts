import type { QuestionParser } from "./types";
import type { ParsedQuestion } from "../types";
import { detectQuestionType } from "./base";

export const csvParser: QuestionParser = {
  supportedFormats: ["csv"],

  async parse(content: string | ArrayBuffer): Promise<ParsedQuestion[]> {
    const text =
      typeof content === "string" ? content : new TextDecoder().decode(content);
    const questions: ParsedQuestion[] = [];

    const lines = parseCSVLines(text);
    if (lines.length < 2) return [];

    const header = lines[0].map((h) => h.toLowerCase().trim());
    const questionIdx = header.findIndex(
      (h) => h === "question" || h === "text" || h === "question_text"
    );
    const optionsIdx = header.findIndex(
      (h) => h === "options" || h === "choices"
    );
    const answerIdx = header.findIndex(
      (h) => h === "answer" || h === "correct_answer" || h === "correct"
    );
    const explanationIdx = header.findIndex((h) => h === "explanation");
    const typeIdx = header.findIndex((h) => h === "type");
    const marksIdx = header.findIndex((h) => h === "marks" || h === "score");

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      if (row.length === 0 || !row[0]?.trim()) continue;

      const questionText = row[questionIdx]?.trim() || "";
      if (!questionText) continue;

      const optionsRaw = row[optionsIdx]?.trim() || "";
      const options = optionsRaw
        ? optionsRaw.split(/[;|]/).map((o) => o.trim()).filter(Boolean)
        : undefined;

      const answerRaw = row[answerIdx]?.trim() || "";
      let answer: string | string[] = answerRaw;
      if (answerRaw.includes(",")) {
        const parts = answerRaw.split(",").map((p) => p.trim()).filter(Boolean);
        if (parts.length > 1) answer = parts;
      }

      const explanation = row[explanationIdx]?.trim() || undefined;
      const marks = parseInt(row[marksIdx]) || 1;

      const type = detectQuestionType(
        questionText,
        options && options.length >= 2 ? options : undefined,
        answer || undefined
      );

      questions.push({
        raw: row.join(","),
        type,
        text: questionText,
        options: options && options.length >= 2 ? options : undefined,
        answer,
        explanation,
      });
    }

    return questions;
  },
};

function parseCSVLines(text: string): string[][] {
  const lines: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        current.push(field);
        field = "";
      } else if (char === "\n" || (char === "\r" && next === "\n")) {
        current.push(field);
        field = "";
        if (current.some((f) => f.trim())) lines.push(current);
        current = [];
        if (char === "\r") i++;
      } else {
        field += char;
      }
    }
  }

  current.push(field);
  if (current.some((f) => f.trim())) lines.push(current);

  return lines;
}
