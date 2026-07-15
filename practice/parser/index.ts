import type { QuestionParser, FileFormat } from "./types";
import { markdownParser } from "./markdown";
import { csvParser } from "./csv";
import { jsonParser } from "./json";
import { txtParser } from "./txt";
import { pdfParser } from "./pdf";
import { docxParser } from "./docx";

const parsers: Record<FileFormat, QuestionParser> = {
  markdown: markdownParser,
  csv: csvParser,
  json: jsonParser,
  txt: txtParser,
  pdf: pdfParser,
  docx: docxParser,
};

export function getParser(format: FileFormat): QuestionParser {
  const parser = parsers[format];
  if (!parser) {
    throw new Error(`No parser available for format: ${format}`);
  }
  return parser;
}

export function getSupportedFormats(): FileFormat[] {
  return Object.keys(parsers) as FileFormat[];
}

export { markdownParser, csvParser, jsonParser, txtParser, pdfParser, docxParser };
