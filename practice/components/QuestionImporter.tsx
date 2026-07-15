"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
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
        setError(
          `Unsupported file format. Supported: PDF, DOCX, TXT, Markdown, CSV, JSON`
        );
        setIsParsing(false);
        return;
      }

      const parser = getParser(format);
      const buffer = await file.arrayBuffer();
      const parsed: ParsedQuestion[] = await parser.parse(buffer);

      if (parsed.length === 0) {
        setError("No questions found in the file. Please check the format.");
        setIsParsing(false);
        return;
      }

      const questions = normalizeQuestions(parsed);

      const allErrors: string[] = [];
      questions.forEach((q, i) => {
        const result = validateQuestion(q, i);
        if (!result.valid) {
          allErrors.push(...result.errors);
        }
      });

      setValidationErrors(allErrors);
      setPreview(questions);
    } catch (err) {
      console.error("Parse error:", err);
      setError(
        `Failed to parse file: ${err instanceof Error ? err.message : "Unknown error"}`
      );
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

  const handleImport = () => {
    if (preview) {
      onQuestionsImported(preview);
    }
  };

  return (
    <Card className="p-5 border-dashed border-2 border-blue-200 bg-blue-50/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Import Questions</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {!preview ? (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            {isParsing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm text-gray-600">Parsing file...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Drop a file here or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports PDF, DOCX, TXT, Markdown, CSV, JSON
                  </p>
                </div>
              </div>
            )}
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.txt,.md,.csv,.json"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {preview.length} questions parsed successfully
          </div>

          {validationErrors.length > 0 && (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-yellow-700 mb-2">
                <AlertTriangle className="w-4 h-4" />
                {validationErrors.length} validation issue(s)
              </div>
              <ul className="text-xs text-yellow-600 space-y-1 ml-6">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto space-y-2">
            {preview.map((q, i) => (
              <div key={q.id} className="p-3 bg-white rounded-lg border text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-400 mt-0.5 shrink-0">
                    {i + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {q.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        {q.type.replace("_", " ")}
                      </span>
                      {q.options && <span>{q.options.length} options</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreview(null)}>
              Re-upload
            </Button>
            <Button onClick={handleImport} className="bg-blue-600 hover:bg-blue-700 text-white">
              Import {preview.length} Questions
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
