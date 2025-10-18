"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Task } from "../hooks/useTaskManager";
import { useRouter } from "next/navigation";

interface CompletedTasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setQueue: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function CompletedTasks({
  tasks,
  setTasks,
  setQueue,
}: CompletedTasksProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Filter completed tasks by selected date
  const completed = tasks.filter(
    (t) => t.status === "completed" && t.date === selectedDate
  );

  const deleteTask = (id: string) => {
    setTasks((t) => t.filter((task) => task.id !== id));
    setQueue((q) => q.filter((task) => task.id !== id));
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-black">
        Completed Tasks ({completed.length})
      </h2>

      {/* Date filter */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Filter by date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {completed.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No completed tasks for this date
        </p>
      ) : (
        <div className="space-y-3">
          {completed.map((task) => (
            <Card
              key={task.id}
              className="p-4 border-2 border-gray-300 cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/tasks/${task.id}`)}
            >
              <div className="flex justify-between items-center">
                <p className="text-black font-medium">{task.title}</p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigating when deleting
                    deleteTask(task.id);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
