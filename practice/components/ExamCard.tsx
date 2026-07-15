"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  FileText,
  Target,
  Trash2,
  Play,
  Edit,
  BarChart3,
} from "lucide-react";
import type { PracticeExam } from "@/practice/types";
import { QuestionDifficulty } from "@/practice/types";

const difficultyColor: Record<string, string> = {
  [QuestionDifficulty.EASY]:
    "bg-green-100 text-green-700 border-green-200",
  [QuestionDifficulty.MEDIUM]:
    "bg-yellow-100 text-yellow-700 border-yellow-200",
  [QuestionDifficulty.HARD]: "bg-red-100 text-red-700 border-red-200",
};

interface ExamCardProps {
  exam: PracticeExam;
  onDelete: (id: string) => void;
  onTake: (id: string) => void;
  onEdit: (id: string) => void;
  onViewAnalytics: (id: string) => void;
  resultCount: number;
}

export default function ExamCard({
  exam,
  onDelete,
  onTake,
  onEdit,
  onViewAnalytics,
  resultCount,
}: ExamCardProps) {
  return (
    <Card className="p-5 hover:shadow-md transition-all border border-gray-100 group">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-lg">
              {exam.title}
            </h3>
            {exam.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {exam.description}
              </p>
            )}
          </div>
          <Badge
            className={`${difficultyColor[exam.difficulty]} shrink-0 text-xs`}
          >
            {exam.difficulty}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            {exam.questions.length} questions
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {exam.duration} min
          </span>
          <span className="flex items-center gap-1">
            <Target className="w-3.5 h-3.5" />
            {exam.totalMarks} marks
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Badge variant="outline" className="text-xs">
            {exam.subject}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {exam.category}
          </Badge>
          {resultCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {resultCount} attempts
            </Badge>
          )}
        </div>

        {exam.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {exam.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {exam.tags.length > 4 && (
              <span className="text-[10px] text-gray-400">
                +{exam.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
          <Button
            size="sm"
            onClick={() => onTake(exam.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            Take Exam
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(exam.id)}
            className="gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Button>
          {resultCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewAnalytics(exam.id)}
              className="gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(exam.id)}
            className="ml-auto text-gray-400 hover:text-red-500 hover:bg-red-50 gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
