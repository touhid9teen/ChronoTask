"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { Task } from "../../hooks/useTaskManager";

export default function TaskQueueList({ queue, setQueue, setTasks }: any) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    const draggedIndex = queue.findIndex((t: Task) => t.id === draggedId);
    const targetIndex = queue.findIndex((t: Task) => t.id === targetId);
    const newQueue = [...queue];
    const [draggedTask] = newQueue.splice(draggedIndex, 1);
    newQueue.splice(targetIndex, 0, draggedTask);
    setQueue(newQueue);
    setDraggedId(null);
  };

  const deleteTask = (id: string) => {
    setTasks((t: Task[]) => t.filter((task) => task.id !== id));
    setQueue((q: Task[]) => q.filter((task) => task.id !== id));
  };

  return (
    <Card className="p-6 border-2 border-gray-300">
      <h3 className="font-semibold text-lg text-black mb-4">
        Queue ({queue.length})
      </h3>
      {queue.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Queue is empty</p>
      ) : (
        <div className="space-y-3">
          {queue.map((task: Task, index: number) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => setDraggedId(task.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, task.id)}
              className={`p-4 rounded border-2 cursor-move transition-all ${
                draggedId === task.id
                  ? "opacity-50 border-black bg-gray-100"
                  : "border-gray-300 hover:border-black"
              } ${index === 0 ? "ring-2 ring-black" : ""}`}
            >
              <div className="flex items-start gap-2">
                <GripVertical className="w-4 h-4 text-gray-400 mt-0.5" />
                <p className="text-sm font-medium text-black flex-1">
                  {index + 1}. {task.title}
                </p>
                <Button
                  onClick={() => deleteTask(task.id)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
