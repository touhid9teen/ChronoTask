"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import ResultSummary from "@/practice/components/ResultSummary";
import ReviewMode from "@/practice/components/ReviewMode";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { PracticeExam, ExamResult } from "@/practice/types";

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const sessionId = params.sessionId as string;
  const { getExamById, results, isLoaded } = usePracticeManager();

  const [exam, setExam] = useState<PracticeExam | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const found = getExamById(examId);
      if (found) setExam(found);

      const r = results.find(
        (res) => res.id === sessionId || res.sessionId === sessionId
      );
      if (r) setResult(r);
    }
  }, [isLoaded, examId, sessionId, getExamById, results]);

  if (!isLoaded || !exam || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
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
        {showReview ? (
          <ReviewMode
            result={result}
            questions={exam.questions}
            onBack={() => setShowReview(false)}
          />
        ) : (
          <ResultSummary
            result={result}
            passingMarks={exam.passingMarks}
            onReview={() => setShowReview(true)}
            onRetake={() => router.push(`/practice/${examId}/take`)}
          />
        )}
      </main>
    </div>
  );
}
