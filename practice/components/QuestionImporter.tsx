"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { detectFormat } from "@/practice/parser/detector";
import { getParser } from "@/practice/parser";
import { normalizeQuestions } from "@/practice/utils/normalizer";
import { validateQuestion } from "@/practice/validators/question";
import type { Question, ParsedQuestion } from "@/practice/types";

interface QuestionImporterProps {
  onQuestionsImported: (questions: Question[]) => void;
  onClose: () => void;
}

export default function QuestionImporter({
  onQuestionsImported,
  onClose,
}: QuestionImporterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Question[] | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    setPreview(null);
    setValidationErrors([]);
    setIsParsing(true);

    try {
      const format = detectFormat(file.name, file.type);
      if (!format) {
        setError("Unsupported format. Use PDF, DOCX, TXT, MD, CSV, JSON");
        setIsParsing(false);
        return;
      }

      const parser = getParser(format);
      const buffer = await file.arrayBuffer();
      const parsed: ParsedQuestion[] = await parser.parse(buffer);

      if (parsed.length === 0) {
        setError("No questions found in the file.");
        setIsParsing(false);
        return;
      }

      const questions = normalizeQuestions(parsed);
      const allErrors: string[] = [];
      questions.forEach((q, i) => {
        const result = validateQuestion(q, i);
        if (!result.valid) allErrors.push(...result.errors);
      });

      setValidationErrors(allErrors);
      setPreview(questions);
    } catch (err) {
      setError(`Parse failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  if (!preview) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
        className={`border border-dashed rounded-md px-4 py-3 flex items-center justify-center gap-3 cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
      >
        {isParsing ? (
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
        ) : (
          <Upload className="w-4 h-4 text-gray-400" />
        )}
        <span className="text-sm text-gray-600">
          {isParsing ? "Parsing..." : "Drop a file here or click to browse"}
        </span>
        <span className="text-xs text-gray-400">·</span>
        <span className="text-xs text-gray-400">
          PDF, DOCX, TXT, MD, CSV, JSON
        </span>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.docx,.txt,.md,.csv,.json"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {error}
        </p>
      )}
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg text-sm text-green-700">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        {preview.length} questions parsed
        {validationErrors.length > 0 && (
          <span className="text-yellow-600 ml-2">
            ({validationErrors.length} issues)
          </span>
        )}
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1">
        {preview.map((q, i) => (
          <div
            key={q.id}
            className="flex items-center gap-2 p-2 bg-white rounded border text-xs"
          >
            <span className="text-gray-400 shrink-0">{i + 1}.</span>
            <span className="truncate text-gray-900 flex-1">{q.text}</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
              {q.type.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>
          Re-upload
        </Button>
        <Button
          size="sm"
          onClick={() => onQuestionsImported(preview)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Import {preview.length} Questions
        </Button>
      </div>
    </div>
  );
}
