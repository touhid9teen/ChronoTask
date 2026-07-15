"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Plus, X, Loader2 } from "lucide-react";
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

const steps = ["Basic Info", "Settings", "Instructions & Tags", "Review"];

export default function CreateExamForm({
  onSubmit,
  initialData,
  isEditing = false,
}: CreateExamFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExamFormValues>({
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

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
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
      { shouldValidate: true }
    );
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

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                i === step
                  ? "bg-blue-600 text-white"
                  : i < step
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span
              className={`text-xs hidden sm:inline ${
                i === step ? "font-medium text-gray-900" : "text-gray-400"
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div className="w-8 h-px bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Basic Information</h3>
          <div className="space-y-2">
            <Label htmlFor="title">Exam Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g. Midterm Physics Exam"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of the exam..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                {...register("subject")}
                placeholder="e.g. Physics"
              />
              {errors.subject && (
                <p className="text-sm text-red-500">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                {...register("category")}
                placeholder="e.g. Mechanics"
              />
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Exam Settings</h3>
          <div className="space-y-2">
            <Label>Difficulty *</Label>
            <Select
              value={difficulty}
              onValueChange={(v) =>
                setValue("difficulty", v as QuestionDifficulty, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={QuestionDifficulty.EASY}>Easy</SelectItem>
                <SelectItem value={QuestionDifficulty.MEDIUM}>
                  Medium
                </SelectItem>
                <SelectItem value={QuestionDifficulty.HARD}>Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks *</Label>
              <Input
                id="totalMarks"
                type="number"
                {...register("totalMarks", { valueAsNumber: true })}
              />
              {errors.totalMarks && (
                <p className="text-sm text-red-500">
                  {errors.totalMarks.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                {...register("duration", { valueAsNumber: true })}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passingMarks">Passing Marks (optional)</Label>
              <Input
                id="passingMarks"
                type="number"
                {...register("passingMarks", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="negativeMarks">
                Negative Marking (optional)
              </Label>
              <Input
                id="negativeMarks"
                type="number"
                step="0.25"
                {...register("negativeMarks", { valueAsNumber: true })}
                placeholder="e.g. 0.25"
              />
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">
            Instructions & Tags
          </h3>
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              {...register("instructions")}
              placeholder="Exam instructions for students..."
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
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
                onClick={addTag}
                size="icon"
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
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
        </Card>
      )}

      {step === 3 && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Review</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Title</span>
              <span className="font-medium">{watch("title")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Subject</span>
              <span className="font-medium">{watch("subject")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{watch("category")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Difficulty</span>
              <span className="font-medium capitalize">{difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Marks</span>
              <span className="font-medium">{watch("totalMarks")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium">{watch("duration")} min</span>
            </div>
            {watch("passingMarks") && (
              <div className="flex justify-between">
                <span className="text-gray-500">Passing Marks</span>
                <span className="font-medium">{watch("passingMarks")}</span>
              </div>
            )}
            {watch("negativeMarks") && (
              <div className="flex justify-between">
                <span className="text-gray-500">Negative Marking</span>
                <span className="font-medium">
                  -{watch("negativeMarks")} per wrong answer
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Questions</span>
              <span className="font-medium">
                {initialData?.questions.length || 0}
              </span>
            </div>
            {tags.length > 0 && (
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Tags</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                  {tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/practice")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Button>
        <div className="flex gap-2">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
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
              {isEditing ? "Update Exam" : "Create Exam"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
