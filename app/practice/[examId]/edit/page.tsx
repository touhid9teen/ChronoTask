"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import CreateExamForm from "@/practice/components/CreateExamForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { PracticeExam } from "@/practice/types";

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const { getExamById, updateExam, isLoaded } = usePracticeManager();

  const [exam, setExam] = useState<PracticeExam | null>(null);

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
    router.push("/practice");
  };

  const handleStart = (updated: PracticeExam) => {
    updateExam(updated);
    router.push(`/practice/${examId}/take`);
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
        <div className="max-w-3xl mx-auto px-4 md:px-8 h-16 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/practice")}
            className="text-gray-500 hover:text-gray-900 gap-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Edit Exam</h1>
          <p className="text-sm text-gray-500 mt-1">{exam.title}</p>
        </div>
        <CreateExamForm
          onSubmit={handleExamUpdate}
          onStart={handleStart}
          initialData={exam}
          isEditing
        />
      </main>
    </div>
  );
}
