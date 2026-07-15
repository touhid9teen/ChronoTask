"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import ExamList from "@/practice/components/ExamList";
import ExamDeleteDialog from "@/practice/components/ExamDeleteDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, History } from "lucide-react";

export default function PracticePage() {
  const router = useRouter();
  const { exams, results, deleteExam, isLoaded } = usePracticeManager();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const resultCounts: Record<string, number> = {};
  results.forEach((r) => {
    resultCounts[r.examId] = (resultCounts[r.examId] || 0) + 1;
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteExam(deleteId);
      setDeleteId(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading exams...</p>
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
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-900 gap-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/practice/analytics")}
              className="gap-1.5"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/practice/history")}
              className="gap-1.5"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Practice Exams</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, manage, and take practice exams
          </p>
        </div>

        <ExamList
          exams={exams}
          resultCounts={resultCounts}
          onDeleteExam={setDeleteId}
        />
      </main>

      <ExamDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        examTitle={
          exams.find((e) => e.id === deleteId)?.title || ""
        }
      />
    </div>
  );
}
