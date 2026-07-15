"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { ExamResult } from "@/practice/types";
import { Card } from "@/components/ui/card";

interface TimelineChartProps {
  results: ExamResult[];
}

export default function TimelineChart({ results }: TimelineChartProps) {
  const sorted = [...results].sort(
    (a, b) =>
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  );

  const data = sorted.map((r, i) => ({
    name: `Attempt ${i + 1}`,
    score: r.score,
    accuracy: r.accuracy,
    date: new Date(r.submittedAt).toLocaleDateString(),
  }));

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Score Over Time
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value: number, name: string) => [
              value,
              name === "score" ? "Score" : "Accuracy %",
            ]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
