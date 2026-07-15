"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ExamResult, Question } from "@/practice/types";
import { getTypePerformance } from "@/practice/utils/stats";
import { Card } from "@/components/ui/card";

interface TypePerformanceBarProps {
  result: ExamResult;
  questions: Question[];
}

const COLORS = ["#22c55e", "#ef4444"];

export default function TypePerformanceBar({ result, questions }: TypePerformanceBarProps) {
  const performance = getTypePerformance(result, questions);

  const data = performance.map((p) => ({
    name: p.type,
    correct: p.correct,
    wrong: p.wrong,
    accuracy: p.accuracy,
  }));

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Performance by Question Type
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="correct" fill="#22c55e" name="Correct" radius={[4, 4, 0, 0]} />
          <Bar dataKey="wrong" fill="#ef4444" name="Wrong" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
