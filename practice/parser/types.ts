import type { ParsedQuestion } from "../types";

export type FileFormat = "markdown" | "csv" | "json" | "txt" | "pdf" | "docx";

export interface QuestionParser {
  parse(content: string | ArrayBuffer): Promise<ParsedQuestion[]>;
  supportedFormats: FileFormat[];
}
