"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Task } from "../hooks/useTaskManager";
import { useRouter } from "next/navigation";

export default function AddTaskCard({ tasks, setTasks, queue, setQueue }: any) {
  const [title, setTitle] = useState("");
  

  const addTask = () => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status: "not-completed",
      date: new Date().toISOString().split("T")[0],
    };
    setTasks([...tasks, newTask]);
    setQueue([...queue, newTask]);
    setTitle("");
    
  };

  return (
    <Card className="p-6 border-2 border-gray-300">
      <h3 className="font-semibold text-lg text-black mb-4">Add New Task</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="border-gray-300"
        />
        <Button
          onClick={addTask}
          className="bg-black hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
