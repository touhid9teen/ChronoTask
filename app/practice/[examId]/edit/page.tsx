"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import CreateExamForm from "@/practice/components/CreateExamForm";
import QuestionImporter from "@/practice/components/QuestionImporter";
import QuestionList from "@/practice/components/QuestionList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Plus, Save, Loader2 } from "lucide-react";
import type { PracticeExam, Question } from "@/practice/types";

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const { getExamById, updateExam, isLoaded } = usePracticeManager();

  const [exam, setExam] = useState<PracticeExam | null>(null);
  const [showImporter, setShowImporter] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const found = getExamById(examId);
      if (found) {
        setExam({ ...found });
      } else {
        router.push("/practice");
      }
    }
  }, [isLoaded, examId, getExamById, router]);

  const handleExamUpdate = (updated: PracticeExam) => {
    setExam(updated);
    updateExam(updated);
  };

  const handleQuestionsImported = (questions: Question[]) => {
    if (!exam) return;
    const maxOrder = exam.questions.length;
    const newQuestions = questions.map((q, i) => ({
      ...q,
      id: q.id || `${Date.now()}-${i}`,
      order: maxOrder + i + 1,
    }));
    const updated = {
      ...exam,
      questions: [...exam.questions, ...newQuestions],
      updatedAt: new Date().toISOString(),
    };
    setExam(updated);
    updateExam(updated);
    setShowImporter(false);
  };

  const handleQuestionUpdate = (updated: Question[]) => {
    if (!exam) return;
    const newExam = {
      ...exam,
      questions: updated,
      updatedAt: new Date().toISOString(),
    };
    setExam(newExam);
    updateExam(newExam);
  };

  const handleSave = async () => {
    if (!exam) return;
    setIsSaving(true);
    try {
      updateExam(exam);
      await new Promise((res) => setTimeout(res, 300));
      router.push("/practice");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/practice")}
            className="text-gray-500 hover:text-gray-900 gap-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gray-900 hover:bg-gray-800 text-white gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save & Exit"}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <CreateExamForm
          onSubmit={handleExamUpdate}
          initialData={exam}
          isEditing
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Questions ({exam.questions.length})
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImporter(!showImporter)}
                className="gap-1.5"
              >
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const newQ: Question = {
                    id: `${Date.now()}`,
                    type: "mcq" as any,
                    text: "",
                    options: ["", "", "", ""],
                    correctAnswer: "",
                    marks: 1,
                    difficulty: "medium" as any,
                    order: exam.questions.length + 1,
                    createdAt: new Date().toISOString(),
                  };
                  handleQuestionsImported([newQ]);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>
          </div>

          {showImporter && (
            <QuestionImporter
              onQuestionsImported={handleQuestionsImported}
              onClose={() => setShowImporter(false)}
            />
          )}

          {exam.questions.length > 0 ? (
            <QuestionList
              questions={exam.questions}
              onUpdate={handleQuestionUpdate}
            />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">No questions yet</p>
              <p className="text-sm text-gray-400">
                Import questions from a file or add them manually
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
