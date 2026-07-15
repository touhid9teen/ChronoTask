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

const QUESTION_START_RE =
  /^(?:Q(?:uestion)?[\.\s:]*)?\d+[\.\)]\s*/i;

const OPTION_RE =
  /^[A-Z][\.\)]\s*/i;

function isQuestionStart(line: string): boolean {
  return QUESTION_START_RE.test(line);
}

function parseTextQuestions(text: string): ParsedQuestion[] {
  const allLines = text.split("\n").map((l) => l.trim());

  const rawBlocks: string[] = [];
  let current: string[] = [];

  for (const line of allLines) {
    if (!line) {
      if (current.length > 0) {
        rawBlocks.push(current.join("\n"));
        current = [];
      }
      continue;
    }

    if (isQuestionStart(line) && current.length > 0) {
      rawBlocks.push(current.join("\n"));
      current = [];
    }

    current.push(line);
  }
  if (current.length > 0) {
    rawBlocks.push(current.join("\n"));
  }

  if (rawBlocks.length === 0) {
    const singleBlock = allLines.filter(Boolean).join("\n");
    if (singleBlock) rawBlocks.push(singleBlock);
  }

  const questions: ParsedQuestion[] = [];

  for (const block of rawBlocks) {
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

      if (
        l.toLowerCase().startsWith("answer:")
      ) {
        const ansValue = l.substring(7).trim();
        if (ansValue) answer = ansValue;
      } else if (
        l.toLowerCase().startsWith("explanation:")
      ) {
        explanation = l.substring(12).trim();
      } else if (OPTION_RE.test(l)) {
        const opt = l.replace(OPTION_RE, "").trim();
        if (opt) options.push(opt);
      } else if (!questionText) {
        questionText = l
          .replace(QUESTION_START_RE, "")
          .trim();
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
