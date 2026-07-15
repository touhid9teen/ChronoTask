"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle, Clock, Target, BarChart3 } from "lucide-react";
import type { ExamResult } from "@/practice/types";
import { formatTime } from "@/practice/utils/stats";

interface StatsOverviewProps {
  result: ExamResult;
}

export default function StatsOverview({ result }: StatsOverviewProps) {
  const stats = [
    {
      label: "Score",
      value: `${result.score}`,
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Accuracy",
      value: `${result.accuracy}%`,
      icon: BarChart3,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Correct",
      value: String(result.correct),
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Wrong",
      value: String(result.wrong),
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      label: "Time Taken",
      value: formatTime(result.timeTaken),
      icon: Clock,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
    {
      label: "Avg Time/Q",
      value: formatTime(result.avgTimePerQuestion),
      icon: Clock,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-3 text-center">
          <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
          <p className="text-[10px] text-gray-500">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
