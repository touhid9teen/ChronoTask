"use client";

import { useRouter } from "next/navigation";
import { usePracticeManager } from "@/hooks/usePracticeManager";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { formatTime } from "@/practice/utils/stats";

export default function PracticeHistory() {
  const router = useRouter();
  const { getExamHistory, isLoaded } = usePracticeManager();
  const history = getExamHistory();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading history...</p>
      </div>
    );
  }

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

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Practice History
        </h1>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No practice history yet. Take an exam to get started.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map(({ result, exam }) => (
                  <TableRow key={result.id}>
                    <TableCell className="text-xs text-gray-500">
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {exam?.title || "Unknown"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {result.score}/{exam?.totalMarks || "?"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          result.accuracy >= 70 ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {result.accuracy}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {formatTime(result.timeTaken)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {exam?.passingMarks
                          ? result.score >= exam.passingMarks
                            ? "Passed"
                            : "Failed"
                          : "Completed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/practice/${result.examId}/result/${result.id}`
                          )
                        }
                        className="gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
