"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { ExamResult, Question } from "@/practice/types";
import { getDifficultyPerformance } from "@/practice/utils/stats";
import { Card } from "@/components/ui/card";

interface DifficultyAnalysisProps {
  result: ExamResult;
  questions: Question[];
}

const COLOR_MAP: Record<string, string> = {
  easy: "#22c55e",
  medium: "#eab308",
  hard: "#ef4444",
};

export default function DifficultyAnalysis({ result, questions }: DifficultyAnalysisProps) {
  const performance = getDifficultyPerformance(result, questions);
  const data = performance.map((p) => ({
    name: p.difficulty,
    accuracy: p.accuracy,
    total: p.total,
    correct: p.correct,
  }));

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Difficulty Analysis
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Accuracy"]}
          />
          <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLOR_MAP[entry.name] || "#9ca3af"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
