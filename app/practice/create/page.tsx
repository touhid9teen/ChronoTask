"use client";

import { useRouter } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import CreateExamForm from "@/practice/components/CreateExamForm";
import type { PracticeExam } from "@/practice/types";

export default function CreateExamPage() {
  const router = useRouter();
  const { addExam } = usePracticeManager();

  const handleSave = (exam: PracticeExam) => {
    addExam(exam);
    router.push("/practice");
  };

  const handleCreateAndStart = (exam: PracticeExam) => {
    addExam(exam);
    router.push(`/practice/${exam.id}/take`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Practice Exam
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Set up exam details, add questions, then start the test
          </p>
        </div>
        <CreateExamForm
          onSubmit={handleSave}
          onStart={handleCreateAndStart}
        />
      </main>
    </div>
  );
}
