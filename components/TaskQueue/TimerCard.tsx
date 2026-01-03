"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle2, Play, Pause } from "lucide-react";
import { Task } from "../../hooks/useTaskManager";
import { useRouter } from "next/navigation";

export default function TimerCard({
  queue,
  setQueue,
  setTasks,
}: {
  queue: Task[];
  setQueue: any;
  setTasks: any;
}) {
  const [timer, setTimer] = useState(1200);
  const [isRunning, setIsRunning] = useState(false);
  const currentTask = queue[0];
  const route = useRouter();

  useEffect(() => {
    if (!isRunning || !currentTask) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          completeTask();
          return 1200;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, currentTask]);

  const completeTask = () => {
    if (!currentTask) return;
    setQueue((q: Task[]) => q.slice(1));
    setTasks((t: Task[]) =>
      t.map((task) =>
        task.id === currentTask.id ? { ...task, status: "completed" } : task
      )
    );
    setTimer(1200);
    route.push("/tasks/" + currentTask.id);
  };

  if (!currentTask) {
    return (
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No Active Task</h3>
          <p className="text-sm text-gray-600">
            Add a task below to get started with your 20-minute focus session
          </p>
        </div>
      </Card>
    );
  }

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const progress = ((1200 - timer) / 1200) * 100;

  return (
    <Card className="p-6 md:p-8 bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Current Task
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {currentTask.title}
          </h2>
        </div>
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="text-5xl md:text-6xl font-bold text-gray-900 font-mono tracking-tight">
            {String(minutes).padStart(2, "0")}
            <span className="text-gray-400">:</span>
            {String(seconds).padStart(2, "0")}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {isRunning ? "Focus time remaining" : "Ready to start"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          size="lg"
          variant={isRunning ? "outline" : "default"}
          className="gap-2 cursor-pointer transition-all duration-150 hover:scale-105"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={completeTask}
          size="lg"
          className="gap-2 bg-green-600 hover:bg-green-700 text-white cursor-pointer transition-all duration-150 hover:scale-105"
        >
          <CheckCircle2 className="w-4 h-4" />
          Complete
        </Button>
      </div>
    </Card>
  );
}
