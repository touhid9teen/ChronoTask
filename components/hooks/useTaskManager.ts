"use client";

import { useState, useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  status: "not-completed" | "completed";
  date: string;
  learningNotes?: string;
}

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [queue, setQueue] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load once from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("taskQueueData");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setTasks(data.tasks || []);
        setQueue(data.queue || []);
      } catch (err) {
        console.error("Failed to parse local data", err);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save when updated
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("taskQueueData", JSON.stringify({ tasks, queue }));
    }
  }, [tasks, queue, isLoaded]);

  return { tasks, setTasks, queue, setQueue, isLoaded };
}
