"use client";

import { useState } from "react";

import TimerCard from "./TimerCard";
import AddTaskCard from "./AddTaskCard";
import TaskQueueList from "./TaskQueueList";
import { useTaskManager } from "../hooks/useTaskManager";
import HeaderBar from "./HeaderBar";
import CompletedTasks from "./ CompletedTasks";
import AppFooter from "./footer";

export default function TaskQueue() {
  const { tasks, setTasks, queue, setQueue, isLoaded } = useTaskManager();
  const [view, setView] = useState<"home" | "completed">("home");
  console.log("view1:", view);
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <HeaderBar view={view} setView={setView} />
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {view === "home" && (
          <>
            <TimerCard queue={queue} setQueue={setQueue} setTasks={setTasks} />
            <AddTaskCard
              tasks={tasks}
              setTasks={setTasks}
              queue={queue}
              setQueue={setQueue}
            />
            <TaskQueueList
              queue={queue}
              setQueue={setQueue}
              setTasks={setTasks}
            />
          </>
        )}
        {view === "completed" && (
          <CompletedTasks
            tasks={tasks}
            setTasks={setTasks}
            setQueue={setQueue}
          />
        )}
      </div>
      <AppFooter />
    </main>
  );
}
