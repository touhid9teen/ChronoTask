"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle2 } from "lucide-react";
import { Task } from "../hooks/useTaskManager";
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

  if (!currentTask) return null;

  return (
    <Card className="p-6 bg-black text-white border-2 border-black space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-lg md:text-xl font-bold">{currentTask.title}</h2>
        <div className="text-3xl font-mono font-bold">
          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 bg-white text-black hover:bg-gray-200"
        >
          <Clock className="w-4 h-4 mr-2" />
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          onClick={completeTask}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Complete
        </Button>
      </div>
    </Card>
  );
}
