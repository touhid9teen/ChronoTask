"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Task } from "../../hooks/useTaskManager";

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
    <Card className="p-6 md:p-8 bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">Add New Task</h3>
          <p className="text-xs text-gray-500">Create a 20-minute focus session</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="What would you like to work on?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-150"
        />
        <Button
          onClick={addTask}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all duration-150 hover:scale-105 px-6"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
