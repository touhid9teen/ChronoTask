import type { QuestionParser } from "./types";
import type { ParsedQuestion } from "../types";
import { detectQuestionType } from "./base";

export const docxParser: QuestionParser = {
  supportedFormats: ["docx"],

  async parse(content: string | ArrayBuffer): Promise<ParsedQuestion[]> {
    const mammoth = await import("mammoth");

    const buffer =
      content instanceof ArrayBuffer
        ? content
        : new TextEncoder().encode(content).buffer;

    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    const text = result.value;

    return parseTextQuestions(text);
  },
};

function parseTextQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const blocks = text.split(/\n\s*\n/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const lines = trimmed.split("\n").filter((l) => l.trim());
    if (lines.length === 0) continue;

    let questionText = "";
    const options: string[] = [];
    let answer = "";
    let explanation = "";

    for (const line of lines) {
      const l = line.trim();

      if (l.match(/^[A-D][\.\)]\s*/i)) {
        const opt = l.replace(/^[A-D][\.\)]\s*/i, "").trim();
        if (opt) options.push(opt);
      } else if (l.toLowerCase().startsWith("answer:")) {
        answer = l.substring(7).trim();
      } else if (l.toLowerCase().startsWith("explanation:")) {
        explanation = l.substring(12).trim();
      } else if (!questionText) {
        questionText = l.replace(/^\d+[\.\)]\s*/, "").trim();
      } else {
        questionText += " " + l;
      }
    }

    if (!questionText) continue;

    const type = detectQuestionType(
      questionText,
      options.length >= 2 ? options : undefined,
      answer || undefined
    );

    questions.push({
      raw: block,
      type,
      text: questionText,
      options: options.length >= 2 ? options : undefined,
      answer: answer || "",
      explanation: explanation || undefined,
    });
  }

  return questions;
}
