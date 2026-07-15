"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Check, Trash2 } from "lucide-react";
import { QuestionDifficulty, QuestionType } from "@/practice/types";
import type { PracticeExam, Question } from "@/practice/types";
import { generateId } from "@/practice/utils/id";
import QuestionImporter from "./QuestionImporter";

interface CreateExamFormProps {
  onSubmit: (exam: PracticeExam) => void;
  onStart?: (exam: PracticeExam) => void;
  initialData?: PracticeExam;
  isEditing?: boolean;
}

export default function CreateExamForm({
  onSubmit,
  onStart,
  initialData,
  isEditing = false,
}: CreateExamFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || []
  );

  const [title, setTitle] = useState(initialData?.title || "");
  const [duration, setDuration] = useState(initialData?.duration || 60);
  const [marksPerQuestion, setMarksPerQuestion] = useState(initialData?.questions?.[0]?.marks || 1);
  const [negativeMarks, setNegativeMarks] = useState(initialData?.negativeMarks || 0);

  const buildExam = (): PracticeExam => {
    const now = new Date().toISOString();
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    return {
      id: initialData?.id || generateId(),
      title,
      description: "",
      subject: "",
      category: "",
      difficulty: QuestionDifficulty.MEDIUM,
      totalMarks: totalMarks || questions.length * marksPerQuestion,
      duration,
      negativeMarks: negativeMarks || undefined,
      instructions: "",
      tags: [],
      questions: questions.map((q) => ({ ...q, marks: q.marks || marksPerQuestion })),
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
      status: initialData?.status || "draft",
    };
  };

  const handleSave = () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      onSubmit(buildExam());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStart = () => {
    if (!title.trim() || questions.length === 0) return;
    onStart?.(buildExam());
  };

  const handleQuestionsImported = (imported: Question[]) => {
    const newQs = imported.map((q, i) => ({
      ...q,
      id: q.id || `${Date.now()}-${i}`,
      order: questions.length + i + 1,
    }));
    setQuestions((prev) => [...prev, ...newQs]);
    setShowImporter(false);
  };

  const updateQuestion = (i: number, updated: Question) => {
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? updated : q)));
  };

  const removeQuestion = (i: number) => {
    setQuestions((prev) =>
      prev.filter((_, idx) => idx !== i).map((q, idx) => ({ ...q, order: idx + 1 }))
    );
  };

  return (
    <div className="space-y-5">
      {/* Exam details */}
      <div className="space-y-1.5">
        <Label>Exam Title *</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Physics Midterm"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>Duration (min) *</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Marks / Q</Label>
          <Input
            type="number"
            value={marksPerQuestion}
            onChange={(e) => setMarksPerQuestion(parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Negative Mark</Label>
          <Input
            type="number"
            step="0.25"
            value={negativeMarks || ""}
            onChange={(e) => setNegativeMarks(parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Questions ({questions.length})
          </h3>
        </div>

        <QuestionImporter
          onQuestionsImported={handleQuestionsImported}
        />

        {questions.length > 0 && (
          <div className="space-y-2">
            {questions.map((q, i) => (
              <Card key={q.id} className="p-3">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded shrink-0">
                    Q{i + 1}
                  </span>
                  <div className="flex-1 min-w-0 space-y-2">
                    <Input
                      value={q.text}
                      onChange={(e) =>
                        updateQuestion(i, { ...q, text: e.target.value })
                      }
                      placeholder="Question text..."
                      className="text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Select
                        value={q.type}
                        onValueChange={(v) =>
                          updateQuestion(i, { ...q, type: v as QuestionType })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={QuestionType.MCQ}>MCQ</SelectItem>
                          <SelectItem value={QuestionType.MULTIPLE_CORRECT}>Multi Correct</SelectItem>
                          <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
                          <SelectItem value={QuestionType.FILL_BLANK}>Fill Blank</SelectItem>
                          <SelectItem value={QuestionType.SHORT_ANSWER}>Short Answer</SelectItem>
                          <SelectItem value={QuestionType.LONG_ANSWER}>Long Answer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={String(q.correctAnswer || "")}
                        onChange={(e) =>
                          updateQuestion(i, { ...q, correctAnswer: e.target.value })
                        }
                        placeholder="Answer"
                        className="text-xs h-8"
                      />
                    </div>
                    {(q.type === QuestionType.MCQ ||
                      q.type === QuestionType.MULTIPLE_CORRECT) && (
                      <div className="grid grid-cols-2 gap-1.5">
                        {(q.options || []).map((opt, oi) => (
                          <Input
                            key={oi}
                            value={opt}
                            onChange={(e) => {
                              const opts = [...(q.options || [])];
                              opts[oi] = e.target.value;
                              updateQuestion(i, { ...q, options: opts });
                            }}
                            placeholder={`${String.fromCharCode(65 + oi)}.`}
                            className="text-xs h-7"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-gray-300 hover:text-red-500"
                    onClick={() => removeQuestion(i)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/practice")}
          className="gap-1.5 text-gray-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSubmitting || !title.trim()}
            className="gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save
          </Button>
          {questions.length > 0 && onStart && (
            <Button
              onClick={handleStart}
              disabled={isSubmitting || !title.trim()}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <Check className="w-4 h-4" />
              Start Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
