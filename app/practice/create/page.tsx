"use client";

import { useRouter } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import CreateExamForm from "@/practice/components/CreateExamForm";
import type { PracticeExam } from "@/practice/types";

export default function CreateExamPage() {
  const router = useRouter();
  const { addExam } = usePracticeManager();

  const handleSubmit = (exam: PracticeExam) => {
    addExam(exam);
    router.push(`/practice/${exam.id}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Practice Exam
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Set up your exam details, then add questions
          </p>
        </div>
        <CreateExamForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
