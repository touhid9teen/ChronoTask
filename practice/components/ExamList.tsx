"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, BookOpen } from "lucide-react";
import ExamCard from "./ExamCard";
import type { PracticeExam } from "@/practice/types";

interface ExamListProps {
  exams: PracticeExam[];
  resultCounts: Record<string, number>;
  onDeleteExam: (id: string) => void;
}

export default function ExamList({
  exams,
  resultCounts,
  onDeleteExam,
}: ExamListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = exams.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some((t) =>
        t.toLowerCase().includes(search.toLowerCase())
      )
  );

  if (exams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No Practice Exams
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          Create your first practice exam to start testing your knowledge.
        </p>
        <Button
          onClick={() => router.push("/practice/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Exam
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => router.push("/practice/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Exam
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No exams match your search.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              resultCount={resultCounts[exam.id] || 0}
              onDelete={onDeleteExam}
              onTake={(id) => router.push(`/practice/${id}/take`)}
              onEdit={(id) => router.push(`/practice/${id}/edit`)}
              onViewAnalytics={(id) =>
                router.push(`/practice/${id}/result/${id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
