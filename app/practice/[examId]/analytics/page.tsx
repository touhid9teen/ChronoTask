"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import StatsOverview from "@/practice/components/analytics/StatsOverview";
import CorrectWrongPie from "@/practice/components/analytics/CorrectWrongPie";
import TypePerformanceBar from "@/practice/components/analytics/TypePerformanceBar";
import DifficultyAnalysis from "@/practice/components/analytics/DifficultyAnalysis";
import SpeedAnalysis from "@/practice/components/analytics/SpeedAnalysis";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { PracticeExam, ExamResult } from "@/practice/types";

export default function ExamAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const { getExamById, getResultsForExam, isLoaded } = usePracticeManager();

  const [exam, setExam] = useState<PracticeExam | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    if (isLoaded) {
      const found = getExamById(examId);
      if (found) setExam(found);
      const res = getResultsForExam(examId);
      setExamResults(res);
    }
  }, [isLoaded, examId, getExamById, getResultsForExam]);

  if (!isLoaded || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const latestResult = examResults[examResults.length - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center">
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

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">{exam.title}</p>
        </div>

        {examResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No results yet. Take the exam first.</p>
          </div>
        ) : (
          <Tabs defaultValue="latest">
            <TabsList>
              <TabsTrigger value="latest">Latest Attempt</TabsTrigger>
              <TabsTrigger value="history">
                All Attempts ({examResults.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="space-y-6 mt-4">
              {latestResult && (
                <>
                  <StatsOverview result={latestResult} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <CorrectWrongPie result={latestResult} />
                    <TypePerformanceBar
                      result={latestResult}
                      questions={exam.questions}
                    />
                    <DifficultyAnalysis
                      result={latestResult}
                      questions={exam.questions}
                    />
                    <SpeedAnalysis
                      result={latestResult}
                      questions={exam.questions}
                    />
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6 mt-4">
              <div className="space-y-8">
                {[...examResults]
                  .reverse()
                  .map((r) => (
                    <div key={r.id} className="space-y-4">
                      <p className="text-xs text-gray-400">
                        {new Date(r.submittedAt).toLocaleString()}
                      </p>
                      <StatsOverview result={r} />
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
