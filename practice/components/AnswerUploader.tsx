"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";

interface AnswerUploaderProps {
  onAnswersUploaded: (answers: Record<string, string>) => void;
  onClose: () => void;
}

export default function AnswerUploader({
  onAnswersUploaded,
  onClose,
}: AnswerUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      const text = await file.text();
      const answers: Record<string, string> = {};

      if (file.name.endsWith(".json")) {
        const data = JSON.parse(text);
        Object.assign(answers, data);
      } else if (file.name.endsWith(".csv")) {
        const lines = text.split("\n").filter((l) => l.trim());
        for (const line of lines) {
          const [q, a] = line.split(",").map((s) => s.trim());
          if (q && a) answers[q] = a;
        }
      } else {
        setError("Supported formats for answer upload: JSON, CSV");
        setIsProcessing(false);
        return;
      }

      onAnswersUploaded(answers);
    } catch (err) {
      setError("Failed to parse answer file");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <Card className="p-5 border-dashed border-2 border-blue-200 bg-blue-50/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Upload Answer File</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => document.getElementById("answer-upload")?.click()}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Processing...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drop answer file or click to browse
            </p>
            <p className="text-xs text-gray-400">JSON, CSV</p>
          </div>
        )}
        <input
          id="answer-upload"
          type="file"
          accept=".json,.csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}
    </Card>
  );
}
