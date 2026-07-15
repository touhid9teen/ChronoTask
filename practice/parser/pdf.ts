import type { QuestionParser } from "./types";
import type { ParsedQuestion } from "../types";
import { detectQuestionType } from "./base";

export const pdfParser: QuestionParser = {
  supportedFormats: ["pdf"],

  async parse(content: string | ArrayBuffer): Promise<ParsedQuestion[]> {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "";

    const data = new Uint8Array(
      content instanceof ArrayBuffer ? content : new TextEncoder().encode(content as string)
    );
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n\n";
    }

    return parseTextQuestions(fullText);
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
