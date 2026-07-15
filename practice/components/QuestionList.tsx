"use client";

import { useState } from "react";
import QuestionEditor from "./QuestionEditor";
import type { Question } from "@/practice/types";

interface QuestionListProps {
  questions: Question[];
  onUpdate: (questions: Question[]) => void;
}

export default function QuestionList({ questions, onUpdate }: QuestionListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleUpdate = (index: number, updated: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updated;
    onUpdate(newQuestions);
  };

  const handleDelete = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    onUpdate(
      newQuestions.map((q, i) => ({ ...q, order: i + 1 }))
    );
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newQuestions = [...questions];
    const dragged = newQuestions.splice(dragIndex, 1)[0];
    newQuestions.splice(index, 0, dragged);
    onUpdate(
      newQuestions.map((q, i) => ({ ...q, order: i + 1 }))
    );
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="space-y-2">
      {questions.map((q, i) => (
        <div
          key={q.id}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragEnd={handleDragEnd}
          className={`transition-opacity ${dragIndex === i ? "opacity-50" : ""}`}
        >
          <QuestionEditor
            question={q}
            index={i}
            onUpdate={(updated) => handleUpdate(i, updated)}
            onDelete={() => handleDelete(i)}
          />
        </div>
      ))}
    </div>
  );
}
