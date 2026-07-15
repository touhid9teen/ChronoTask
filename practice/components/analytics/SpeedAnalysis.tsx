"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { ExamResult, Question } from "@/practice/types";
import { Card } from "@/components/ui/card";

interface SpeedAnalysisProps {
  result: ExamResult;
  questions: Question[];
}

export default function SpeedAnalysis({ result, questions }: SpeedAnalysisProps) {
  const data = result.questionResults.map((qr, i) => {
    const q = questions.find((q) => q.id === qr.questionId);
    return {
      name: `Q${i + 1}`,
      time: qr.timeSpent,
      correct: qr.isCorrect ? 1 : 0,
    };
  });

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Answer Speed (seconds per question)
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value: number) => [`${value}s`, "Time"]}
          />
          <Bar dataKey="time" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
