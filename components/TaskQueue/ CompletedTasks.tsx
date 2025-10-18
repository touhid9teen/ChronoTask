"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Task } from "../hooks/useTaskManager";

export default function CompletedTasks({ tasks, setTasks, setQueue }: any) {
  const completed = tasks.filter((t: Task) => t.status === "completed");

  const deleteTask = (id: string) => {
    setTasks((t: Task[]) => t.filter((task) => task.id !== id));
    setQueue((q: Task[]) => q.filter((task) => task.id !== id));
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-black">
        Completed Tasks ({completed.length})
      </h2>
      {completed.length === 0 ? (
        <p className="text-gray-500">No completed tasks yet.</p>
      ) : (
        completed.map((task: Task) => (
          <Card key={task.id} className="p-4 border-2 border-gray-300">
            <div className="flex justify-between items-center">
              <p className="text-black font-medium">{task.title}</p>
              <Button
                onClick={() => deleteTask(task.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
