"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { QuestionType, QuestionDifficulty } from "@/practice/types";
import type { Question } from "@/practice/types";

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (updated: Question) => void;
  onDelete: () => void;
}

export default function QuestionEditor({
  question,
  index,
  onUpdate,
  onDelete,
}: QuestionEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const update = (field: keyof Question, value: any) => {
    onUpdate({ ...question, [field]: value });
  };

  const updateOption = (optIndex: number, value: string) => {
    const opts = [...(question.options || [])];
    opts[optIndex] = value;
    update("options", opts);
  };

  const addOption = () => {
    update("options", [...(question.options || []), ""]);
  };

  const removeOption = (optIndex: number) => {
    const opts = (question.options || []).filter((_, i) => i !== optIndex);
    update("options", opts);
  };

  return (
    <Card
      className={`border transition-all ${
        isOpen
          ? "border-blue-200 shadow-md ring-1 ring-blue-100"
          : "border-gray-200 shadow-sm hover:border-gray-300"
      }`}
    >
      <div
        className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
          isOpen ? "bg-blue-50/30" : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`p-1 rounded-md transition-all duration-200 ${
            isOpen
              ? "bg-blue-100 text-blue-600 rotate-90"
              : "text-gray-400 group-hover:text-gray-600"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-gray-400 shrink-0">
          Q{index + 1}
        </span>
        <span className="text-sm font-medium text-gray-900 flex-1 truncate">
          {question.text || "Untitled Question"}
        </span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded shrink-0">
          {question.type.replace("_", " ")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div
        className={`transition-all duration-200 ease-in-out ${
          isOpen
            ? "max-h-[2000px] opacity-100 border-t border-blue-100"
            : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="p-4 space-y-4 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Question Type</Label>
              <Select
                value={question.type}
                onValueChange={(v) => update("type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={QuestionType.MCQ}>MCQ</SelectItem>
                  <SelectItem value={QuestionType.MULTIPLE_CORRECT}>
                    Multiple Correct
                  </SelectItem>
                  <SelectItem value={QuestionType.TRUE_FALSE}>
                    True / False
                  </SelectItem>
                  <SelectItem value={QuestionType.FILL_BLANK}>
                    Fill in the Blank
                  </SelectItem>
                  <SelectItem value={QuestionType.SHORT_ANSWER}>
                    Short Answer
                  </SelectItem>
                  <SelectItem value={QuestionType.LONG_ANSWER}>
                    Long Answer / Essay
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marks</Label>
                <Input
                  type="number"
                  value={question.marks}
                  onChange={(e) =>
                    update("marks", parseInt(e.target.value) || 1)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={question.difficulty}
                  onValueChange={(v) => update("difficulty", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={QuestionDifficulty.EASY}>
                      Easy
                    </SelectItem>
                    <SelectItem value={QuestionDifficulty.MEDIUM}>
                      Medium
                    </SelectItem>
                    <SelectItem value={QuestionDifficulty.HARD}>
                      Hard
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Question Text *</Label>
            <Textarea
              value={question.text}
              onChange={(e) => update("text", e.target.value)}
              placeholder="Enter question text..."
              rows={2}
            />
          </div>

          {(question.type === QuestionType.MCQ ||
            question.type === QuestionType.MULTIPLE_CORRECT) && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {(question.options || []).map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400 w-6">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <Input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    />
                    {(question.options || []).length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeOption(i)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="w-full"
                >
                  + Add Option
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>
              {question.type === QuestionType.MULTIPLE_CORRECT
                ? "Correct Answers (comma-separated)"
                : question.type === QuestionType.TRUE_FALSE
                ? "Correct Answer"
                : "Correct Answer"}
            </Label>
            {question.type === QuestionType.TRUE_FALSE ? (
              <Select
                value={String(question.correctAnswer)}
                onValueChange={(v) => update("correctAnswer", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="True">True</SelectItem>
                  <SelectItem value="False">False</SelectItem>
                </SelectContent>
              </Select>
            ) : question.type === QuestionType.MULTIPLE_CORRECT ? (
              <Input
                value={
                  Array.isArray(question.correctAnswer)
                    ? question.correctAnswer.join(", ")
                    : String(question.correctAnswer)
                }
                onChange={(e) => {
                  const parts = e.target.value
                    .split(",")
                    .map((p) => p.trim())
                    .filter(Boolean);
                  update("correctAnswer", parts.length > 1 ? parts : e.target.value);
                }}
                placeholder="e.g. A, B, D"
              />
            ) : (
              <Input
                value={String(question.correctAnswer || "")}
                onChange={(e) => update("correctAnswer", e.target.value)}
                placeholder="Enter correct answer"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Explanation (optional)</Label>
            <Textarea
              value={question.explanation || ""}
              onChange={(e) => update("explanation", e.target.value)}
              placeholder="Explanation for the answer..."
              rows={2}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
