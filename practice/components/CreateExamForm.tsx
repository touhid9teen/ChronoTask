"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Loader2, Check } from "lucide-react";
import {
  examFormSchema,
  type ExamFormValues,
} from "@/practice/validators/exam";
import { QuestionDifficulty } from "@/practice/types";
import type { PracticeExam } from "@/practice/types";
import { generateId } from "@/practice/utils/id";

interface CreateExamFormProps {
  onSubmit: (exam: PracticeExam) => void;
  initialData?: PracticeExam;
  isEditing?: boolean;
}

export default function CreateExamForm({
  onSubmit,
  initialData,
  isEditing = false,
}: CreateExamFormProps) {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      subject: initialData?.subject || "",
      category: initialData?.category || "",
      difficulty: initialData?.difficulty || QuestionDifficulty.MEDIUM,
      totalMarks: initialData?.totalMarks || 100,
      duration: initialData?.duration || 60,
      passingMarks: initialData?.passingMarks,
      negativeMarks: initialData?.negativeMarks,
      instructions: initialData?.instructions || "",
      tags: initialData?.tags || [],
    },
  });

  const tags = watch("tags");
  const difficulty = watch("difficulty");

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setValue("tags", [...tags, trimmed], { shouldValidate: true });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setValue("tags", tags.filter((t) => t !== tag), { shouldValidate: true });
  };

  const onFormSubmit = (data: ExamFormValues) => {
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const exam: PracticeExam = {
        id: initialData?.id || generateId(),
        ...data,
        questions: initialData?.questions || [],
        createdAt: initialData?.createdAt || now,
        updatedAt: now,
        status: initialData?.status || "draft",
      } as PracticeExam;
      onSubmit(exam);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Title + Description */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="title">Exam Title *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="e.g. Midterm Physics Exam"
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Brief description..."
            rows={2}
          />
        </div>
      </div>

      {/* Subject + Category + Difficulty */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>Subject *</Label>
          <Input {...register("subject")} placeholder="Physics" />
          {errors.subject && (
            <p className="text-xs text-red-500">{errors.subject.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Category *</Label>
          <Input {...register("category")} placeholder="Mechanics" />
          {errors.category && (
            <p className="text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Difficulty</Label>
          <Select
            value={difficulty}
            onValueChange={(v) => setValue("difficulty", v as QuestionDifficulty)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={QuestionDifficulty.EASY}>Easy</SelectItem>
              <SelectItem value={QuestionDifficulty.MEDIUM}>Medium</SelectItem>
              <SelectItem value={QuestionDifficulty.HARD}>Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Marks + Duration + Passing + Negative */}
      <div className="grid grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label>Marks *</Label>
          <Input
            type="number"
            {...register("totalMarks", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Minutes *</Label>
          <Input
            type="number"
            {...register("duration", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Pass Mark</Label>
          <Input
            type="number"
            {...register("passingMarks", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Negative</Label>
          <Input
            type="number"
            step="0.25"
            {...register("negativeMarks", { valueAsNumber: true })}
            placeholder="0.25"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-1.5">
        <Label>Instructions</Label>
        <Textarea
          {...register("instructions")}
          placeholder="Exam instructions for students..."
          rows={2}
        />
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addTag}
            className="shrink-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push("/practice")}
          className="gap-1.5 text-gray-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {isEditing ? "Update" : "Create Exam"}
        </Button>
      </div>
    </form>
  );
}
