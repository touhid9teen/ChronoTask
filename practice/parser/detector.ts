import type { FileFormat } from "./types";

const EXTENSION_MAP: Record<string, FileFormat> = {
  ".md": "markdown",
  ".markdown": "markdown",
  ".csv": "csv",
  ".json": "json",
  ".txt": "txt",
  ".text": "txt",
  ".pdf": "pdf",
  ".docx": "docx",
};

const MIME_MAP: Record<string, FileFormat> = {
  "text/markdown": "markdown",
  "text/csv": "csv",
  "application/json": "json",
  "text/plain": "txt",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

export function detectFormat(
  fileName: string,
  mimeType?: string
): FileFormat | null {
  const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
  if (EXTENSION_MAP[ext]) return EXTENSION_MAP[ext];
  if (mimeType && MIME_MAP[mimeType]) return MIME_MAP[mimeType];

  const lower = fileName.toLowerCase();
  if (lower.endsWith(".md")) return "markdown";
  if (lower.endsWith(".csv")) return "csv";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".txt")) return "txt";
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";

  return null;
}
