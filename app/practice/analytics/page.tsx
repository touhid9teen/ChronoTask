"use client";

import { useRouter } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import TimelineChart from "@/practice/components/analytics/TimelineChart";
import StatsOverview from "@/practice/components/analytics/StatsOverview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BarChart3 } from "lucide-react";

export default function GlobalAnalyticsPage() {
  const router = useRouter();
  const { exams, results, isLoaded } = usePracticeManager();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (results.length === 0) {
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
        <main className="max-w-5xl mx-auto p-4 md:p-8 text-center py-20">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No Analytics Yet
          </h3>
          <p className="text-sm text-gray-500">
            Complete some exams to see your analytics.
          </p>
        </main>
      </div>
    );
  }

  const totalCorrect = results.reduce((s, r) => s + r.correct, 0);
  const totalWrong = results.reduce((s, r) => s + r.wrong, 0);
  const totalSkipped = results.reduce((s, r) => s + r.skipped, 0);
  const avgAccuracy =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.accuracy, 0) / results.length)
      : 0;

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
        <h1 className="text-2xl font-bold text-gray-900">
          Overall Analytics
        </h1>

        <div className="grid grid-cols-4 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            <p className="text-xs text-gray-500">Total Attempts</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{totalCorrect}</p>
            <p className="text-xs text-gray-500">Total Correct</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{totalWrong}</p>
            <p className="text-xs text-gray-500">Total Wrong</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{avgAccuracy}%</p>
            <p className="text-xs text-gray-500">Avg Accuracy</p>
          </Card>
        </div>

        <TimelineChart results={results} />
      </main>
    </div>
  );
}
