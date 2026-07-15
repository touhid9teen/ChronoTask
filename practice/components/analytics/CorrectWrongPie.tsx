"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { ExamResult } from "@/practice/types";
import { Card } from "@/components/ui/card";

interface CorrectWrongPieProps {
  result: ExamResult;
}

const COLORS = ["#22c55e", "#ef4444", "#eab308", "#d1d5db"];

export default function CorrectWrongPie({ result }: CorrectWrongPieProps) {
  const data = [
    { name: "Correct", value: result.correct },
    { name: "Wrong", value: result.wrong },
    { name: "Partially Correct", value: result.partiallyCorrect },
    { name: "Skipped", value: result.skipped },
  ].filter((d) => d.value > 0);

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Correct vs Wrong
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
