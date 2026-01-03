"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GripVertical, Trash2, ListTodo, Sparkles } from "lucide-react";
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
    <Card className="p-6 md:p-8 bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <ListTodo className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              Task Queue
            </h3>
            <p className="text-xs text-gray-500">
              {queue.length} {queue.length === 1 ? 'task' : 'tasks'} in queue
            </p>
          </div>
        </div>
        {queue.length > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Drag to reorder
          </span>
        )}
      </div>

      {queue.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Your queue is empty</p>
          <p className="text-sm text-gray-400">
            Add tasks above to start your focus sessions
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {queue.map((task: Task, index: number) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => setDraggedId(task.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, task.id)}
              className={`group p-4 rounded-lg border-2 cursor-move transition-all duration-150 ${
                draggedId === task.id
                  ? "opacity-50 border-blue-400 bg-blue-50 scale-95"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
              } ${index === 0 ? "ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30" : ""}`}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        Next
                      </span>
                    )}
                    <span className="text-xs font-medium text-gray-400">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1 truncate">
                    {task.title}
                  </p>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-50 hover:text-red-600"
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
